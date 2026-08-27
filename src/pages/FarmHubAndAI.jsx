import React, { useState, useEffect } from 'react';
import { Bot, MapPin, BarChart3, Users, Sparkles, History } from 'lucide-react';
import { AIAgronomist } from './AIAgronomist';
import { FarmManagement } from './FarmManagement';
import { NationalAnalytics } from './NationalAnalytics';
import { AnalysisHistory } from './AnalysisHistory';
import { useApp } from '../context/AppContext';

export const FarmHubAndAI = ({ defaultSubTab = 'ai' }) => {
  const { activeTab } = useApp();
  const [subTab, setSubTab] = useState(() => {
    if (activeTab === 'farms') return 'farms';
    if (activeTab === 'national_analytics') return 'analytics';
    if (activeTab === 'history') return 'history';
    return defaultSubTab || 'ai';
  });

  useEffect(() => {
    if (activeTab === 'farms') {
      setSubTab('farms');
    } else if (activeTab === 'national_analytics') {
      setSubTab('analytics');
    } else if (activeTab === 'ai_agronomist') {
      setSubTab('ai');
    } else if (activeTab === 'history') {
      setSubTab('history');
    }
  }, [activeTab]);

  return (
    <div className="space-y-4">
      {/* Top Segmented Sub-Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FEFEFA] p-2.5 sm:p-3 rounded-3xl border border-[#DED8CF] shadow-soft">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-[#5D7052]/10 text-[#5D7052]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#2C2C24] font-serif leading-tight">
              Farm Hub, AI Agronomist, Analytics &amp; History
            </h2>
            <p className="text-[11px] text-[#78786C]">
              Krishi Mitra RAG Advisor, Cloud Farm Parcels, Bharat Crop BI &amp; Audit Vault
            </p>
          </div>
        </div>

        {/* 4-Pill Segmented Switcher */}
        <div className="flex items-center p-1 bg-[#F0EBE5]/80 rounded-2xl border border-[#DED8CF] self-start sm:self-auto shrink-0 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setSubTab('ai')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              subTab === 'ai'
                ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft scale-102'
                : 'text-[#78786C] hover:text-[#2C2C24]'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Agronomist</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-[#C18C5D]/20 text-[#C18C5D] font-extrabold hidden sm:inline">
              Krishi Mitra
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('farms')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              subTab === 'farms'
                ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft scale-102'
                : 'text-[#78786C] hover:text-[#2C2C24]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>My Farm Parcels</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('analytics')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              subTab === 'analytics'
                ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft scale-102'
                : 'text-[#78786C] hover:text-[#2C2C24]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>National Analytics</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-[#5D7052]/20 text-[#5D7052] font-extrabold hidden sm:inline">
              Power BI
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('history')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              subTab === 'history'
                ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft scale-102'
                : 'text-[#78786C] hover:text-[#2C2C24]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Analysis History</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-[#A85448]/20 text-[#A85448] font-extrabold hidden sm:inline">
              Audit Vault
            </span>
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      {subTab === 'ai' && <AIAgronomist />}
      {subTab === 'farms' && <FarmManagement />}
      {subTab === 'analytics' && <NationalAnalytics />}
      {subTab === 'history' && <AnalysisHistory />}
    </div>
  );
};
