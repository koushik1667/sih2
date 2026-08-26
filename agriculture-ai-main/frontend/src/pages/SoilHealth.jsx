import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FlaskConical, Thermometer, Droplets, Leaf, TrendingUp,
  TrendingDown, AlertTriangle, CheckCircle2, Info,
  Layers, Wind, Zap, ArrowRight
} from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

/* ── Data ──────────────────────────────────────── */
const NUTRIENTS = [
  { name: 'Nitrogen',   symbol: 'N', value: 68, unit: 'kg/ha', status: 'Medium', trend: 'down', color: 'sky',     max: 120 },
  { name: 'Phosphorus', symbol: 'P', value: 42, unit: 'kg/ha', status: 'Good',   trend: 'stable', color: 'harvest', max: 80 },
  { name: 'Potassium',  symbol: 'K', value: 89, unit: 'kg/ha', status: 'Good',   trend: 'up',  color: 'brand',   max: 120 },
  { name: 'Sulfur',     symbol: 'S', value: 18, unit: 'mg/kg', status: 'Low',    trend: 'down', color: 'alert',   max: 50 },
  { name: 'Zinc',       symbol: 'Zn', value: 1.8, unit: 'mg/kg', status: 'Low',  trend: 'stable', color: 'lavender', max: 5 },
  { name: 'Organic C',  symbol: 'OC', value: 0.65, unit: '%',  status: 'Low',    trend: 'down', color: 'harvest', max: 2 },
];

const RADAR_DATA = [
  { subject: 'pH',      A: 85 },
  { subject: 'Nitrogen', A: 57 },
  { subject: 'Phosphorus', A: 70 },
  { subject: 'Potassium', A: 74 },
  { subject: 'Organic', A: 33 },
  { subject: 'Moisture', A: 62 },
];

const LAYERS = [
  { depth: '0–15 cm',   label: 'Topsoil',     color: 'bg-amber-800/60',  desc: 'Rich organic matter, best for roots' },
  { depth: '15–30 cm',  label: 'Sub-topsoil', color: 'bg-amber-700/50',  desc: 'Clay content higher, some compaction' },
  { depth: '30–60 cm',  label: 'Subsoil',     color: 'bg-amber-600/40',  desc: 'Reduced pore space, limited root penetration' },
  { depth: '60–90 cm',  label: 'Parent rock', color: 'bg-stone-600/30',  desc: 'Weathered material, low biological activity' },
];

const RECS = [
  { icon: TrendingUp,    color: 'brand',   title: 'Apply Urea (top-dressing)',  body: '30 kg/acre — address Nitrogen decline before tillering ends. Best applied after light rain or irrigation.' },
  { icon: Zap,           color: 'sky',     title: 'Add Sulfur micronutrients',  body: 'Sulfur at 10 kg/acre is recommended. Deficiency shows as yellowing of new leaves.' },
  { icon: Leaf,          color: 'harvest', title: 'Improve Organic Carbon',     body: 'Incorporate green manure or compost. Target OC > 1.0% over 2 seasons for soil structure improvement.' },
  { icon: CheckCircle2,  color: 'brand',   title: 'Potassium levels — good',    body: 'No action needed this season. Monitor post-harvest.' },
];

const colorMap = {
  brand:   { bar: 'bg-brand',   text: 'text-brand',   badge: 'bg-brand/15 text-brand border-brand/25',   icon: 'text-brand' },
  harvest: { bar: 'bg-harvest', text: 'text-harvest', badge: 'bg-harvest/15 text-harvest border-harvest/25', icon: 'text-harvest' },
  sky:     { bar: 'bg-sky',     text: 'text-sky',     badge: 'bg-sky/15 text-sky border-sky/25',         icon: 'text-sky' },
  alert:   { bar: 'bg-alert',   text: 'text-alert',   badge: 'bg-alert/15 text-alert border-alert/25',   icon: 'text-alert' },
  lavender:{ bar: 'bg-lavender',text: 'text-lavender',badge: 'bg-lavender/15 text-lavender border-lavender/25', icon: 'text-lavender' },
};

