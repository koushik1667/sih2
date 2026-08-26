import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets,
  Thermometer, Eye, AlertTriangle, Bell, CheckCircle2,
  CloudLightning, Sunrise, Sunset, ArrowUp, ArrowDown,
  Gauge, Navigation
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import Layout from '../components/Layout';

/* ── Mock data ─────────────────────────────────── */
const HOURLY = [
  { time: '6am',  temp: 22, humidity: 78, rain: 0 },
  { time: '8am',  temp: 24, humidity: 72, rain: 0 },
  { time: '10am', temp: 27, humidity: 65, rain: 0 },
  { time: '12pm', temp: 30, humidity: 58, rain: 10 },
  { time: '2pm',  temp: 31, humidity: 60, rain: 25 },
  { time: '4pm',  temp: 28, humidity: 68, rain: 15 },
  { time: '6pm',  temp: 26, humidity: 74, rain: 5 },
  { time: '8pm',  temp: 24, humidity: 80, rain: 0 },
  { time: '10pm', temp: 22, humidity: 82, rain: 0 },
];

const FORECAST = [
  { day: 'Today',   icon: CloudRain,    high: 31, low: 22, desc: 'Afternoon showers', rain: 60, color: 'sky' },
  { day: 'Tue',     icon: Cloud,        high: 29, low: 21, desc: 'Partly cloudy',     rain: 20, color: 'neutral' },
  { day: 'Wed',     icon: Sun,          high: 33, low: 24, desc: 'Sunny',             rain: 5,  color: 'harvest' },
  { day: 'Thu',     icon: Sun,          high: 34, low: 25, desc: 'Clear skies',       rain: 0,  color: 'harvest' },
  { day: 'Fri',     icon: CloudLightning, high: 28, low: 20, desc: 'Thunderstorm risk', rain: 75, color: 'alert' },
  { day: 'Sat',     icon: CloudRain,    high: 26, low: 19, desc: 'Heavy rain',        rain: 85, color: 'sky' },
  { day: 'Sun',     icon: Cloud,        high: 27, low: 20, desc: 'Overcast',          rain: 30, color: 'neutral' },
];

const ALERTS = [
  {
    level: 'warning',
    icon: CloudLightning,
    title: 'Thunderstorm Advisory — Friday',
    body: 'High wind gusts (50–70 km/h) expected. Secure loose equipment and avoid field operations.',
    action: 'Delay pesticide application by 2 days',
    time: 'Issued 1h ago',
    color: 'alert',
  },
  {
    level: 'watch',
    icon: Droplets,
    title: 'Heavy Rainfall Watch — Saturday',
    body: '85mm of rainfall expected. Risk of surface runoff in Field B (low gradient terrain).',
    action: 'Check drainage channels before Friday',
    time: 'Issued 1h ago',
    color: 'sky',
  },
  {
    level: 'info',
    icon: Sun,
    title: 'Optimal Spray Window — Wednesday',
    body: 'Low wind speed (< 8 km/h) and clear skies forecast. Best time for foliar application.',
    action: 'Schedule pesticide spray for 7–10am',
    time: 'AI recommendation',
    color: 'brand',
  },
];

const colorMap = {
  alert:   { bg: 'bg-alert/8 border-alert/20', icon: 'text-alert', title: 'text-alert', badge: 'bg-alert/15 text-alert' },
  sky:     { bg: 'bg-sky/8 border-sky/20',     icon: 'text-sky',   title: 'text-sky',   badge: 'bg-sky/15 text-sky' },
  brand:   { bg: 'bg-brand/8 border-brand/20', icon: 'text-brand', title: 'text-brand', badge: 'bg-brand/15 text-brand' },
  harvest: { bg: 'bg-harvest/8 border-harvest/20', icon: 'text-harvest', title: 'text-harvest', badge: 'bg-harvest/15 text-harvest' },
  neutral: { bg: 'bg-white/[0.03] border-white/[0.08]', icon: 'text-neutral-400', title: 'text-neutral-200', badge: 'bg-white/[0.06] text-neutral-400' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl border border-white/[0.1] px-3 py-2.5 text-xs shadow-xl">
      <p className="text-neutral-400 mb-1 font-semibold">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-bold">
          {p.name}: {p.value}{p.dataKey === 'temp' ? '°C' : p.dataKey === 'humidity' ? '%' : 'mm'}
        </p>
      ))}
    </div>
  );
};

