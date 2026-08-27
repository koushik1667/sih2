import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Satellite, 
  Sprout, 
  BarChart3, 
  Bot, 
  MapPin, 
  CloudSun, 
  Globe, 
  ChevronDown,
  Navigation as NavigationIcon,
  Bell,
  User,
  LogIn,
  ShieldCheck,
  Compass,
  Menu,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { NotificationCenter } from './NotificationCenter';
import { AuthModal } from './AuthModal';
import { UserProfileModal } from './UserProfileModal';
import { api } from '../services/api';

export const Navigation = () => {
  const { activeTab, setActiveTab, farms, selectedFarm, setSelectedFarm, backendHealth } = useApp();
  const { lang, setLang, t, supportedLanguages } = useLanguage();
  const { locationState, isTracking, setIsTrackerOpen } = useLocation();
  const { user, userProfile, isAuthenticated } = useAuth();
  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(2);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.getNotificationHistory();
        if (res && typeof res.unread_count === 'number') {
          setUnreadAlerts(res.unread_count);
        }
      } catch (e) {
        // silent fallback
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [isNotifOpen]);

  const navItems = [
    { id: 'home', label: 'Home', icon: Globe, desc: 'Overview & Global Portal' },
    { id: 'command_center', label: t('nav_command_center') || 'Command Center', icon: LayoutDashboard, desc: 'Agri Command & Macro Analytics' },
    { id: 'land_scanner', label: 'Land Measure & Scan', icon: Compass, badge: 'Live GIS', desc: 'Geodesic Acreage & Spectral Scanner' },
    { id: 'satellite_srm', label: t('nav_satellite_srm') || 'GeoSR-AI Studio', icon: Satellite, badge: 'GeoSR', desc: 'Sentinel & Landsat Super-Resolution' },
    { id: 'soil_precision', label: t('nav_soil_precision') || 'Soil & Depletion', icon: Sprout, desc: 'NPK Drawdown & Crop Rotation' },
    { id: 'national_analytics', label: t('nav_national_analytics') || 'National Analytics', icon: BarChart3, badge: 'Power BI', desc: 'National Crop Matrix & Economics' },
    { id: 'ai_agronomist', label: t('nav_ai_agronomist') || 'AI Agronomist', icon: Bot, desc: 'Krishi Mitra Multilingual Advisory' },
    { id: 'farms', label: t('nav_farms') || 'My Farms', icon: MapPin, desc: 'Cloud Farm Parcels & Registry' },
    { id: 'weather', label: t('nav_weather') || 'Weather Radar', icon: CloudSun, badge: 'Live Doppler', desc: 'Live Radar & Spray Windows' },
    { id: 'login', label: isAuthenticated ? 'Farmer Account' : 'Login Dashboard', icon: User, badge: isAuthenticated ? 'Cloud' : undefined, desc: 'Database Sync & Credentials' }
  ];

  const currentLangObj = supportedLanguages.find(l => l.code === lang) || supportedLanguages[0];

  return (
    <>
      <header className="sticky top-2 sm:top-3 z-40 max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8">
        <div className="bg-[#FEFEFA]/95 backdrop-blur-md border border-[#DED8CF]/80 shadow-soft rounded-[1.75rem] sm:rounded-[2.25rem] p-2 sm:p-3 transition-all duration-300">
          
          {/* Top Tier: Top-Left Hamburger & Language + Logo + Right Controls */}
          <div className="flex items-center justify-between gap-2 px-1 sm:px-3 pb-2 sm:pb-2.5 border-b border-[#DED8CF]/40">
            
            {/* Left Controls on Mobile: Hamburger Button + Top-Left Minimized Language Selector */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Mobile Hamburger Menu Button (Top Left Corner) */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-[#5D7052] text-[#FEFEFA] shadow-soft hover:bg-[#4D5E44] active:scale-95 transition-all shrink-0 cursor-pointer"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Minimized Language Selector (Top Left) */}
              <div className="relative flex items-center rounded-full bg-[#F0EBE5]/90 border border-[#DED8CF] px-2 py-1 hover:bg-[#F0EBE5] transition shadow-xs">
                <Globe className="w-3.5 h-3.5 text-[#5D7052] mr-1 shrink-0" />
                <span className="text-[11px] sm:text-xs text-[#2C2C24] font-bold">
                  {currentLangObj.native}
                </span>
                <ChevronDown className="w-3 h-3 text-[#78786C] ml-1" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  aria-label="Select Language"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                >
                  {supportedLanguages.map((l) => (
                    <option key={l.code} value={l.code} className="bg-[#FEFEFA] text-[#2C2C24]">
                      {l.code.toUpperCase()} — {l.native} ({l.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Logo & Platform Name */}
              <div 
                className="flex items-center gap-2 sm:gap-3 cursor-pointer group" 
                onClick={() => setActiveTab('command_center')}
              >
                <div className="hidden sm:flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#5D7052] text-[#F3F4F1] shadow-soft group-hover:scale-105 group-hover:bg-[#4D5E44] transition-all shrink-0">
                  <Sprout className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-sm sm:text-xl font-bold tracking-tight text-[#2C2C24] font-serif leading-none">
                      AgriSphere <span className="text-[#5D7052] italic font-normal">AI</span>
                    </span>
                    <span className="px-1.5 py-0.2 text-[8px] sm:text-[10px] font-bold uppercase rounded-full bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20">
                      v2.0
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#78786C] hidden lg:block">
                    {t('tagline')}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Controls: Farm Selector, GPS, Notification Bell, Account */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              
              {/* Live GPS Tracker Pill */}
              <button
                type="button"
                onClick={() => setIsTrackerOpen(true)}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-[#FEFEFA] border border-[#DED8CF] text-[11px] sm:text-xs font-bold text-[#2C2C24] hover:border-[#5D7052] shadow-sm transition hover:scale-102 cursor-pointer"
                title="Open Live Field GPS Tracker"
              >
                <NavigationIcon className={`w-3.5 h-3.5 ${isTracking ? 'text-[#5D7052] animate-spin-slow' : 'text-[#C18C5D]'}`} />
                <span className="truncate max-w-[85px] sm:max-w-[120px] hidden sm:inline">
                  {locationState?.geoInfo?.town || 'Live GPS'}
                </span>
                <span className={`w-2 h-2 rounded-full ${isTracking ? 'bg-[#5D7052] animate-ping' : 'bg-[#C18C5D]'}`} />
              </button>

              {/* Active Field Dropdown (Desktop / Tablet) */}
              {farms.length > 0 && (
                <div className="relative hidden lg:block">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs text-[#2C2C24] hover:bg-[#F0EBE5] transition">
                    <MapPin className="w-3.5 h-3.5 text-[#C18C5D]" />
                    <span className="font-semibold truncate max-w-[120px]">
                      {selectedFarm ? selectedFarm.name : 'Select Field'}
                    </span>
                    <select 
                      value={selectedFarm?.id || ''} 
                      onChange={(e) => {
                        const f = farms.find(farm => farm.id === e.target.value);
                        if (f) setSelectedFarm(f);
                      }}
                      aria-label="Select Farm"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    >
                      {farms.map(f => (
                        <option key={f.id} value={f.id} className="bg-[#FEFEFA] text-[#2C2C24]">
                          {f.name} ({f.location})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-[#78786C]" />
                  </div>
                </div>
              )}

              {/* Auth / Account Profile Button */}
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-full bg-[#5D7052]/10 border border-[#5D7052]/30 text-xs font-bold text-[#2C2C24] hover:bg-[#5D7052]/20 transition cursor-pointer"
                  title="View & Edit Cloud Database Profile"
                >
                  <div className="w-5 h-5 rounded-full bg-[#5D7052] text-[#FEFEFA] flex items-center justify-center text-[10px] overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      (userProfile?.displayName || user?.displayName || user?.email || 'F').charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="truncate max-w-[70px] sm:max-w-[90px] hidden sm:inline">
                    {userProfile?.displayName || user?.displayName || 'Farmer'}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#FEFEFA] text-[11px] sm:text-xs font-bold shadow-soft transition cursor-pointer"
                  title="Open Login & Account Page"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* FCM Notification Bell */}
              <button
                type="button"
                onClick={() => setIsNotifOpen(true)}
                className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FEFEFA] border border-[#DED8CF] text-[#2C2C24] hover:border-[#5D7052] hover:bg-[#F0EBE5]/60 shadow-sm transition hover:scale-105"
                title="FCM Field Alerts & Push Notifications"
                aria-label="Open Field Notifications"
              >
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5D7052]" />
                {unreadAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#C18C5D] text-[#FEFEFA] text-[9px] font-bold shadow-sm animate-pulse">
                    {unreadAlerts}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Bottom Tier: Desktop & Tablet Horizontal Navigation Tabs (Hidden on Mobile) */}
          <nav className="hidden md:flex space-x-1.5 overflow-x-auto pt-2 pb-0.5 scrollbar-none touch-pan-x">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#5D7052] text-[#F3F4F1] shadow-soft scale-100'
                      : 'text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5]/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-[#F3F4F1]' : 'text-[#5D7052]'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`px-1.5 sm:px-2 py-0.2 text-[8px] sm:text-[9px] font-extrabold rounded-full ${
                      isActive 
                        ? 'bg-[#F3F4F1]/20 text-[#F3F4F1]' 
                        : 'bg-[#C18C5D]/15 text-[#C18C5D]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Off-Canvas Hamburger Menu Drawer (Triggered by Top-Left Menu Button) */}
          {isMobileMenuOpen && (
            <div className="md:hidden pt-3 border-t border-[#DED8CF]/60 animate-in fade-in slide-in-from-top-3 duration-200">
              
              {/* Header inside mobile drawer */}
              <div className="flex items-center justify-between px-1 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#5D7052] animate-ping" />
                  <span className="text-xs font-extrabold text-[#2C2C24] uppercase tracking-wider">
                    All Application Pages & Services
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs font-bold text-[#78786C] hover:text-[#2C2C24] px-2 py-1 rounded-full bg-[#F0EBE5]"
                >
                  Close ✕
                </button>
              </div>

              {/* Language Selector in Drawer */}
              <div className="mb-3 p-2.5 rounded-2xl bg-[#F0EBE5]/70 border border-[#DED8CF]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#78786C] uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#5D7052]" />
                    Select Language ({supportedLanguages.length} Languages)
                  </span>
                  <span className="text-[10px] font-extrabold text-[#5D7052]">
                    Active: {currentLangObj.native}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto pr-1">
                  {supportedLanguages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`px-2 py-1.5 rounded-xl text-[11px] font-bold transition text-center truncate ${
                        lang === l.code
                          ? 'bg-[#5D7052] text-white shadow-xs'
                          : 'bg-[#FEFEFA] text-[#2C2C24] border border-[#DED8CF]/60 hover:bg-[#E6DCCD]'
                      }`}
                    >
                      {l.native}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of All 10 Application Pages */}
              <div className="grid grid-cols-1 gap-1.5 max-h-[60vh] overflow-y-auto pr-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition text-left cursor-pointer ${
                        isActive
                          ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft'
                          : 'bg-[#F0EBE5]/50 text-[#2C2C24] hover:bg-[#E6DCCD] border border-[#DED8CF]/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-[#5D7052]/10 text-[#5D7052]'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold">{item.label}</span>
                            {item.badge && (
                              <span className={`px-1.5 py-0.2 text-[8px] font-extrabold rounded-full ${
                                isActive ? 'bg-white/30 text-white' : 'bg-[#C18C5D]/20 text-[#C18C5D]'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className={`text-[10px] font-normal ${isActive ? 'text-[#FEFEFA]/80' : 'text-[#78786C]'}`}>
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#78786C]'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Farm Selector & Live GPS Quick Action inside mobile menu */}
              {farms.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#DED8CF]/60 flex items-center justify-between text-xs">
                  <span className="text-[#78786C] font-semibold">Active Farm Parcel:</span>
                  <div className="relative">
                    <span className="font-bold text-[#5D7052] underline cursor-pointer">
                      {selectedFarm ? selectedFarm.name : 'Select Farm'} ▾
                    </span>
                    <select
                      value={selectedFarm?.id || ''}
                      onChange={(e) => {
                        const f = farms.find(farm => farm.id === e.target.value);
                        if (f) setSelectedFarm(f);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    >
                      {farms.map(f => (
                        <option key={f.id} value={f.id}>{f.name} ({f.location})</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Slide-over / Modal FCM Notification Center */}
        <NotificationCenter 
          isOpen={isNotifOpen} 
          onClose={() => setIsNotifOpen(false)} 
        />

        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthOpen}
          initialMode={authMode}
          onClose={() => setIsAuthOpen(false)}
        />

        {/* User Cloud Database & Profile Modal */}
        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      </header>
    </>
  );
};
