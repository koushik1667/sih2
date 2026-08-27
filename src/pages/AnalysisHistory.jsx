import React, { useState, useEffect } from 'react';
import {
  History,
  Satellite,
  Layers,
  Sparkles,
  MapPin,
  Calendar,
  Search,
  Filter,
  Download,
  Trash2,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Bot,
  CloudSun,
  Sprout,
  CheckCircle2,
  RefreshCw,
  Clock,
  ShieldCheck,
  FileText,
  Tag
} from 'lucide-react';
import { historyService } from '../services/historyService';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

export const AnalysisHistory = () => {
  const { setActiveTab, setSelectedParcelForSRM, showToast } = useApp();
  const { t } = useLanguage();

  const [historyList, setHistoryList] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'satellite', 'land_measure', 'soil_precision', 'weather', 'ai_advisor'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    const unsub = historyService.subscribe(data => {
      setHistoryList(data);
    });
    return () => unsub();
  }, []);

  const filteredHistory = historyList.filter(item => {
    if (activeFilter !== 'all' && item.type !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchLoc = item.location?.toLowerCase().includes(q);
      const matchSummary = item.summary?.toLowerCase().includes(q);
      const matchTag = item.tags?.some(tag => tag.toLowerCase().includes(q));
      return matchTitle || matchLoc || matchSummary || matchTag;
    }
    return true;
  });

  const getModuleIcon = (type) => {
    switch (type) {
      case 'satellite':
        return <Satellite className="w-4 h-4 text-[#A3E635]" />;
      case 'land_measure':
        return <Layers className="w-4 h-4 text-[#5D7052]" />;
      case 'soil_precision':
        return <Sprout className="w-4 h-4 text-[#C18C5D]" />;
      case 'weather':
        return <CloudSun className="w-4 h-4 text-[#4A90E2]" />;
      case 'ai_advisor':
        return <Bot className="w-4 h-4 text-[#A85448]" />;
      default:
        return <History className="w-4 h-4 text-[#5D7052]" />;
    }
  };

  const getModuleBadgeColor = (type) => {
    switch (type) {
      case 'satellite':
        return 'bg-[#A3E635]/15 text-[#3D5C14] border-[#A3E635]/30';
      case 'land_measure':
        return 'bg-[#5D7052]/15 text-[#5D7052] border-[#5D7052]/30';
      case 'soil_precision':
        return 'bg-[#C18C5D]/15 text-[#8F5A29] border-[#C18C5D]/30';
      case 'weather':
        return 'bg-[#4A90E2]/15 text-[#215A9E] border-[#4A90E2]/30';
      case 'ai_advisor':
        return 'bg-[#A85448]/15 text-[#A85448] border-[#A85448]/30';
      default:
        return 'bg-[#5D7052]/15 text-[#5D7052] border-[#DED8CF]';
    }
  };

  const handleExportJSON = () => {
    const dataStr = historyService.exportAsJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AgriSphere_Analysis_History_Audit_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Audit history exported successfully as JSON report.", "success");
  };

  const handleNavigateToModule = (item) => {
    if (item.type === 'satellite') {
      if (item.coordinates) {
        setSelectedParcelForSRM({
          name: item.title,
          acres: parseFloat(item.metrics?.find(m => m.label.includes('Acre'))?.value) || 2.5,
          lat: item.coordinates.lat,
          lon: item.coordinates.lon,
          crop: item.details?.crop || "Standing Crop"
        });
      }
      setActiveTab('land_satellite');
    } else if (item.type === 'land_measure') {
      setActiveTab('land_satellite');
    } else if (item.type === 'soil_precision') {
      setActiveTab('soil_weather');
    } else if (item.type === 'weather') {
      setActiveTab('soil_weather');
    } else if (item.type === 'ai_advisor') {
      setActiveTab('farm_hub');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FEFEFA] p-6 rounded-3xl border border-[#DED8CF] shadow-soft">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#5D7052]/15 text-[#5D7052]">
            <History className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#2C2C24] font-serif">
                Universal Analysis History &amp; Audit Vault
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#5D7052]/10 text-[#5D7052] text-[10px] font-extrabold uppercase font-mono">
                {historyList.length} Logged
              </span>
            </div>
            <p className="text-xs text-[#78786C] mt-0.5">
              Persistent chronological record of all satellite super-resolutions, land scans, soil drawdowns &amp; AI advisories
            </p>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FEFEFA] border border-[#DED8CF] text-xs font-bold text-[#2C2C24] hover:bg-[#F0EBE5] transition shadow-soft cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#5D7052]" />
            <span>Export Audit Log</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirmClear) {
                historyService.clearAll();
                setConfirmClear(false);
                showToast("History log cleared.", "info");
              } else {
                setConfirmClear(true);
                setTimeout(() => setConfirmClear(false), 4000);
              }
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition shadow-soft cursor-pointer ${
              confirmClear
                ? 'bg-[#A85448] text-[#FEFEFA]'
                : 'bg-[#FEFEFA] border border-[#DED8CF] text-[#78786C] hover:text-[#A85448]'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmClear ? "Confirm Wipe?" : "Clear"}</span>
          </button>
        </div>
      </div>

      {/* 4 Overview Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-3xl bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
          <div className="flex items-center justify-between text-xs text-[#78786C]">
            <span className="font-bold">Satellite SRM Runs</span>
            <Satellite className="w-4 h-4 text-[#A3E635]" />
          </div>
          <div className="text-2xl font-bold text-[#2C2C24] font-serif mt-2">
            {historyList.filter(h => h.type === 'satellite').length}
          </div>
          <div className="text-[11px] text-[#5D7052] font-semibold mt-0.5">
            2.5m GSD Multi-Spectral
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
          <div className="flex items-center justify-between text-xs text-[#78786C]">
            <span className="font-bold">Land Parcels Measured</span>
            <Layers className="w-4 h-4 text-[#5D7052]" />
          </div>
          <div className="text-2xl font-bold text-[#2C2C24] font-serif mt-2">
            {historyList.filter(h => h.type === 'land_measure').length}
          </div>
          <div className="text-[11px] text-[#5D7052] font-semibold mt-0.5">
            Geodesic Acreage &amp; GIS
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
          <div className="flex items-center justify-between text-xs text-[#78786C]">
            <span className="font-bold">Soil NPK Simulations</span>
            <Sprout className="w-4 h-4 text-[#C18C5D]" />
          </div>
          <div className="text-2xl font-bold text-[#2C2C24] font-serif mt-2">
            {historyList.filter(h => h.type === 'soil_precision').length}
          </div>
          <div className="text-[11px] text-[#C18C5D] font-semibold mt-0.5">
            3-Season Profit Drawdowns
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
          <div className="flex items-center justify-between text-xs text-[#78786C]">
            <span className="font-bold">AI Agronomist Chats</span>
            <Bot className="w-4 h-4 text-[#A85448]" />
          </div>
          <div className="text-2xl font-bold text-[#2C2C24] font-serif mt-2">
            {historyList.filter(h => h.type === 'ai_advisor').length}
          </div>
          <div className="text-[11px] text-[#A85448] font-semibold mt-0.5">
            Krishi Mitra Multilingual
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#FEFEFA] p-3 rounded-2xl border border-[#DED8CF]">
        {/* Module Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Audits', icon: History },
            { id: 'satellite', label: 'Satellite SRM', icon: Satellite },
            { id: 'land_measure', label: 'Land Measure', icon: Layers },
            { id: 'soil_precision', label: 'Soil NPK', icon: Sprout },
            { id: 'weather', label: 'Weather Radar', icon: CloudSun },
            { id: 'ai_advisor', label: 'AI Advisories', icon: Bot }
          ].map(tab => {
            const Icon = tab.icon;
            const isSel = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isSel
                    ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft'
                    : 'bg-[#F0EBE5]/60 text-[#78786C] hover:text-[#2C2C24]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by parcel, crop or query..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#FDFCF8] border border-[#DED8CF] text-xs text-[#2C2C24] placeholder-[#78786C]/70 outline-none focus:border-[#5D7052]"
          />
          <Search className="w-3.5 h-3.5 text-[#78786C] absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* History Timeline Ledger Cards */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 text-center bg-[#FEFEFA] rounded-3xl border border-[#DED8CF] shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#5D7052]/10 text-[#5D7052] flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#2C2C24] font-serif">No Analyses Found</h3>
          <p className="text-xs text-[#78786C] max-w-sm mx-auto">
            {searchQuery ? "No audit logs match your search filter." : "Run a satellite super-resolution, land measurement or soil test to begin logging history."}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredHistory.map((item) => {
            const isExpanded = expandedId === item.id;
            const dateStr = new Date(item.timestamp).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={item.id}
                className="bg-[#FEFEFA] rounded-3xl border border-[#DED8CF] shadow-soft overflow-hidden transition hover:border-[#5D7052]/50"
              >
                {/* Item Row Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 cursor-pointer hover:bg-[#FDFCF8]"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-2xl bg-[#F0EBE5] text-[#5D7052] shrink-0 mt-0.5">
                      {getModuleIcon(item.type)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-bold text-[#2C2C24] font-serif">
                          {item.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getModuleBadgeColor(item.type)}`}>
                          {item.type.replace('_', ' ')}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#5D7052]/10 text-[#5D7052] text-[10px] font-bold">
                          {item.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#78786C]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#C18C5D]" />
                          {item.location}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#5D7052]" />
                          {dateStr}
                        </span>
                      </div>

                      <p className="text-xs text-[#525247] leading-relaxed line-clamp-1">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  {/* Summary Metric Badges & Arrow */}
                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    {item.metrics && item.metrics.length > 0 && (
                      <div className="flex items-center gap-2">
                        {item.metrics.slice(0, 2).map((m, idx) => (
                          <div key={idx} className="px-2.5 py-1 rounded-xl bg-[#F0EBE5]/80 text-[11px] text-[#2C2C24] font-semibold border border-[#DED8CF]/60">
                            <span className="text-[#78786C] text-[10px] mr-1">{m.label}:</span>
                            <span className="font-bold text-[#5D7052]">{m.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="p-1 rounded-full text-[#78786C]">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Deep Inspection Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-[#DED8CF]/60 bg-[#FDFCF8]/80 space-y-4 text-xs animate-fadeIn">
                    
                    {/* All Key Metrics Grid */}
                    {item.metrics && item.metrics.length > 0 && (
                      <div>
                        <span className="font-bold text-[#78786C] block uppercase tracking-wider text-[10px] mb-2">
                          Key Audit Metrics &amp; Telemetry:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {item.metrics.map((metric, i) => (
                            <div key={i} className="p-3 rounded-2xl bg-[#FEFEFA] border border-[#DED8CF]">
                              <span className="text-[10px] text-[#78786C] block">{metric.label}</span>
                              <span className="text-xs font-bold text-[#2C2C24] block mt-0.5">{metric.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Deep Details & Recommendations */}
                    {item.details && Object.keys(item.details).length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-[#FEFEFA] border border-[#DED8CF] space-y-1.5">
                        <span className="font-bold text-[#5D7052] block font-serif">Deep Analysis Breakdown:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#525247]">
                          {Object.entries(item.details).map(([k, v]) => (
                            <div key={k} className="flex items-start gap-1.5">
                              <span className="font-bold text-[#78786C] capitalize">{k.replace(/_/g, ' ')}:</span>
                              <span className="font-medium text-[#2C2C24]">{typeof v === 'object' ? JSON.stringify(v) : v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bottom Actions Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#DED8CF]/40">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {item.tags?.map((tag, tIdx) => (
                          <span key={tIdx} className="px-2 py-0.5 rounded-md bg-[#5D7052]/10 text-[#5D7052] text-[10px] font-semibold">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            historyService.deleteEntry(item.id);
                            showToast("Entry removed from audit vault.", "info");
                          }}
                          className="px-3 py-1.5 rounded-xl text-[#78786C] hover:text-[#A85448] hover:bg-[#A85448]/10 text-xs font-bold transition cursor-pointer"
                        >
                          Delete
                        </button>

                        <button
                          type="button"
                          onClick={() => handleNavigateToModule(item)}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#5D7052] text-[#FEFEFA] text-xs font-bold hover:bg-[#4D5E44] transition shadow-soft cursor-pointer"
                        >
                          <span>Open in Studio</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
