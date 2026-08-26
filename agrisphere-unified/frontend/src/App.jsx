import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LocationProvider, useLocation } from './context/LocationContext';
import { Navigation } from './components/Navigation';
import { CommandCenter } from './pages/CommandCenter';
import { SatelliteSRM } from './pages/SatelliteSRM';
import { SoilPrecision } from './pages/SoilPrecision';
import { NationalAnalytics } from './pages/NationalAnalytics';
import { AIAgronomist } from './pages/AIAgronomist';
import { FarmManagement } from './pages/FarmManagement';
import { WeatherRadar } from './pages/WeatherRadar';
import { LiveTranslationHUD } from './components/LiveTranslationHUD';
import { LiveLocationTracker } from './components/LiveLocationTracker';
import { CookieConsent } from './components/CookieConsent';
import { CheckCircle, Cookie, Compass } from 'lucide-react';

const MainContent = () => {
  const { activeTab, toast } = useApp();
  const { setIsTrackerOpen, locationState, isTracking } = useLocation();

  const renderPage = () => {
    switch (activeTab) {
      case 'command_center':
        return <CommandCenter />;
      case 'satellite_srm':
        return <SatelliteSRM />;
      case 'soil_precision':
        return <SoilPrecision />;
      case 'national_analytics':
        return <NationalAnalytics />;
      case 'ai_agronomist':
        return <AIAgronomist />;
      case 'farms':
        return <FarmManagement />;
      case 'weather':
        return <WeatherRadar />;
      default:
        return <CommandCenter />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF8] text-[#2C2C24] font-sans relative overflow-x-hidden">
      {/* Ambient Organic Blurred Blobs */}
      <div className="fixed top-12 left-10 w-96 h-96 bg-[#5D7052]/10 rounded-full blur-3xl pointer-events-none blob-shape-1 -z-10 animate-pulse duration-1000" />
      <div className="fixed top-1/3 right-12 w-[32rem] h-[32rem] bg-[#C18C5D]/10 rounded-full blur-3xl pointer-events-none blob-shape-2 -z-10" />
      <div className="fixed bottom-10 left-1/4 w-80 h-80 bg-[#E6DCCD]/30 rounded-full blur-3xl pointer-events-none blob-shape-3 -z-10" />

      {/* Floating Pill Navigation */}
      <Navigation />

      {/* Realtime Live Translation HUD Dock */}
      <LiveTranslationHUD />

      {/* Live Agricultural GPS Tracker Modal */}
      <LiveLocationTracker />

      {/* Krishi Cookie & Storage Consent Banner / Settings */}
      <CookieConsent />

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#FEFEFA] border border-[#5D7052]/40 shadow-soft text-xs text-[#2C2C24]">
            <CheckCircle className="w-4 h-4 text-[#5D7052]" />
            <span className="font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>

      {/* Organic Wabi-Sabi Footer */}
      <footer className="border-t border-[#DED8CF]/60 bg-[#F0EBE5]/40 backdrop-blur-md py-8 text-xs text-[#78786C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-serif text-sm">
            <span className="font-bold text-[#2C2C24]">AgriSphere AI</span>
            <span>•</span>
            <span className="font-sans text-xs text-[#78786C]">Natural Agronomic Intelligence • SIH 2026</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            {/* GPS Tracker Footer Trigger */}
            <button
              onClick={() => setIsTrackerOpen(true)}
              className="flex items-center gap-1.5 text-[#5D7052] hover:underline"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{isTracking ? 'GPS Active' : 'Field GPS Tracker'}</span>
            </button>

            {/* Cookies & Storage Trigger */}
            <button
              onClick={() => {
                // Dispatch event to open cookie modal
                const event = new CustomEvent('openCookieModal');
                window.dispatchEvent(event);
              }}
              className="flex items-center gap-1.5 text-[#78786C] hover:text-[#2C2C24] hover:underline"
            >
              <Cookie className="w-3.5 h-3.5" />
              <span>Krishi Cookies & Privacy</span>
            </button>

            <span className="text-[#DED8CF]">|</span>
            <span className="text-[#5D7052]">🛰️ GeoSR-AI 2.5m</span>
            <span className="text-[#5D7052]">🌱 Soil Precision</span>
            <span className="text-[#5D7052]">📊 Bharat Analytics</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <LocationProvider>
          <MainContent />
        </LocationProvider>
      </AppProvider>
    </LanguageProvider>
  );
}

export default App;

