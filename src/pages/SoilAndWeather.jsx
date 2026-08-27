import React, { useState, useEffect } from 'react';
import { CloudSun, Sprout, Sparkles, Activity } from 'lucide-react';
import { WeatherRadar } from './WeatherRadar';
import { SoilPrecision } from './SoilPrecision';
import { useApp } from '../context/AppContext';

export const SoilAndWeather = ({ defaultSubTab = 'weather' }) => {
  const { activeTab } = useApp();
  const [subTab, setSubTab] = useState(() => {
    if (activeTab === 'soil_precision') return 'soil';
    return defaultSubTab || 'weather';
  });

  useEffect(() => {
    if (activeTab === 'soil_precision') {
      setSubTab('soil');
    } else if (activeTab === 'weather') {
      setSubTab('weather');
    }
  }, [activeTab]);

  return (
    <div className="space-y-4">
      {/* Top Segmented Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FEFEFA] p-2.5 sm:p-3 rounded-3xl border border-[#DED8CF] shadow-soft">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-[#5D7052]/10 text-[#5D7052]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#2C2C24] font-serif leading-tight">
              Soil Dynamics &amp; Meteorological Radar Intelligence
            </h2>
            <p className="text-[11px] text-[#78786C]">
              Real-Time IMD / Open-Meteo Precision Radar, 24h Spray Windows &amp; 3-Season NPK Nutrient Drawdown
            </p>
          </div>
        </div>

        {/* 2-Pill Segmented Switcher */}
        <div className="flex items-center p-1 bg-[#F0EBE5]/80 rounded-2xl border border-[#DED8CF] self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setSubTab('weather')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'weather'
                ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft scale-102'
                : 'text-[#78786C] hover:text-[#2C2C24]'
            }`}
          >
            <CloudSun className="w-4 h-4" />
            <span>Weather Radar &amp; Microclimate</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-[#A8E6CF]/30 text-[#5D7052] font-extrabold hidden sm:inline">
              Live IMD
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('soil')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'soil'
                ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft scale-102'
                : 'text-[#78786C] hover:text-[#2C2C24]'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Soil NPK &amp; Depletion</span>
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      {subTab === 'weather' ? <WeatherRadar /> : <SoilPrecision />}
    </div>
  );
};
