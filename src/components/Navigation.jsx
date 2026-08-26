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
  ShieldCheck
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
    { id: 'satellite_srm', label: t('nav_satellite_srm'), icon: Satellite, badge: 'GeoSR' },
    { id: 'soil_precision', label: t('nav_soil_precision'), icon: Sprout },
    { id: 'national_analytics', label: t('nav_national_analytics'), icon: BarChart3, badge: 'Power BI' },
    { id: 'ai_agronomist', label: t('nav_ai_agronomist'), icon: Bot },
    { id: 'farms', label: t('nav_farms'), icon: MapPin },
    { id: 'weather', label: t('nav_weather'), icon: CloudSun },
    { id: 'login', label: isAuthenticated ? 'Farmer Account' : 'Login Dashboard', icon: User, badge: isAuthenticated ? 'Cloud' : undefined }
  ];

  return (
    <header className="sticky top-3 z-50 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div className="bg-[#FEFEFA]/90 backdrop-blur-md border border-[#DED8CF]/80 shadow-soft rounded-[2.25rem] p-2.5 sm:p-3 transition-all duration-300">
        {/* Top Tier: Logo + Platform Identity + Global Switches */}
        <div className="flex items-center justify-between gap-3 px-2 sm:px-3 pb-2.5 border-b border-[#DED8CF]/40">
          
          {/* Logo & Platform Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setActiveTab('command_center')}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#5D7052] text-[#F3F4F1] shadow-soft group-hover:scale-105 group-hover:bg-[#4D5E44] transition-all">
              <Sprout className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[#2C2C24] font-serif">
                  AgriSphere <span className="text-[#5D7052] italic font-normal">AI</span>
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20">
                  Organic v2.0
                </span>
              </div>
              <p className="text-[11px] text-[#78786C] hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Right Controls: Farm Selector, Language, Account Pill, Notification Bell */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live GPS Tracker Pill */}
            <button
              onClick={() => setIsTrackerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FEFEFA] border border-[#DED8CF] text-xs font-bold text-[#2C2C24] hover:border-[#5D7052] shadow-sm transition hover:scale-102"
              title="Open Live Field GPS Tracker"
            >
              <NavigationIcon className={`w-3.5 h-3.5 ${isTracking ? 'text-[#5D7052] animate-spin-slow' : 'text-[#C18C5D]'}`} />
              <span className="truncate max-w-[120px] hidden sm:inline">
                {locationState?.geoInfo?.town || 'GPS Location'}
              </span>
              <span className={`w-2 h-2 rounded-full ${isTracking ? 'bg-[#5D7052] animate-ping' : 'bg-[#C18C5D]'}`} />
            </button>

            {/* Active Field Dropdown */}
            {farms.length > 0 && (
              <div className="relative hidden md:block">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs text-[#2C2C24] hover:bg-[#F0EBE5] transition">
                  <MapPin className="w-3.5 h-3.5 text-[#C18C5D]" />
                  <span className="font-semibold truncate max-w-[130px]">
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
            <div className="flex items-center rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] px-2 py-0.5 hover:bg-[#F0EBE5] transition">
              <Globe className="w-3.5 h-3.5 text-[#5D7052] mr-1.5" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label="Select Language"
                className="bg-transparent text-xs text-[#2C2C24] font-semibold py-1 pr-1 outline-none cursor-pointer"
              >
                {supportedLanguages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#FEFEFA] text-[#2C2C24]">
                    {l.native} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Auth / Account Profile Button */}
            {isAuthenticated ? (
              <button
                onClick={() => setActiveTab('login')}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#5D7052]/10 border border-[#5D7052]/30 text-xs font-bold text-[#2C2C24] hover:bg-[#5D7052]/20 transition cursor-pointer"
                title="View & Edit Cloud Database Profile"
              >
                <div className="w-5 h-5 rounded-full bg-[#5D7052] text-[#FEFEFA] flex items-center justify-center text-[10px] overflow-hidden">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    (userProfile?.displayName || user.displayName || user.email || 'F').charAt(0).toUpperCase()
                  )}
                </div>
                <span className="truncate max-w-[90px] hidden sm:inline">
                  {userProfile?.displayName || user.displayName || 'Farmer'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#FEFEFA] text-xs font-bold shadow-soft transition cursor-pointer"
                title="Open Login & Account Page"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* FCM HTTP v1 Notification Bell Trigger */}
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#FEFEFA] border border-[#DED8CF] text-[#2C2C24] hover:border-[#5D7052] hover:bg-[#F0EBE5]/60 shadow-sm transition hover:scale-105"
              title="FCM HTTP v1 Field Alerts & Push Testing"
              aria-label="Open Field Notifications"
            >
              <Bell className="w-4 h-4 text-[#5D7052]" />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#C18C5D] text-[#FEFEFA] text-[9px] font-bold shadow-sm animate-pulse">
                  {unreadAlerts}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Tier: Navigation Tabs as Soft Tactile Pills */}
        <nav className="flex space-x-1.5 overflow-x-auto pt-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'bg-[#5D7052] text-[#F3F4F1] shadow-soft scale-100'
                    : 'text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5]/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#F3F4F1]' : 'text-[#5D7052]'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-2 py-0.2 text-[9px] font-extrabold rounded-full ${
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

      </div>

      {/* Slide-over / Modal FCM Notification Center */}
      <NotificationCenter 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
      />

      {/* Auth Modal (Email/Password + Google Login) */}
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
  );
};
