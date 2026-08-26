import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, MessageCircle, Leaf, CloudSun,
  FlaskConical, User, Sprout, Wifi, WifiOff, LogOut,
  ChevronRight, Bell
} from 'lucide-react';

const navItems = [
  { path: '/dashboard',  icon: LayoutDashboard, label: 'Home',    color: 'brand' },
  { path: '/chat',       icon: MessageCircle,   label: 'AI Chat', color: 'lavender' },
  { path: '/crops',      icon: Leaf,            label: 'Crops',   color: 'brand' },
  { path: '/weather',    icon: CloudSun,        label: 'Weather', color: 'sky' },
  { path: '/soil',       icon: FlaskConical,    label: 'Soil',    color: 'harvest' },
  { path: '/profile',    icon: User,            label: 'Profile', color: 'brand' },
];

const colorMap = {
  brand:    { active: 'text-brand bg-brand/15 border-brand/25',    dot: 'bg-brand' },
  lavender: { active: 'text-lavender bg-lavender/15 border-lavender/25', dot: 'bg-lavender' },
  sky:      { active: 'text-sky bg-sky/15 border-sky/25',          dot: 'bg-sky' },
  harvest:  { active: 'text-harvest bg-harvest/15 border-harvest/25', dot: 'bg-harvest' },
};

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const on  = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const currentPage = navItems.find(n => n.path === location.pathname);

  return (
    <div className="min-h-[100dvh] bg-neutral-950 text-neutral-50 font-sans flex relative">

      {/* ── Ambient background glows ───────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] bg-brand/4 rounded-full blur-[160px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] bg-harvest/3 rounded-full blur-[180px]" />
      </div>

      {/* ── Desktop sidebar ────────────────────────── */}
      <motion.aside
        animate={{ width: sidebarExpanded ? 220 : 72 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
        className="hidden md:flex flex-col fixed top-0 left-0 h-full z-40 glass border-r border-white/[0.05] overflow-hidden"
        style={{ minWidth: 72 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 h-16 border-b border-white/[0.05]">
          <motion.div
            animate={{ boxShadow: ['0 0 0px rgba(34,197,94,0)', '0 0 18px rgba(34,197,94,0.5)', '0 0 0px rgba(34,197,94,0)'] }}
            transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2 }}
            className="w-9 h-9 bg-brand/20 rounded-xl flex items-center justify-center border border-brand/30 flex-shrink-0"
          >
            <Sprout className="w-5 h-5 text-brand" />
          </motion.div>
          <AnimatePresence>
            {sidebarExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-bold text-neutral-50 whitespace-nowrap font-display"
              >
                AgriTech AI
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
          {navItems.map(({ path, icon: Icon, label, color }) => {
            const active = location.pathname === path;
            const colors = colorMap[color];
            return (
              <motion.button
                key={path}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 border relative ${
                  active
                    ? `${colors.active} border-opacity-100`
                    : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5 border-transparent'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <AnimatePresence>
                  {sidebarExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="sidebarActive"
                    className={`absolute right-2 w-1.5 h-1.5 rounded-full ${colors.dot}`}
                  />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom: status + user + logout */}
        <div className="px-3 pb-4 space-y-2 border-t border-white/[0.05] pt-3">

          {/* Network indicator */}
          <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl ${isOnline ? 'bg-brand/8' : 'bg-harvest/10'}`}>
            {isOnline
              ? <Wifi className="w-4 h-4 text-brand flex-shrink-0" />
              : <WifiOff className="w-4 h-4 text-harvest flex-shrink-0" />
            }
            <AnimatePresence>
              {sidebarExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`text-xs font-medium whitespace-nowrap ${isOnline ? 'text-brand' : 'text-harvest'}`}
                >
                  {isOnline ? 'Connected' : 'Offline Mode'}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* User avatar + logout */}
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand/50 to-brand/10 border border-brand/25 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-brand">{(user.name || 'F')[0].toUpperCase()}</span>
            </div>
            <AnimatePresence>
              {sidebarExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0 flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-neutral-200 truncate">{user.name || 'Farmer'}</p>
                    <p className="text-xs text-neutral-500 truncate">{user.phone || 'AgriTech AI'}</p>
                  </div>
                  <button onClick={handleLogout} className="text-neutral-600 hover:text-alert transition-colors ml-2">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* ── Main content area ──────────────────────── */}
      <main className="flex-1 md:ml-[72px] pb-20 md:pb-0 min-h-[100dvh] relative z-10">

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/[0.05] glass sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-brand/20 rounded-lg flex items-center justify-center border border-brand/30">
              <Sprout className="w-4 h-4 text-brand" />
            </div>
            <span className="text-sm font-bold font-display text-neutral-50">AgriTech AI</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Offline pill */}
            {!isOnline && (
              <div className="flex items-center gap-1 bg-harvest/15 text-harvest text-xs font-medium px-2 py-1 rounded-full">
                <WifiOff className="w-3 h-3" />
                Offline
              </div>
            )}
            <button
              onClick={() => navigate('/chat')}
              className="relative w-8 h-8 rounded-full glass-light flex items-center justify-center"
            >
              <Bell className="w-4 h-4 text-neutral-400" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-alert rounded-full border border-neutral-950" />
            </button>
          </div>
        </div>

        {children}
      </main>

      {/* ── Mobile bottom nav ──────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/[0.05] px-2 py-2 flex items-center justify-around">
        {navItems.map(({ path, icon: Icon, label, color }) => {
          const active = location.pathname === path;
          const colors = colorMap[color];
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`relative flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl transition-all ${
                active ? `${colors.active} border` : 'text-neutral-600 border border-transparent'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{label}</span>
              {active && <motion.div layoutId="mobileActive" className={`absolute -bottom-0.5 w-4 h-0.5 rounded-full ${colors.dot}`} />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