function PHGauge({ value = 6.8 }) {
  const min = 4, max = 9, range = max - min;
  const pct = ((value - min) / range) * 100;
  const label = value < 6 ? 'Acidic' : value <= 7.5 ? 'Neutral (Ideal)' : 'Alkaline';
  const color = value < 5.5 ? '#fb7185' : value <= 7.5 ? '#22c55e' : '#fbbf24';

  return (
    <div className="flex flex-col items-center">
      {/* Semicircle gauge */}
      <div className="relative w-40 h-20 mb-3">
        <svg viewBox="0 0 160 80" className="w-full h-full">
          {/* Track */}
          <path d="M 10 75 A 70 70 0 0 1 150 75" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round" />
          {/* Gradient fill */}
          <defs>
            <linearGradient id="phGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="40%" stopColor="#fbbf24" />
              <stop offset="65%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <path d="M 10 75 A 70 70 0 0 1 150 75" fill="none" stroke="url(#phGrad)" strokeWidth="10" strokeLinecap="round" strokeOpacity="0.25" />
          {/* Needle */}
          <motion.line
            x1="80" y1="75"
            initial={{ x2: 80, y2: 20 }}
            animate={{
              x2: 80 + Math.sin(((pct / 100) - 0.5) * Math.PI) * 62,
              y2: 75 - Math.cos(((pct / 100) - 0.5) * Math.PI) * 62,
            }}
            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            stroke={color} strokeWidth="2.5" strokeLinecap="round"
          />
          <circle cx="80" cy="75" r="5" fill={color} />
          {/* Scale labels */}
          <text x="6" y="78" fill="#6e906f" fontSize="9" fontFamily="monospace">4</text>
          <text x="74" y="12" fill="#6e906f" fontSize="9" fontFamily="monospace">6.5</text>
          <text x="147" y="78" fill="#6e906f" fontSize="9" fontFamily="monospace">9</text>
        </svg>
      </div>
      <div className="text-center">
        <span className="font-display text-4xl font-bold" style={{ color }}>{value}</span>
        <p className="text-xs font-semibold mt-1" style={{ color }}>{label}</p>
        <p className="text-[10px] text-neutral-600 mt-0.5">Optimal for wheat: 6.0 – 7.5</p>
      </div>
    </div>
  );
}

function NutrientRow({ nutrient, index }) {
  const pct = (nutrient.value / nutrient.max) * 100;
  const c = colorMap[nutrient.color];
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08 * index + 0.3, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3"
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs font-mono ${c.badge} border`}>
        {nutrient.symbol}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-neutral-300">{nutrient.name}</span>
          <div className="flex items-center gap-1.5">
            {nutrient.trend === 'down' && <TrendingDown className="w-3 h-3 text-alert" />}
            {nutrient.trend === 'up' && <TrendingUp className="w-3 h-3 text-brand" />}
            <span className={`text-[10px] font-bold ${c.text}`}>{nutrient.value} {nutrient.unit}</span>
          </div>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(pct, 100)}%` }}
            transition={{ delay: 0.1 * index + 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className={`h-full rounded-full ${c.bar}`}
          />
        </div>
      </div>
      <span className={`text-[10px] font-semibold w-14 text-right flex-shrink-0 ${
        nutrient.status === 'Good' ? 'text-brand' :
        nutrient.status === 'Medium' ? 'text-harvest' :
        'text-alert'
      }`}>{nutrient.status}</span>
    </motion.div>
  );
}

