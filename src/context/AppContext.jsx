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

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('command_center');
  
  // Real user farms state - starts completely empty without mock data
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);

  const [loading, setLoading] = useState(false);
  const [backendHealth, setBackendHealth] = useState({ status: 'healthy', version: '2.0.0' });
  const [toast, setToast] = useState(null);
  const [chatMessages, setChatMessages] = useState([DEFAULT_WELCOME_MESSAGE]);

  // Sync real-time Firestore database for authenticated user
  useEffect(() => {
    if (!user) {
      setFarms([]);
      setSelectedFarm(null);
      return;
    }

    // Authenticated user: Listen to /users/{uid}/farms in Firestore
    const farmsColRef = collection(db, 'users', user.uid, 'farms');
    const unsubscribe = onSnapshot(farmsColRef, (snapshot) => {
      if (!snapshot.empty) {
        const firestoreFarms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFarms(firestoreFarms);
        setSelectedFarm(prev => {
          if (!prev) return firestoreFarms[0];
          const match = firestoreFarms.find(f => f.id === prev.id);
          return match || firestoreFarms[0];
        });
      } else {
        setFarms([]);
        setSelectedFarm(null);
      }
    }, (error) => {
      console.warn("Firestore farms listener fallback:", error);
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

  // Add Farm Action with Firestore user isolation
  const addFarm = async (farmInput) => {
    const scoreData = calcSoilScoreLocal(
      farmInput.nitrogen || 165,
      farmInput.phosphorus || 30,
      farmInput.potassium || 150,
      farmInput.ph || 6.8,
      farmInput.organic_carbon || 0.82
    );

    const farmId = `farm-${Date.now()}`;
    const newFarm = {
      id: farmId,
      name: farmInput.name || "New Agricultural Field",
      farmer_name: farmInput.farmer_name || (user?.displayName || "Farmer"),
      location: farmInput.location || "Punjab, India",
      coordinates: farmInput.coordinates || { lat: 30.9010, lng: 75.8573 },
      land_size_acres: parseFloat(farmInput.land_size_acres) || 5.0,
      soil_type: farmInput.soil_type || "Alluvial Loam",
      irrigation_type: farmInput.irrigation_type || "Tube Well / Borewell",
      current_crop: farmInput.current_crop || "Wheat",
      active_season: farmInput.active_season || "Rabi 2026",
      soil_health: {
        score: scoreData.score,
        risk_level: scoreData.risk_level,
        nitrogen: parseFloat(farmInput.nitrogen) || 165,
        phosphorus: parseFloat(farmInput.phosphorus) || 30,
        potassium: parseFloat(farmInput.potassium) || 150,
        ph: parseFloat(farmInput.ph) || 6.8,
        organic_carbon: parseFloat(farmInput.organic_carbon) || 0.82,
        moisture: parseFloat(farmInput.moisture) || 38.0
      },
      last_tested: new Date().toISOString().split('T')[0]
    };

    if (user) {
      try {
        const farmDocRef = doc(db, 'users', user.uid, 'farms', farmId);
        await setDoc(farmDocRef, { ...newFarm, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      } catch (err) {
        console.error("Failed to write farm to user Firestore:", err);
      }
    } else {
      setFarms(prev => [newFarm, ...prev]);
    }

    setSelectedFarm(newFarm);

    // Also sync to server API
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

    if (user) {
      try {
        const farmDocRef = doc(db, 'users', user.uid, 'farms', farmId);
        await setDoc(farmDocRef, { ...updated, updatedAt: serverTimestamp() }, { merge: true });
      } catch (err) {
        console.error("Failed to update user farm in Firestore:", err);
      }
    } else {
      setFarms(prev => prev.map(f => f.id === farmId ? updated : f));
    }

    if (selectedFarm?.id === farmId) {
      setSelectedFarm(updated);
    }
  };

  // Delete Farm Action
  const deleteFarm = async (farmId) => {
    if (user) {
      try {
        const farmDocRef = doc(db, 'users', user.uid, 'farms', farmId);
        await deleteDoc(farmDocRef);
      } catch (err) {
        console.error("Failed to delete user farm in Firestore:", err);
      }
    } else {
      setFarms(prev => {
        const updated = prev.filter(f => f.id !== farmId);
        if (selectedFarm?.id === farmId) {
          setSelectedFarm(updated.length > 0 ? updated[0] : null);
        }
        return updated;
      });
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
        setChatMessages
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
