import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { LocationProvider, useLocation } from './context/LocationContext';
import { Navigation } from './components/Navigation';
import { VisitorHeader } from './components/VisitorHeader';
import { PublicHome } from './pages/PublicHome';
import { CommandCenter } from './pages/CommandCenter';
import { LandAndSatellite } from './pages/LandAndSatellite';
import { SoilAndWeather } from './pages/SoilAndWeather';
import { FarmHubAndAI } from './pages/FarmHubAndAI';
import { AuthPage } from './pages/AuthPage';
import { LiveTranslationHUD } from './components/LiveTranslationHUD';
import { LiveLocationTracker } from './components/LiveLocationTracker';
import { CookieConsent } from './components/CookieConsent';
import { CheckCircle, Cookie, Compass, Sprout, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("AgriSphere UI Caught Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 my-6 max-w-2xl mx-auto rounded-3xl bg-[#FEFEFA] border border-[#A85448]/30 shadow-soft text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#A85448]/10 text-[#A85448] flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#2C2C24] font-serif">
            Something went wrong while rendering this section
          </h3>
          <p className="text-xs text-[#78786C] max-w-md mx-auto">
            {this.state.error?.message || "An unexpected rendering error occurred."}
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5D7052] text-[#FEFEFA] text-xs font-bold shadow-soft hover:bg-[#4D5E44] transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Application</span>
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const MainContent = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { activeTab, setActiveTab, toast } = useApp();
  const { setIsTrackerOpen, isTracking } = useLocation();

  // 1. App Authentication Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCF8] text-[#2C2C24]">
        <div className="flex flex-col items-center gap-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-[#5D7052] text-[#FEFEFA] flex items-center justify-center shadow-soft animate-bounce">
            <Sprout className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-2 text-sm font-bold font-serif text-[#2C2C24]">
            <Loader2 className="w-4 h-4 text-[#5D7052] animate-spin" />
            <span>Connecting to AgriSphere Secure Cloud...</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Experience: Public Home Screen and Dedicated Login Dashboard
  if (!isAuthenticated || !user) {
    const isLoginDashboard = activeTab === 'login' || activeTab === 'auth' || activeTab === 'account_auth';

    return (
      <div className="min-h-screen flex flex-col bg-[#FDFCF8] text-[#2C2C24] font-sans relative overflow-x-hidden">
        {/* Ambient Organic Blurred Blobs */}
        <div className="fixed top-12 left-10 w-96 h-96 bg-[#5D7052]/10 rounded-full blur-3xl pointer-events-none blob-shape-1 -z-10 animate-pulse duration-1000" />
        <div className="fixed top-1/3 right-12 w-[32rem] h-[32rem] bg-[#C18C5D]/10 rounded-full blur-3xl pointer-events-none blob-shape-2 -z-10" />
        <div className="fixed bottom-10 left-1/4 w-80 h-80 bg-[#E6DCCD]/30 rounded-full blur-3xl pointer-events-none blob-shape-3 -z-10" />

        {/* Visitor Navigation Header */}
        <VisitorHeader 
          activeTab={isLoginDashboard ? 'login' : 'home'} 
          onSelectTab={(tab) => setActiveTab(tab)}
          onQuickDemo={() => setActiveTab('login')}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 sm:pb-8">
          {isLoginDashboard ? (
            <AuthPage onSuccess={() => setActiveTab('command_center')} />
          ) : (
            <PublicHome 
              onNavigateToAuth={() => setActiveTab('login')}
              onQuickDemoLogin={() => setActiveTab('login')}
            />
          )}
        </main>

        {/* Krishi Cookie & Storage Consent Banner */}
        <CookieConsent />

        {/* Toast Notification Banner if any */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#FEFEFA] border border-[#5D7052]/40 shadow-soft text-xs text-[#2C2C24]">
              <CheckCircle className="w-4 h-4 text-[#5D7052]" />
              <span className="font-semibold">{toast.message}</span>
            </div>
          </div>
        )}

        {/* Clean Landing Page Footer */}
        <footer className="border-t border-[#DED8CF]/60 bg-[#F0EBE5]/40 backdrop-blur-md py-8 text-xs text-[#78786C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2 font-serif text-sm justify-center sm:justify-start">
              <span className="font-bold text-[#2C2C24]">AgriSphere AI</span>
              <span>•</span>
              <span className="font-sans text-xs text-[#78786C]">Natural Agronomic Intelligence &amp; Cloud Database • SIH 2026</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold justify-center">
              <button 
                type="button"
                onClick={() => setActiveTab('home')} 
                className="text-[#5D7052] hover:underline cursor-pointer"
              >
                Home
              </button>
              <span>•</span>
              <button 
                type="button"
                onClick={() => setActiveTab('login')} 
                className="text-[#5D7052] hover:underline cursor-pointer"
              >
                Login Dashboard
              </button>
              <span>•</span>
              <span className="text-[#78786C]">🔒 Encrypted Firebase Auth</span>
              <span>•</span>
              <span className="text-[#78786C]">🛰️ GeoSR-AI 2.5m</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // 3. Authenticated User Workspace with 4 Core Consolidated Modules
  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <PublicHome onNavigateToAuth={() => setActiveTab('login')} />;
      case 'command_center':
      case 'dashboard':
        return <CommandCenter />;
      case 'land_satellite':
      case 'land_scanner':
      case 'satellite_srm':
        return <LandAndSatellite />;
      case 'soil_weather':
      case 'weather':
      case 'soil_precision':
        return <SoilAndWeather />;
      case 'farm_hub':
      case 'ai_agronomist':
      case 'farms':
      case 'national_analytics':
        return <FarmHubAndAI />;
      case 'login':
      case 'auth':
      case 'account_auth':
        return <AuthPage onSuccess={() => setActiveTab('command_center')} />;
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 sm:pb-8">
        <ErrorBoundary>
          {renderPage()}
        </ErrorBoundary>
      </main>

      {/* Organic Wabi-Sabi Footer */}
      <footer className="border-t border-[#DED8CF]/60 bg-[#F0EBE5]/40 backdrop-blur-md py-8 text-xs text-[#78786C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-serif text-sm">
            <span className="font-bold text-[#2C2C24]">AgriSphere AI</span>
            <span>•</span>
            <span className="font-sans text-xs text-[#78786C]">Natural Agronomic Intelligence &amp; Cloud Database • SIH 2026</span>
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
                const event = new CustomEvent('openCookieModal');
                window.dispatchEvent(event);
              }}
              className="flex items-center gap-1.5 text-[#78786C] hover:text-[#2C2C24] hover:underline"
            >
              <Cookie className="w-3.5 h-3.5" />
              <span>Krishi Cookies &amp; Privacy</span>
            </button>

            <span className="text-[#DED8CF]">|</span>
            <span className="text-[#5D7052]">🛰️ GeoSR-AI 2.5m</span>
            <span className="text-[#5D7052]">🌱 Cloud Firestore</span>
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
      <AuthProvider>
        <AppProvider>
          <LocationProvider>
            <MainContent />
          </LocationProvider>
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
