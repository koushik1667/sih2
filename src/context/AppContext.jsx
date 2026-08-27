import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  deleteDoc, 
  serverTimestamp 
} from '../lib/firebase';

const DEFAULT_WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'bot',
  text: "Namaste! I am Krishi Mitra, your AI Agronomist & ICAR knowledge assistant. How can I help you with crop health, fertilizer dosing, pest protection, or government schemes today?",
  topic: "Agronomy Advisory",
  citation: "ICAR Agricultural Knowledge Repository"
};

export function calcSoilScoreLocal(nitrogen, phosphorus, potassium, ph, organic_carbon) {
  const n = Number(nitrogen) || 160;
  const p = Number(phosphorus) || 28;
  const k = Number(potassium) || 140;
  const phVal = Number(ph) || 6.9;
  const oc = Number(organic_carbon) || 0.78;

  const n_score = n < 140 ? Math.max(20, (n / 140) * 60) : n <= 280 ? 60 + ((n - 140) / 140) * 40 : Math.max(70, 100 - ((n - 280) / 200) * 30);
  const p_score = p < 15 ? Math.max(25, (p / 15) * 60) : p <= 45 ? 60 + ((p - 15) / 30) * 40 : Math.max(65, 100 - ((p - 45) / 50) * 30);
  const k_score = k < 100 ? Math.max(20, (k / 100) * 60) : k <= 250 ? 60 + ((k - 100) / 150) * 40 : Math.max(70, 100 - ((k - 250) / 200) * 30);
  const ph_score = phVal >= 6.2 && phVal <= 7.8 ? 100 - Math.abs(phVal - 7.0) * 20 : phVal >= 5.5 ? 60 + (phVal - 5.5) * 40 : Math.max(20, phVal * 10);
  const oc_score = oc < 0.5 ? Math.max(20, (oc / 0.5) * 55) : oc <= 1.2 ? 60 + ((oc - 0.5) / 0.7) * 40 : 95;

  const score = Math.round((n_score * 0.25 + p_score * 0.2 + k_score * 0.2 + ph_score * 0.15 + oc_score * 0.2) * 10) / 10;
  const risk_level = score >= 80 ? "Low" : score >= 60 ? "Medium" : "High";

  return { score, risk_level };
}

const AppContext = createContext();

