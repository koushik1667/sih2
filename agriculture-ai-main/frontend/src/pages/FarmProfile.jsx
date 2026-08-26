import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, MapPin, Phone, Sprout, Leaf, FlaskConical,
  Calendar, Edit3, Check, X, LogOut, ChevronRight,
  Wheat, Sun, Droplets, TrendingUp, Award, Clock,
  Plus, Camera, Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

/* ── Mock data ─────────────────────────────────── */
const CROP_HISTORY = [
  { crop: 'Wheat',   season: 'Rabi 2024-25',  yield: '3.8 t/ha', status: 'active',    icon: Wheat, color: 'brand' },
  { crop: 'Soybean', season: 'Kharif 2024',   yield: '2.4 t/ha', status: 'harvested', icon: Sprout, color: 'harvest' },
  { crop: 'Chickpea',season: 'Rabi 2023-24',  yield: '1.6 t/ha', status: 'harvested', icon: Leaf,  color: 'sky' },
  { crop: 'Maize',   season: 'Kharif 2023',   yield: '5.9 t/ha', status: 'harvested', icon: Wheat, color: 'lavender' },
];

const ACHIEVEMENTS = [
  { icon: Award,    label: 'Top Yielder',       desc: 'Wheat yield above regional avg', color: 'harvest' },
  { icon: Droplets, label: 'Water Saver',        desc: 'Saved 18% irrigation water',    color: 'sky' },
  { icon: Shield,   label: 'Soil Guardian',      desc: 'pH maintained for 2 seasons',   color: 'brand' },
];

const colorMap = {
  brand:   { bg: 'bg-brand/10 border-brand/20',   text: 'text-brand',   dot: 'bg-brand' },
  harvest: { bg: 'bg-harvest/10 border-harvest/20', text: 'text-harvest', dot: 'bg-harvest' },
  sky:     { bg: 'bg-sky/10 border-sky/20',        text: 'text-sky',     dot: 'bg-sky' },
  lavender:{ bg: 'bg-lavender/10 border-lavender/20', text: 'text-lavender', dot: 'bg-lavender' },
};

function EditableField({ label, value, icon: Icon, onSave }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  const [saved, setSaved] = useState(value);

  const handleSave = () => {
    setSaved(val);
    onSave?.(val);
    setEditing(false);
  };
  const handleCancel = () => { setVal(saved); setEditing(false); };

  return (
    <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] group">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-[10px] text-neutral-600 font-semibold uppercase tracking-wider">{label}</span>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg text-neutral-600 hover:text-neutral-300 hover:bg-white/[0.06]"
          >
            <Edit3 className="w-3 h-3" />
          </button>
        ) : (
          <div className="flex gap-1">
            <button onClick={handleSave}   className="p-1 rounded-lg text-brand hover:bg-brand/10"><Check className="w-3 h-3" /></button>
            <button onClick={handleCancel} className="p-1 rounded-lg text-alert hover:bg-alert/10"><X    className="w-3 h-3" /></button>
          </div>
        )}
      </div>
      {editing ? (
        <input
          autoFocus
          value={val}
          onChange={e => setVal(e.target.value)}
          className="w-full bg-transparent text-sm font-medium text-neutral-100 outline-none border-b border-brand/40 pb-0.5"
        />
      ) : (
        <p className="text-sm font-semibold text-neutral-100">{saved}</p>
      )}
    </div>
  );
}

