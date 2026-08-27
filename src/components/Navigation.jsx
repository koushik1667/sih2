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
  User,
  LogIn,
  ShieldCheck,
  Compass,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Layers,
  Activity,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import { UserProfileModal } from './UserProfileModal';
import { api } from '../services/api';

export const Navigation = () => {
  const { activeTab, setActiveTab, farms, selectedFarm, setSelectedFarm, backendHealth } = useApp();
  const { lang, setLang, t, supportedLanguages } = useLanguage();
  const { locationState, isTracking, setIsTrackerOpen } = useLocation();
  const { user, userProfile, isAuthenticated } = useAuth();
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 🌟 EXACTLY 4 STREAMLINED CORE MODULES (Clean & Spacious Navbar)
  const navItems = [
    { 
      id: 'command_center', 
      label: t('nav_command_center') || 'Command Center', 
      icon: LayoutDashboard, 
      badge: 'Core',
      desc: 'National Agricultural Command, Real-Time Synergy & Macro KPIs',
      subServices: ['National Output', 'Health Score', 'Action Launcher']
    },
    { 
      id: 'land_satellite', 
      label: 'Land & Satellite', 
      icon: Satellite, 
      badge: 'GIS & SRM',
      desc: 'Geodesic Acreage Scanner & GeoSR-AI Multi-Spectral Super-Resolution',
      subServices: ['Land Measure & Scan', 'GeoSR-AI Studio (4x)']
    },
    { 
      id: 'soil_weather', 
      label: 'Soil & Weather', 
      icon: CloudSun, 
      badge: 'Radar & NPK',
      desc: 'IMD Doppler Radar, 24h Spray Windows & 3-Season Soil NPK Depletion',
      subServices: ['Weather Radar & Spray Windows', 'Soil NPK & Depletion']
    },
    { 
      id: 'farm_hub', 
      label: 'Farm Hub & AI', 
      icon: Bot, 
      badge: 'Krishi AI',
      desc: 'Krishi Mitra AI Advisor, Cloud Farm Parcels & Bharat National BI',
      subServices: ['AI Agronomist Chat', 'My Farm Parcels', 'Bharat Crop Analytics']
    }
  ];

  const currentLangObj = supportedLanguages.find(l => l.code === lang) || supportedLanguages[0];

  const isTabActive = (itemId) => {
    if (activeTab === itemId) return true;
    if (itemId === 'command_center' && activeTab === 'dashboard') return true;
    if (itemId === 'land_satellite' && (activeTab === 'land_scanner' || activeTab === 'satellite_srm')) return true;
    if (itemId === 'soil_weather' && (activeTab === 'weather' || activeTab === 'soil_precision')) return true;
    if (itemId === 'farm_hub' && (activeTab === 'ai_agronomist' || activeTab === 'farms' || activeTab === 'national_analytics')) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-2 sm:top-3 z-40 max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8">
        <div className="bg-[#FEFEFA]/95 backdrop-blur-md border border-[#DED8CF]/80 shadow-soft rounded-[1.75rem] sm:rounded-[2.25rem] p-2 sm:p-3 transition-all duration-300">
          
          {/* Top Tier: Top-Left Hamburger & Language + Logo + Right Controls */}
          <div className="flex items-center justify-between gap-2 px-1 sm:px-3 pb-2 sm:pb-2.5 border-b border-[#DED8CF]/40">
            
            {/* Left Controls: Hamburger Button + Top-Left Minimized Language Selector + Logo */}
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
              <div 
                className="relative flex items-center rounded-full bg-[#F0EBE5]/90 border border-[#DED8CF] px-2.5 py-1 hover:bg-[#F0EBE5] transition shadow-xs cursor-pointer notranslate"
                translate="no"
              >
                <Globe className="w-3.5 h-3.5 text-[#5D7052] mr-1 shrink-0" />
                <span className="text-[11px] sm:text-xs text-[#2C2C24] font-bold notranslate" translate="no">
                  {currentLangObj.native}
                </span>
                <ChevronDown className="w-3 h-3 text-[#78786C] ml-1" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  aria-label="Select Language"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full notranslate"
                  translate="no"
                >
                  {supportedLanguages.map((l) => (
                    <option key={l.code} value={l.code} className="bg-[#FEFEFA] text-[#2C2C24] notranslate">
                      {l.code.toUpperCase()} — {l.native} ({l.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Logo & Platform Name */}
              <div 
                className="flex items-center gap-2 sm:gap-3 cursor-pointer group notranslate" 
                translate="no"
                onClick={() => setActiveTab('command_center')}
              >
                <div className="hidden sm:flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#5D7052] text-[#F3F4F1] shadow-soft group-hover:scale-105 group-hover:bg-[#4D5E44] transition-all shrink-0">
                  <Sprout className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-sm sm:text-xl font-bold tracking-tight text-[#2C2C24] font-serif leading-none notranslate" translate="no">
                      Sufala <span className="text-[#5D7052] italic font-normal">AI</span>
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
            </div>
          </div>

          {/* Bottom Tier: Exactly 4 Clean, Spacious Navigation Tabs (Desktop & Tablet) */}
          <nav className="hidden md:grid grid-cols-4 gap-2 pt-2 pb-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isTabActive(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-[#5D7052] text-[#F3F4F1] shadow-soft scale-100'
                      : 'bg-[#F0EBE5]/40 text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#F3F4F1]' : 'text-[#5D7052]'}`} />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`px-1.5 py-0.2 text-[9px] font-extrabold rounded-full ${
                      active 
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
                    All 4 Core Agri-Modules &amp; Services
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-xs font-bold text-[#78786C] hover:text-[#2C2C24] px-2.5 py-1 rounded-full bg-[#F0EBE5]"
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
                <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {supportedLanguages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLang(l.code)}
                      className={`px-2 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center justify-between notranslate ${
                        lang === l.code
                          ? 'bg-[#5D7052] text-[#FEFEFA] shadow-xs'
                          : 'bg-[#FEFEFA] text-[#2C2C24] hover:bg-[#E6DCCD]'
                      }`}
                      translate="no"
                    >
                      <span>{l.native}</span>
                      <span className="text-[9px] uppercase opacity-70">{l.code}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Links in Drawer */}
              <div className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isTabActive(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all ${
                        active 
                          ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft' 
                          : 'bg-[#FEFEFA] text-[#2C2C24] hover:bg-[#F0EBE5]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl shrink-0 ${active ? 'bg-white/20 text-white' : 'bg-[#5D7052]/10 text-[#5D7052]'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold">{item.label}</span>
                            {item.badge && (
                              <span className={`px-1.5 py-0.2 text-[8px] font-extrabold rounded-full ${
                                active ? 'bg-white/30 text-white' : 'bg-[#C18C5D]/20 text-[#C18C5D]'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className={`text-[10px] font-normal mt-0.5 ${active ? 'text-[#FEFEFA]/80' : 'text-[#78786C]'}`}>
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-[#78786C]'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Quick Farm & Account Action inside mobile menu */}
              <div className="mt-3 pt-2.5 border-t border-[#DED8CF]/60 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-[#5D7052] hover:underline"
                >
                  🌐 Public Home
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xs font-bold text-[#5D7052] hover:underline"
                >
                  👤 {isAuthenticated ? 'Farmer Profile' : 'Sign In / Account'}
                </button>
              </div>

            </div>
          )}

        </div>

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
