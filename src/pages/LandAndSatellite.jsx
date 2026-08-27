import React, { useState, useEffect } from 'react';
import { Compass, Satellite, Sparkles, Layers } from 'lucide-react';
import { LiveLandScannerMap } from './LiveLandScannerMap';
import { SatelliteSRM } from './SatelliteSRM';
import { useApp } from '../context/AppContext';

export const LandAndSatellite = ({ defaultSubTab = 'scanner' }) => {
  const { activeTab } = useApp();
  const [subTab, setSubTab] = useState(() => {
    if (activeTab === 'satellite_srm') return 'srm';
    return defaultSubTab || 'scanner';
  });

  useEffect(() => {
    if (activeTab === 'satellite_srm') {
      setSubTab('srm');
    } else if (activeTab === 'land_scanner') {
      setSubTab('scanner');
    }
  }, [activeTab]);

  return (
    <div className="space-y-4">
      {/* Top Segmented Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FEFEFA] p-2.5 sm:p-3 rounded-3xl border border-[#DED8CF] shadow-soft">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-[#5D7052]/10 text-[#5D7052]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#2C2C24] font-serif leading-tight">
              Geospatial Remote Sensing &amp; Land Intelligence
            </h2>
            <p className="text-[11px] text-[#78786C]">
              Switch seamlessly between Real-Time Geodesic Land Measuring and Satellite SRM Super-Resolution
            </p>
          </div>
        </div>

        {/* 2-Pill Segmented Switcher */}
        <div className="flex items-center p-1 bg-[#F0EBE5]/80 rounded-2xl border border-[#DED8CF] self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setSubTab('scanner')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'scanner'
                ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft scale-102'
                : 'text-[#78786C] hover:text-[#2C2C24]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Land Measure &amp; Scanner</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('srm')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subTab === 'srm'
                ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft scale-102'
                : 'text-[#78786C] hover:text-[#2C2C24]'
            }`}
          >
            <Satellite className="w-4 h-4" />
            <span>GeoSR-AI Studio</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-[#C18C5D]/20 text-[#C18C5D] font-extrabold hidden sm:inline">
              4x Neural
            </span>
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      {subTab === 'scanner' ? <LiveLandScannerMap /> : <SatelliteSRM />}
    </div>
  );
};
