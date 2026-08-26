import React, { createContext, useContext, useState, useEffect } from 'react';
import { startLiveLocationWatch, stopLiveLocationWatch, getCurrentPositionPromise, getAgroClimaticZone } from '../services/geoService';
import { getCookie, COOKIE_KEYS } from '../utils/cookies';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [locationState, setLocationState] = useState({
    coords: {
      latitude: 30.9010,
      longitude: 75.8573,
      accuracy: 4.5,
      altitude: 247,
      speed: 0,
      heading: 0,
      timestamp: Date.now()
    },
    zone: getAgroClimaticZone(30.9010, 75.8573),
    geoInfo: {
      displayName: 'Ludhiana, Punjab, India',
      town: 'Ludhiana Ag Field',
      district: 'Ludhiana',
      state: 'Punjab',
      country: 'India'
    },
    status: 'standby', // 'standby' | 'active' | 'error' | 'locked'
    isLive: false,
    errorMessage: null
  });

  // Start watch on mount if cookie consent exists or user requested
  useEffect(() => {
    const geoPref = getCookie(COOKIE_KEYS.GEO_TRACKING);
    if (geoPref === 'enabled') {
      startTracking();
    }
  }, []);

  const startTracking = () => {
    setIsTracking(true);
    setLocationState(prev => ({ ...prev, status: 'searching', errorMessage: null }));

    startLiveLocationWatch(
      (data) => {
        setLocationState({
          ...data,
          status: 'active',
          errorMessage: null
        });
      },
      (err) => {
        console.warn("Location error:", err);
        setLocationState(prev => ({
          ...prev,
          status: 'error',
          errorMessage: err.message || "GPS signal unavailable"
        }));
      }
    );
  };

  const stopTracking = () => {
    stopLiveLocationWatch();
    setIsTracking(false);
    setLocationState(prev => ({ ...prev, isLive: false, status: 'standby' }));
  };

  const toggleTracking = () => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  const refreshOnce = async () => {
    try {
      setLocationState(prev => ({ ...prev, status: 'searching' }));
      const fix = await getCurrentPositionPromise();
      setLocationState({
        ...fix,
        isLive: true,
        errorMessage: null
      });
      return fix;
    } catch (err) {
      setLocationState(prev => ({ ...prev, status: 'error', errorMessage: err.message }));
      throw err;
    }
  };

  return (
    <LocationContext.Provider value={{
      locationState,
      isTracking,
      startTracking,
      stopTracking,
      toggleTracking,
      refreshOnce,
      isTrackerOpen,
      setIsTrackerOpen
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
