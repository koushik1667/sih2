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
  X
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
    { id: 'home', label: 'Home', icon: Globe },
    { id: 'command_center', label: t('nav_command_center'), icon: LayoutDashboard },
    { id: 'land_scanner', label: 'Land Measure & Scan', icon: Compass, badge: 'Live GIS' },
    { id: 'satellite_srm', label: t('nav_satellite_srm'), icon: Satellite, badge: 'GeoSR' },
    { id: 'soil_precision', label: t('nav_soil_precision'), icon: Sprout },
    { id: 'national_analytics', label: t('nav_national_analytics'), icon: BarChart3, badge: 'Power BI' },
    { id: 'ai_agronomist', label: t('nav_ai_agronomist'), icon: Bot },
    { id: 'farms', label: t('nav_farms'), icon: MapPin },
    { id: 'weather', label: t('nav_weather'), icon: CloudSun },
    { id: 'login', label: isAuthenticated ? 'Farmer Account' : 'Login Dashboard', icon: User, badge: isAuthenticated ? 'Cloud' : undefined }
  ];

  return (
    <>
      <header className="sticky top-2 sm:top-3 z-40 max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8">
        <div className="bg-[#FEFEFA]/95 backdrop-blur-md border border-[#DED8CF]/80 shadow-soft rounded-[1.75rem] sm:rounded-[2.25rem] p-2 sm:p-3 transition-all duration-300">
          
          {/* Top Tier: Logo + Platform Identity + Global Switches */}
          <div className="flex items-center justify-between gap-2 px-1 sm:px-3 pb-2 sm:pb-2.5 border-b border-[#DED8CF]/40">
            
            {/* Logo & Platform Name */}
            <div 
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group" 
              onClick={() => setActiveTab('command_center')}
            >
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#5D7052] text-[#F3F4F1] shadow-soft group-hover:scale-105 group-hover:bg-[#4D5E44] transition-all shrink-0">
                <Sprout className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-xl font-bold tracking-tight text-[#2C2C24] font-serif leading-none">
                    AgriSphere <span className="text-[#5D7052] italic font-normal">AI</span>
                  </span>
                  <span className="px-1.5 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase rounded-full bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20">
                    v2.0
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#78786C] hidden sm:block">
                  {t('tagline')}
                </p>
              </div>
            </div>

            {/* Right Controls: Farm Selector, Language, Account Pill, Notification Bell, Mobile Menu */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              
              {/* Live GPS Tracker Pill */}
              <button
                type="button"
                onClick={() => setIsTrackerOpen(true)}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full bg-[#FEFEFA] border border-[#DED8CF] text-[11px] sm:text-xs font-bold text-[#2C2C24] hover:border-[#5D7052] shadow-sm transition hover:scale-102 cursor-pointer"
                title="Open Live Field GPS Tracker"
              >
                <NavigationIcon className={`w-3.5 h-3.5 ${isTracking ? 'text-[#5D7052] animate-spin-slow' : 'text-[#C18C5D]'}`} />
                <span className="truncate max-w-[90px] sm:max-w-[120px] hidden md:inline">
                  {locationState?.geoInfo?.town || 'GPS Location'}
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

              {/* Language Switcher */}
              <div className="flex items-center rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] px-1.5 sm:px-2 py-0.5 hover:bg-[#F0EBE5] transition">
                <Globe className="w-3.5 h-3.5 text-[#5D7052] mr-1" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  aria-label="Select Language"
                  className="bg-transparent text-[11px] sm:text-xs text-[#2C2C24] font-semibold py-1 outline-none cursor-pointer"
                >
                  {supportedLanguages.map((l) => (
                    <option key={l.code} value={l.code} className="bg-[#FEFEFA] text-[#2C2C24]">
                      {l.code.toUpperCase()} ({l.native})
                    </option>
                  ))}
                </select>
              </div>

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

              {/* Mobile Drawer Button (< md) */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-7 h-7 rounded-full bg-[#F0EBE5]/80 text-[#2C2C24] border border-[#DED8CF] hover:bg-[#E6DCCD]"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Bottom Tier: Touch-Scrollable Navigation Tabs (Desktop & Tablet) */}
          <nav className="flex space-x-1.5 overflow-x-auto pt-2 pb-0.5 scrollbar-none touch-pan-x">
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

          {/* Mobile Collapsible Full Menu Drawer */}
          {isMobileMenuOpen && (
            <div className="md:hidden pt-3 border-t border-[#DED8CF]/60 grid grid-cols-2 gap-2 animate-fadeIn">
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
                    className={`flex items-center gap-2 p-2.5 rounded-2xl text-xs font-bold transition text-left ${
                      isActive
                        ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft'
                        : 'bg-[#F0EBE5]/50 text-[#2C2C24] hover:bg-[#E6DCCD]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
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

      {/* Floating Bottom Navigation Bar for Mobile (< sm screens) */}
      <div className="sm:hidden fixed bottom-3 inset-x-3 z-40 bg-[#FEFEFA]/95 backdrop-blur-md border border-[#DED8CF] shadow-lg rounded-full px-3 py-2 flex items-center justify-between">
        {[
          { id: 'command_center', label: 'Command', icon: LayoutDashboard },
          { id: 'land_scanner', label: 'Measure', icon: Compass },
          { id: 'satellite_srm', label: 'GeoSR', icon: Satellite },
          { id: 'soil_precision', label: 'Soil', icon: Sprout },
          { id: 'ai_agronomist', label: 'Krishi AI', icon: Bot },
          { id: 'weather', label: 'Radar', icon: CloudSun }
        ].map((btn) => {
          const Icon = btn.icon;
          const isActive = activeTab === btn.id;
          return (
            <button
              key={btn.id}
              type="button"
              onClick={() => setActiveTab(btn.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition ${
                isActive ? 'text-[#5D7052] font-bold scale-105' : 'text-[#78786C]'
              }`}
            >
              <div className={`p-1 rounded-full ${isActive ? 'bg-[#5D7052]/15 text-[#5D7052]' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[9px] mt-0.5">{btn.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