export default function WeatherAlerts() {
  const [activeMetric, setActiveMetric] = useState('temp');

  const metricConfig = {
    temp:     { color: '#fb7185', label: 'Temperature (°C)', gradient: ['#fb7185', '#fb718520'] },
    humidity: { color: '#38bdf8', label: 'Humidity (%)',     gradient: ['#38bdf8', '#38bdf820'] },
    rain:     { color: '#22c55e', label: 'Rain (mm)',        gradient: ['#22c55e', '#22c55e20'] },
  };

  const mc = metricConfig[activeMetric];

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
            <div className="w-8 h-8 bg-sky/10 border border-sky/20 rounded-xl flex items-center justify-center">
              <Cloud className="w-4 h-4 text-sky" />
            </div>
            <p className="text-sky text-xs font-bold uppercase tracking-widest">Live Forecast</p>
          </div>
          <h1 className="font-display text-3xl font-bold text-neutral-50">Weather & Alerts</h1>
          <p className="text-neutral-500 text-sm mt-1">Pune, Maharashtra · Updated 10 min ago</p>
        </motion.div>

        {/* Current weather hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl p-6 mb-5 relative overflow-hidden border border-sky/10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-brand/3 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-wrap items-start gap-6">
            {/* Main temp */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <CloudRain className="w-16 h-16 text-sky" />
                </motion.div>
              </div>
              <div>
                <div className="flex items-start">
                  <span className="font-display text-6xl font-bold text-neutral-50">28</span>
                  <span className="text-2xl text-neutral-500 mt-2">°C</span>
                </div>
                <p className="text-sm font-medium text-sky mt-1">Partly Cloudy with showers</p>
                <p className="text-xs text-neutral-600 mt-0.5">Feels like 30°C · Pune, MH</p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-20 bg-white/[0.06] self-center" />

            {/* Detail stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1 min-w-0">
              {[
                { icon: Droplets,   label: 'Humidity',   value: '68%',    color: 'text-sky' },
                { icon: Wind,       label: 'Wind',       value: '18 km/h', color: 'text-neutral-300' },
                { icon: Gauge,      label: 'Pressure',   value: '1012 hPa',color: 'text-neutral-300' },
                { icon: Eye,        label: 'Visibility', value: '8 km',   color: 'text-neutral-300' },
                { icon: Sunrise,    label: 'Sunrise',    value: '6:24 AM', color: 'text-harvest' },
                { icon: Sunset,     label: 'Sunset',     value: '6:48 PM', color: 'text-harvest' },
              ].map(({ icon: Ic, label, value, color }) => (
                <div key={label} className="flex items-center gap-2 bg-white/[0.03] rounded-xl p-2.5 border border-white/[0.05]">
                  <Ic className={`w-4 h-4 ${color} flex-shrink-0`} />
                  <div>
                    <p className="text-[10px] text-neutral-600">{label}</p>
                    <p className="text-xs font-bold text-neutral-200">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Hourly chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl p-5 mb-5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-neutral-200">Today's Hourly Trend</p>
            <div className="flex gap-1.5">
              {Object.entries(metricConfig).map(([key, { label, color }]) => (
                <button
                  key={key}
                  onClick={() => setActiveMetric(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    activeMetric === key
                      ? 'border-current'
                      : 'border-white/[0.07] text-neutral-500 hover:text-neutral-300'
                  }`}
                  style={activeMetric === key ? { color, borderColor: color, backgroundColor: `${color}18` } : {}}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={mc.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={mc.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#4a6b4c', fontSize: 11 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4a6b4c', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone" dataKey={activeMetric}
                  stroke={mc.color} strokeWidth={2.5}
                  fill="url(#chartGrad)"
                  dot={{ r: 0 }} activeDot={{ r: 4, fill: mc.color, strokeWidth: 0 }}
                  name={activeMetric}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 7-day forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl p-5 mb-5"
        >
          <p className="text-sm font-bold text-neutral-200 mb-4">7-Day Forecast</p>
          <div className="grid grid-cols-7 gap-2">
            {FORECAST.map(({ day, icon: Ic, high, low, desc, rain, color }, i) => {
              const c = colorMap[color] || colorMap.neutral;
              return (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-colors ${i === 0 ? `${c.bg} border-opacity-100` : 'border-transparent hover:border-white/[0.08]'}`}
                >
                  <p className={`text-[10px] font-bold ${i === 0 ? c.icon : 'text-neutral-500'}`}>{day}</p>
                  <Ic className={`w-5 h-5 ${c.icon}`} />
                  <p className="text-xs font-bold text-neutral-100">{high}°</p>
                  <p className="text-[10px] text-neutral-600">{low}°</p>
                  {rain > 0 && (
                    <div className="flex items-center gap-0.5">
                      <Droplets className="w-2.5 h-2.5 text-sky" />
                      <span className="text-[9px] text-sky font-medium">{rain}%</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Farm alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-neutral-400" />
            <p className="text-sm font-bold text-neutral-200">Farm Alerts & Recommendations</p>
            <span className="ml-auto text-[10px] font-bold text-alert bg-alert/15 border border-alert/20 px-2 py-0.5 rounded-full">
              {ALERTS.length} active
            </span>
          </div>
          <div className="space-y-3">
            {ALERTS.map(({ level, icon: Ic, title, body, action, time, color }, i) => {
              const c = colorMap[color];
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.09, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className={`rounded-2xl border p-4 ${c.bg}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${c.badge}`}>
                      <Ic className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className={`text-sm font-bold ${c.title}`}>{title}</p>
                        <span className="text-[10px] text-neutral-600">{time}</span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed mb-2">{body}</p>
                      <div className="flex items-center gap-1.5 bg-white/[0.04] rounded-xl px-3 py-2 border border-white/[0.07] w-fit">
                        <CheckCircle2 className={`w-3 h-3 ${c.icon} flex-shrink-0`} />
                        <span className="text-[11px] font-semibold text-neutral-300">{action}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </Layout>
  );
}