export default function FarmProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [activeTab, setActiveTab] = useState('overview');

  const TABS = ['overview', 'history', 'achievements'];

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <Layout>
      <div className="px-4 py-6 md:px-8 md:py-8 max-w-4xl mx-auto">

        {/* ── Profile hero ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl p-6 mb-5 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/4 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-harvest/3 rounded-full blur-2xl pointer-events-none" />

          {/* Farm banner gradient */}
          <div className="h-20 -mx-6 -mt-6 mb-6 rounded-t-3xl bg-gradient-to-br from-neutral-800/80 via-brand/10 to-harvest/8 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <Wheat className="w-32 h-32 text-brand" />
            </div>
            <button className="absolute bottom-2 right-3 flex items-center gap-1 text-[10px] font-semibold text-neutral-400 hover:text-neutral-200 transition-colors bg-black/30 rounded-lg px-2 py-1">
              <Camera className="w-3 h-3" /> Edit Banner
            </button>
          </div>

          <div className="relative z-10 flex items-start gap-4">
            {/* Avatar */}
            <div className="relative -mt-10 flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand/60 to-brand/20 border-2 border-neutral-950 shadow-xl flex items-center justify-center">
                <span className="font-display text-2xl font-bold text-brand">{(user.name || 'F')[0].toUpperCase()}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-brand rounded-full border-2 border-neutral-950 flex items-center justify-center">
                <Check className="w-3 h-3 text-neutral-950" />
              </div>
            </div>

            {/* Name & info */}
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl font-bold text-neutral-50">{user.name || 'Farmer'}</h1>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1">
                <span className="flex items-center gap-1 text-xs text-neutral-500">
                  <MapPin className="w-3 h-3" /> Pune, Maharashtra
                </span>
                <span className="flex items-center gap-1 text-xs text-neutral-500">
                  <Phone className="w-3 h-3" /> {user.phone || '+91 98765 43210'}
                </span>
                <span className="flex items-center gap-1 text-xs text-neutral-500">
                  <Calendar className="w-3 h-3" /> Farming since 2015
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="px-2 py-0.5 bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold rounded-full">
                  Verified Farmer
                </span>
                <span className="px-2 py-0.5 bg-harvest/10 border border-harvest/20 text-harvest text-[10px] font-bold rounded-full">
                  4 Seasons Active
                </span>
              </div>
            </div>

            <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-alert transition-colors border border-white/[0.07] rounded-xl px-3 py-2 hover:border-alert/20">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>

          {/* Stat summary */}
          <div className="grid grid-cols-4 gap-3 mt-5 pt-5 border-t border-white/[0.06]">
            {[
              { label: 'Total Area',    value: '4.2 ha',  icon: MapPin,     color: 'text-brand' },
              { label: 'Active Crops',  value: '1',       icon: Sprout,     color: 'text-brand' },
              { label: 'Avg pH',        value: '6.8',     icon: FlaskConical, color: 'text-harvest' },
              { label: 'Health Score',  value: '84%',     icon: TrendingUp, color: 'text-sky' },
            ].map(({ label, value, icon: Ic, color }) => (
              <div key={label} className="text-center">
                <Ic className={`w-4 h-4 ${color} mx-auto mb-1`} />
                <p className="font-display text-lg font-bold text-neutral-50">{value}</p>
                <p className="text-[10px] text-neutral-600">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Tabs ─────────────────────────────────── */}
        <div className="flex gap-1 mb-5 glass rounded-2xl p-1.5">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-brand/15 text-brand border border-brand/25'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── Overview tab ─────────────────────────── */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              {/* Farm details */}
              <div className="glass rounded-3xl p-5">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Farm Details</p>
                <div className="grid md:grid-cols-2 gap-3">
                  <EditableField label="Farm Name"    value="Shivaji Farms"            icon={Sprout}   />
                  <EditableField label="Location"     value="Pune, Maharashtra"         icon={MapPin}   />
                  <EditableField label="Total Area"   value="4.2 hectares"              icon={Sun}      />
                  <EditableField label="Soil Type"    value="Sandy Loam / Loamy"        icon={FlaskConical} />
                  <EditableField label="Water Source" value="Borewell + Canal"          icon={Droplets} />
                  <EditableField label="Primary Crop" value="Wheat, Soybean"            icon={Wheat}    />
                </div>
              </div>

              {/* Quick nav to tools */}
              <div className="glass rounded-3xl p-5">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Farm Tools</p>
                <div className="space-y-2">
                  {[
                    { label: 'View Soil Analysis Report', path: '/soil',    icon: FlaskConical, color: 'harvest' },
                    { label: 'Get Crop Recommendations',  path: '/crops',   icon: Leaf,         color: 'brand' },
                    { label: 'Check Weather Forecast',    path: '/weather', icon: Sun,          color: 'sky' },
                    { label: 'Chat with AI Assistant',    path: '/chat',    icon: Sprout,       color: 'lavender' },
                  ].map(({ label, path, icon: Ic, color }) => {
                    const c = colorMap[color];
                    return (
                      <button
                        key={label}
                        onClick={() => navigate(path)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${c.bg}`}>
                          <Ic className={`w-3.5 h-3.5 ${c.text}`} />
                        </div>
                        <span className="text-sm font-medium text-neutral-300 group-hover:text-neutral-100 transition-colors">{label}</span>
                        <ChevronRight className="w-4 h-4 text-neutral-700 group-hover:text-neutral-400 ml-auto transition-colors group-hover:translate-x-0.5 group-hover:transition-transform" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── History tab ──────────────────────────── */}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass rounded-3xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-neutral-200">Crop History</p>
                <button className="flex items-center gap-1 text-xs text-brand hover:text-brand-light transition-colors font-semibold">
                  <Plus className="w-3.5 h-3.5" /> Add Record
                </button>
              </div>
              <div className="space-y-3">
                {CROP_HISTORY.map(({ crop, season, yield: y, status, icon: Ic, color }, i) => {
                  const c = colorMap[color];
                  return (
                    <motion.div
                      key={crop + season}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${c.bg} flex-shrink-0`}>
                        <Ic className={`w-5 h-5 ${c.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-neutral-200">{crop}</p>
                          {status === 'active' && (
                            <span className="text-[9px] font-bold bg-brand/15 text-brand border border-brand/25 px-1.5 py-0.5 rounded-full">ACTIVE</span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-600">{season}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-neutral-200">{y}</p>
                        <p className="text-[10px] text-neutral-600">Yield</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── Achievements tab ─────────────────────── */}
          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-5"
            >
              <div className="glass rounded-3xl p-5">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Earned Badges</p>
                <div className="grid md:grid-cols-3 gap-3">
                  {ACHIEVEMENTS.map(({ icon: Ic, label, desc, color }, i) => {
                    const c = colorMap[color];
                    return (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className={`p-4 rounded-2xl border ${c.bg} flex flex-col items-center text-center gap-2`}
                      >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${c.bg} border`}>
                          <Ic className={`w-6 h-6 ${c.text}`} />
                        </div>
                        <p className={`text-sm font-bold ${c.text}`}>{label}</p>
                        <p className="text-[11px] text-neutral-500">{desc}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Usage stats */}
              <div className="glass rounded-3xl p-5">
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">App Usage</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'AI Chat Sessions', value: '47',  icon: Sprout,   color: 'lavender' },
                    { label: 'Soil Analyses',    value: '12',  icon: FlaskConical, color: 'harvest' },
                    { label: 'Days Active',      value: '128', icon: Clock,    color: 'brand' },
                    { label: 'Alerts Resolved',  value: '31',  icon: Check,    color: 'sky' },
                  ].map(({ label, value, icon: Ic, color }) => {
                    const c = colorMap[color];
                    return (
                      <div key={label} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${c.bg}`}>
                          <Ic className={`w-4 h-4 ${c.text}`} />
                        </div>
                        <div>
                          <p className="font-display text-xl font-bold text-neutral-50">{value}</p>
                          <p className="text-[10px] text-neutral-600">{label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </Layout>
  );
}