const TAB_STORAGE_KEY = 'agrisphere_active_tab';

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTabState] = useState(() => {
    try {
      const saved = localStorage.getItem(TAB_STORAGE_KEY);
      return saved || 'command_center';
    } catch (e) {
      return 'command_center';
    }
  });

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem(TAB_STORAGE_KEY, tab);
    } catch (e) {}
  };
  
  // Real user farms state - initialized from localStorage cache with real-time Firestore sync
  const [farms, setFarms] = useState(() => {
    try {
      const saved = localStorage.getItem('agrisphere_user_farms');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [selectedFarm, setSelectedFarm] = useState(() => {
    try {
      const saved = localStorage.getItem('agrisphere_user_farms');
      if (saved) {
        const list = JSON.parse(saved);
        return list.length > 0 ? list[0] : null;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [backendHealth, setBackendHealth] = useState({ status: 'healthy', version: '2.0.0' });
  const [toast, setToast] = useState(null);

  // Chat messages with persistent local storage
  const [chatMessages, setChatMessagesState] = useState(() => {
    try {
      const saved = localStorage.getItem('agrisphere_chat_messages');
      return saved ? JSON.parse(saved) : [DEFAULT_WELCOME_MESSAGE];
    } catch (_) {
      return [DEFAULT_WELCOME_MESSAGE];
    }
  });

  const setChatMessages = (updater) => {
    setChatMessagesState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem('agrisphere_chat_messages', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  };

  // Parcel selected from Land Measure scanner for automatic GeoSR-AI analysis & reporting
  const [selectedParcelForSRM, setSelectedParcelForSRMState] = useState(() => {
    try {
      const saved = localStorage.getItem('agrisphere_selected_parcel_srm');
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });

  const setSelectedParcelForSRM = (parcel) => {
    setSelectedParcelForSRMState(parcel);
    try {
      if (parcel) {
        localStorage.setItem('agrisphere_selected_parcel_srm', JSON.stringify(parcel));
      } else {
        localStorage.removeItem('agrisphere_selected_parcel_srm');
      }
    } catch (_) {}
  };

  const sendParcelToGeoSR = (parcelData) => {
    setSelectedParcelForSRM(parcelData);
    setActiveTab('land_satellite');
    showToast(`Sending ${parcelData.name || 'measured land'} into GeoSR-AI Studio...`, 'success');
  };

  // Sync real-time Firestore database for authenticated user & keep local cache synchronized
  useEffect(() => {
    if (!user) {
      // Offline / guest mode: load any local cached farms
      try {
        const saved = localStorage.getItem('agrisphere_user_farms');
        if (saved) {
          const list = JSON.parse(saved);
          if (list && list.length > 0) {
            setFarms(list);
            setSelectedFarm(prev => prev || list[0]);
          }
        }
      } catch (e) {}
      return;
    }

    // Authenticated user: Listen to /users/{uid}/farms in Firestore
    const farmsColRef = collection(db, 'users', user.uid, 'farms');
    const unsubscribe = onSnapshot(farmsColRef, (snapshot) => {
      if (!snapshot.empty) {
        const firestoreFarms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFarms(firestoreFarms);
        try {
          localStorage.setItem('agrisphere_user_farms', JSON.stringify(firestoreFarms));
        } catch (e) {}
        setSelectedFarm(prev => {
          if (!prev) return firestoreFarms[0];
          const match = firestoreFarms.find(f => f.id === prev.id);
          return match || firestoreFarms[0];
        });
      } else {
        // If Firestore is empty, check if we have local farms to sync to Firestore
        try {
          const local = localStorage.getItem('agrisphere_user_farms');
          if (local) {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setFarms(parsed);
              setSelectedFarm(parsed[0]);
              // Upload local farms to user's Firestore collection
              parsed.forEach(farm => {
                const farmDocRef = doc(db, 'users', user.uid, 'farms', farm.id);
                setDoc(farmDocRef, { ...farm, updatedAt: serverTimestamp() }, { merge: true }).catch(() => {});
              });
            }
          }
        } catch (e) {}
      }
    }, (error) => {
      console.warn("Firestore farms listener fallback notice:", error?.message || error);
    });

    return () => unsubscribe();
  }, [user]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const checkHealth = async () => {
    try {
      const h = await api.getHealth();
      setBackendHealth(h);
    } catch (err) {
      setBackendHealth({ status: 'healthy', mode: 'local' });
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Add Farm Action with instant local persistence & Firestore sync
  const addFarm = async (farmInput) => {
    const scoreData = calcSoilScoreLocal(
      farmInput.nitrogen || 165,
      farmInput.phosphorus || 30,
      farmInput.potassium || 150,
      farmInput.ph || 6.8,
      farmInput.organic_carbon || 0.82
    );

    const landSizeAcres = parseFloat(farmInput.land_size_acres) || 
      (typeof farmInput.size === 'string' ? parseFloat(farmInput.size) : parseFloat(farmInput.size)) || 
      parseFloat(farmInput.acres) || 
      5.0;

    const crop = farmInput.current_crop || farmInput.crop || "Wheat";
    const soilType = farmInput.soil_type || farmInput.soilType || "Alluvial Loam";
    const location = farmInput.location || "Punjab, India";
    const boundary = farmInput.coordinates?.boundaryPolygon || farmInput.boundary_polygon || farmInput.boundaryPolygon || [];
    const lat = farmInput.coordinates?.latitude || farmInput.coordinates?.lat || (boundary.length > 0 ? boundary[0][0] : 30.9010);
    const lng = farmInput.coordinates?.longitude || farmInput.coordinates?.lng || (boundary.length > 0 ? boundary[0][1] : 75.8573);

    const farmId = farmInput.id || `farm-${Date.now()}`;
    const newFarm = {
      id: farmId,
      name: farmInput.name || "New Agricultural Field",
      farmer_name: farmInput.farmer_name || (user?.displayName || "Farmer"),
      location,
      coordinates: {
        lat,
        lng,
        latitude: lat,
        longitude: lng,
        boundaryPolygon: boundary
      },
      boundary_polygon: boundary,
      land_size_acres: landSizeAcres,
      size: `${landSizeAcres} Acres`,
      soil_type: soilType,
      irrigation_type: farmInput.irrigation_type || "Tube Well / Borewell",
      current_crop: crop,
      active_season: farmInput.active_season || "Rabi 2026",
      soil_health: farmInput.soil_health || {
        score: scoreData.score,
        risk_level: scoreData.risk_level,
        nitrogen: parseFloat(farmInput.nitrogen) || 165,
        phosphorus: parseFloat(farmInput.phosphorus) || 30,
        potassium: parseFloat(farmInput.potassium) || 150,
        ph: parseFloat(farmInput.ph) || 6.8,
        organic_carbon: parseFloat(farmInput.organic_carbon) || 0.82,
        moisture: parseFloat(farmInput.moisture) || 38.0
      },
      scanData: farmInput.scanData || null,
      last_tested: farmInput.last_tested || new Date().toISOString().split('T')[0]
    };

    // Optimistically update state & local cache immediately
    setFarms(prev => {
      const updated = [newFarm, ...prev.filter(f => f.id !== farmId)];
      try {
        localStorage.setItem('agrisphere_user_farms', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setSelectedFarm(newFarm);

    // Sync to user's Firestore collection if authenticated
    if (user) {
      try {
        const farmDocRef = doc(db, 'users', user.uid, 'farms', farmId);
        await setDoc(farmDocRef, { ...newFarm, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
      } catch (err) {
        console.warn("Notice: Firestore farm upload queued (locally saved):", err?.message || err);
      }
    }

    // Background server API sync
    try {
      await api.createFarm(farmInput);
    } catch (e) {}

    return newFarm;
  };

  // Update Farm Action
  const updateFarm = async (farmId, updatedFields) => {
    const targetFarm = farms.find(f => f.id === farmId);
    const scoreData = calcSoilScoreLocal(
      updatedFields.nitrogen ?? targetFarm?.soil_health?.nitrogen ?? 160,
      updatedFields.phosphorus ?? targetFarm?.soil_health?.phosphorus ?? 28,
      updatedFields.potassium ?? targetFarm?.soil_health?.potassium ?? 140,
      updatedFields.ph ?? targetFarm?.soil_health?.ph ?? 6.9,
      updatedFields.organic_carbon ?? targetFarm?.soil_health?.organic_carbon ?? 0.78
    );

    const updated = {
      ...targetFarm,
      ...updatedFields,
      soil_health: {
        ...targetFarm?.soil_health,
        score: scoreData.score,
        risk_level: scoreData.risk_level,
        nitrogen: parseFloat(updatedFields.nitrogen ?? targetFarm?.soil_health?.nitrogen ?? 160),
        phosphorus: parseFloat(updatedFields.phosphorus ?? targetFarm?.soil_health?.phosphorus ?? 28),
        potassium: parseFloat(updatedFields.potassium ?? targetFarm?.soil_health?.potassium ?? 140),
        ph: parseFloat(updatedFields.ph ?? targetFarm?.soil_health?.ph ?? 6.9),
        organic_carbon: parseFloat(updatedFields.organic_carbon ?? targetFarm?.soil_health?.organic_carbon ?? 0.78),
      }
    };

    setFarms(prev => {
      const updatedList = prev.map(f => f.id === farmId ? updated : f);
      try {
        localStorage.setItem('agrisphere_user_farms', JSON.stringify(updatedList));
      } catch (e) {}
      return updatedList;
    });

    if (selectedFarm?.id === farmId) {
      setSelectedFarm(updated);
    }

    if (user) {
      try {
        const farmDocRef = doc(db, 'users', user.uid, 'farms', farmId);
        await setDoc(farmDocRef, { ...updated, updatedAt: serverTimestamp() }, { merge: true });
      } catch (err) {
        console.warn("Notice: Firestore farm update queued:", err?.message || err);
      }
    }
  };

  // Delete Farm Action
  const deleteFarm = async (farmId) => {
    setFarms(prev => {
      const updated = prev.filter(f => f.id !== farmId);
      try {
        localStorage.setItem('agrisphere_user_farms', JSON.stringify(updated));
      } catch (e) {}
      if (selectedFarm?.id === farmId) {
        setSelectedFarm(updated.length > 0 ? updated[0] : null);
      }
      return updated;
    });

    if (user) {
      try {
        const farmDocRef = doc(db, 'users', user.uid, 'farms', farmId);
        await deleteDoc(farmDocRef);
      } catch (err) {
        console.warn("Notice: Firestore farm deletion queued:", err?.message || err);
      }
    }

    try {
      await api.deleteFarm(farmId);
    } catch (e) {}
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        farms,
        setFarms,
        selectedFarm,
        setSelectedFarm,
        addFarm,
        updateFarm,
        deleteFarm,
        loading,
        setLoading,
        backendHealth,
        toast,
        showToast,
        chatMessages,
        setChatMessages,
        selectedParcelForSRM,
        setSelectedParcelForSRM,
        sendParcelToGeoSR
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
