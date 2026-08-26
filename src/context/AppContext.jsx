import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('command_center');
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendHealth, setBackendHealth] = useState({ status: 'checking' });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const loadFarms = async () => {
    try {
      const data = await api.getFarms();
      if (data && data.farms) {
        setFarms(data.farms);
        if (!selectedFarm && data.farms.length > 0) {
          setSelectedFarm(data.farms[0]);
        }
      }
    } catch (err) {
      console.warn("Using offline demo farms", err);
    }
  };

  const checkHealth = async () => {
    try {
      const h = await api.getHealth();
      setBackendHealth(h);
    } catch (err) {
      setBackendHealth({ status: 'offline', error: true });
    }
  };

  useEffect(() => {
    checkHealth();
    loadFarms();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        farms,
        setFarms,
        selectedFarm,
        setSelectedFarm,
        loading,
        setLoading,
        backendHealth,
        toast,
        showToast,
        refreshFarms: loadFarms
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