export default function SoilHealth() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="px-4 py-6 md:px-8 md:py-8 max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-harvest/10 border border-harvest/20 rounded-xl flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-harvest" />
            </div>
            <p className="text-harvest text-xs font-bold uppercase tracking-widest">Lab Analysis</p>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold text-neutral-50">Soil Health</h1>
              <p className="text-neutral-500 text-sm mt-1">Field A (4.2 ha) · Last tested 3 days ago</p>
            </div>
            <button
              onClick={() => navigate('/farms')}
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-200 transition-colors border border-white/[0.08] rounded-xl px-3 py-2"
            >
              Full Report <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* Top row: pH + Radar + Health Score */}
        <div className="grid md:grid-cols-3 gap-5 mb-5">

          {/* pH Gauge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-3xl p-5 flex flex-col items-center justify-center border border-brand/10"
          >
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Soil pH</p>
            <PHGauge value={6.8} />
          </motion.div>

          {/* Radar chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-3xl p-5"
          >
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Nutrient Balance</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#4a6b4c', fontSize: 10 }} />
                  <Radar
                    name="Soil" dataKey="A"
                    stroke="#22c55e" fill="#22c55e" fillOpacity={0.18} strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{ background: '#0d140e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 11 }}
                    labelStyle={{ color: '#9ab89b' }}
                    itemStyle={{ color: '#22c55e' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Overall soil score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.26, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-3xl p-5 flex flex-col justify-between"
          >
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Overall Score</p>
            <div className="flex flex-col items-center my-2">
              <span className="font-display text-5xl font-bold gradient-text-brand">68</span>
              <span className="text-xs text-neutral-500 mt-1">/100</span>
              <div className="mt-3 px-3 py-1.5 bg-harvest/10 border border-harvest/20 rounded-full">
                <span className="text-xs font-bold text-harvest">Needs Attention</span>
              </div>
            </div>
            <div className="space-y-1.5 mt-3">
              {[
                { label: 'Macronutrients', val: 74, color: 'bg-brand' },
                { label: 'Micronutrients', val: 42, color: 'bg-harvest' },
                { label: 'Structure',      val: 71, color: 'bg-sky' },
                { label: 'Organic',        val: 33, color: 'bg-alert' },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-[10px] text-neutral-600 w-24 flex-shrink-0">{label}</span>
                  <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full rounded-full ${color}`}
                    />
                  </div>
                  <span className="text-[10px] text-neutral-500 w-7 text-right">{val}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Nutrients + Soil layers */}
        <div className="grid md:grid-cols-2 gap-5 mb-5">

          {/* NPK + micro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-3xl p-5"
          >
            <p className="text-sm font-bold text-neutral-200 mb-4">Nutrient Levels</p>
            <div className="space-y-3.5">
              {NUTRIENTS.map((n, i) => <NutrientRow key={n.name} nutrient={n} index={i} />)}
            </div>
          </motion.div>

          {/* Soil layers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-3xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-harvest" />
              <p className="text-sm font-bold text-neutral-200">Soil Profile</p>
            </div>
            <div className="space-y-2">
              {LAYERS.map(({ depth, label, color, desc }, i) => (
                <motion.div
                  key={depth}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]"
                >
                  <div className={`w-10 h-10 rounded-xl ${color} flex-shrink-0 border border-white/[0.08]`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-neutral-200">{label}</p>
                      <span className="text-[10px] font-mono text-neutral-600">{depth}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Moisture info */}
            <div className="mt-4 p-3 rounded-2xl bg-sky/8 border border-sky/15">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-sky" />
                <p className="text-xs font-bold text-sky">Moisture Status</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Current: <strong className="text-neutral-200">38%</strong></span>
                <span className="text-xs text-neutral-400">Field capacity: <strong className="text-neutral-200">45%</strong></span>
              </div>
              <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '38%' }}
                  transition={{ delay: 0.7, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-sky rounded-full"
                />
              </div>
              <p className="text-[10px] text-sky/70 mt-1.5">⚠ Below field capacity — irrigation recommended</p>
            </div>
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-lavender" />
            <p className="text-sm font-bold text-neutral-200">AI Recommendations</p>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {RECS.map(({ icon: Ic, color, title, body }, i) => {
              const c = colorMap[color] || colorMap.brand;
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${c.badge} border text-xs`}>
                      <Ic className="w-3.5 h-3.5" />
                    </div>
                    <p className={`text-xs font-bold ${c.text}`}>{title}</p>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">{body}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </Layout>
  );
}
