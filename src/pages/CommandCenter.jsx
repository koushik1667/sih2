import React from 'react';
import { 
  Satellite, 
  Sprout, 
  BarChart3, 
  Bot, 
  ArrowUpRight, 
  MapPin, 
  TrendingUp, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { MetricCard } from '../components/MetricCard';

export const CommandCenter = () => {
  const { setActiveTab, selectedFarm, farms } = useApp();
  const { t } = useLanguage();

  return (
    <div className="space-y-10 animate-fadeIn">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] p-8 sm:p-10 bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
        <div className="absolute -right-10 -top-10 w-80 h-80 bg-[#5D7052]/10 rounded-full blur-3xl pointer-events-none blob-shape-1" />
        <div className="absolute right-48 -bottom-20 w-72 h-72 bg-[#C18C5D]/10 rounded-full blur-3xl pointer-events-none blob-shape-2" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5D7052]/10 border border-[#5D7052]/20 text-[#5D7052] text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Remote Sensing & Natural Agronomy Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#2C2C24] font-serif leading-tight">
            {t('cmd_welcome')}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-[#78786C] leading-relaxed font-sans">
            {t('cmd_sub')}
          </p>

          {/* Quick Action Pills */}
          <div className="mt-8 flex flex-wrap gap-3.5">
            <button
              onClick={() => setActiveTab('satellite_srm')}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#F3F4F1] font-bold text-xs shadow-soft transition-all hover:scale-105 active:scale-95"
            >
              <Satellite className="w-4 h-4" />
              <span>{t('cmd_launch_srm')}</span>
            </button>

            <button
              onClick={() => setActiveTab('soil_precision')}
              className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#FEFEFA] hover:bg-[#F0EBE5] border-2 border-[#5D7052] text-[#5D7052] font-bold text-xs shadow-soft transition-all hover:scale-105 active:scale-95"
            >
              <Sprout className="w-4 h-4 text-[#5D7052]" />
              <span>{t('cmd_test_soil')}</span>
            </button>

            <button
              onClick={() => setActiveTab('national_analytics')}
              className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#C18C5D] hover:bg-[#A9764A] text-white font-bold text-xs shadow-soft transition-all hover:scale-105 active:scale-95"
            >
              <BarChart3 className="w-4 h-4 text-white" />
              <span>{t('cmd_view_bi')}</span>
            </button>

            <button
              onClick={() => setActiveTab('ai_agronomist')}
              className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#F0EBE5] hover:bg-[#E6DCCD] border border-[#DED8CF] text-[#2C2C24] font-bold text-xs shadow-soft transition-all hover:scale-105 active:scale-95"
            >
              <Bot className="w-4 h-4 text-[#C18C5D]" />
              <span>{t('cmd_ask_ai')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={selectedFarm ? "Selected Farm Land" : t('cmd_active_farms')}
          value={selectedFarm ? `${selectedFarm.land_size_acres} Acres` : `${farms.reduce((acc, f) => acc + (f.land_size_acres || 0), 0).toFixed(1)} Acres`}
          subtitle={selectedFarm ? `${selectedFarm.name} (${selectedFarm.location})` : `${farms.length} Registered Multi-Crop Parcels`}
          icon={MapPin}
          trend={selectedFarm ? `${selectedFarm.current_crop} (${selectedFarm.active_season || 'Kharif'})` : "+18.5% YoY"}
          trendPositive={true}
          color="moss"
          onClick={() => setActiveTab('farms')}
        />
        <MetricCard
          title={selectedFarm ? `${selectedFarm.name.split(' ')[0]} Soil Index` : t('cmd_avg_soil_health')}
          value={selectedFarm ? `${selectedFarm.soil_health?.score || 78.2} / 100` : "78.2 / 100"}
          subtitle={selectedFarm ? `N: ${selectedFarm.soil_health?.nitrogen || 180} | P: ${selectedFarm.soil_health?.phosphorus || 30} | K: ${selectedFarm.soil_health?.potassium || 150}` : "Optimal NPK Balance & 0.82% OC"}
          icon={Sprout}
          trend={selectedFarm ? (selectedFarm.soil_health?.score >= 80 ? "Excellent Fertility" : "Stable (Low Risk)") : "Stable (Low Risk)"}
          trendPositive={true}
          color="moss"
          onClick={() => setActiveTab('soil_precision')}
        />
        <MetricCard
          title={t('cmd_satellite_ready')}
          value="2.5m / px"
          subtitle="EDSR & SwinIR 4x Neural GSD"
          icon={Satellite}
          trend="Sentinel-2 10m → 2.5m"
          trendPositive={true}
          color="clay"
          onClick={() => setActiveTab('satellite_srm')}
        />
        <MetricCard
          title={t('cmd_national_output')}
          value="332.3 MT"
          subtitle="Record National Foodgrain Tonnage"
          icon={TrendingUp}
          trend="+4.8% vs 2022"
          trendPositive={true}
          color="clay"
          onClick={() => setActiveTab('national_analytics')}
        />
      </div>

      {/* Two Column Feature Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Satellite Super-Resolution Live Showcase (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-bold text-[#2C2C24] font-serif flex items-center gap-2.5">
                  <Satellite className="w-5 h-5 text-[#5D7052]" />
                  <span>GeoSR-AI Remote Sensing Studio</span>
                </h3>
                <p className="text-xs text-[#78786C] mt-1 font-medium">
                  Real-time super-resolution mapping for Indian agricultural field boundaries
                </p>
              </div>
              <button
                onClick={() => setActiveTab('satellite_srm')}
                className="px-4 py-1.5 rounded-full bg-[#5D7052]/10 hover:bg-[#5D7052]/20 text-[#5D7052] text-xs font-bold border border-[#5D7052]/30 transition"
              >
                Open Studio →
              </button>
            </div>

            {/* Visual Preview Card */}
            <div className="relative rounded-2xl overflow-hidden bg-[#F0EBE5]/50 border border-[#DED8CF] p-5">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#FEFEFA] border border-[#DED8CF] shadow-sm">
                  <span className="text-[10px] uppercase font-extrabold text-[#C18C5D] block mb-1">Input Sensor</span>
                  <p className="font-bold text-[#2C2C24] font-serif text-sm">Sentinel-2 Multi-Spectral</p>
                  <p className="text-[11px] text-[#78786C] mt-1">10.0 m Ground Sampling Distance</p>
                </div>
                <div className="p-4 rounded-xl bg-[#5D7052]/10 border border-[#5D7052]/30">
                  <span className="text-[10px] uppercase font-extrabold text-[#5D7052] block mb-1">Neural Output (SRM)</span>
                  <p className="font-bold text-[#2C2C24] font-serif text-sm">2.50 m Super-Resolved</p>
                  <p className="text-[11px] text-[#5D7052] mt-1 font-semibold">PSNR: 31.8 dB | SSIM: 0.942</p>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-xl bg-[#FEFEFA] border border-[#DED8CF] text-xs flex items-center justify-between text-[#2C2C24]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#5D7052]" />
                  <span className="font-medium text-[11px]">Presets: Punjab Wheat, Maharashtra Cane, Godavari Rice, MP Soybean</span>
                </div>
                <span className="font-bold text-[#C18C5D] text-xs bg-[#C18C5D]/10 px-2 py-0.5 rounded-full">4x Scale</span>
              </div>
            </div>
          </div>

          {/* Active Field Overview */}
          {selectedFarm ? (
            <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-[#5D7052]/10 text-[#5D7052]">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#2C2C24] font-serif">{selectedFarm.name}</h4>
                    <p className="text-xs text-[#78786C] font-medium">{selectedFarm.location} • {selectedFarm.current_crop} ({selectedFarm.active_season})</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20">
                  {selectedFarm.land_size_acres} Acres
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 text-center text-xs">
                <div className="p-3 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
                  <span className="text-[10px] text-[#78786C] font-bold uppercase block">Nitrogen (N)</span>
                  <span className="font-serif font-bold text-[#5D7052] text-base">{selectedFarm.soil_health?.nitrogen ?? 160} kg/ha</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
                  <span className="text-[10px] text-[#78786C] font-bold uppercase block">Phosphorus (P)</span>
                  <span className="font-serif font-bold text-[#C18C5D] text-base">{selectedFarm.soil_health?.phosphorus ?? 30} kg/ha</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
                  <span className="text-[10px] text-[#78786C] font-bold uppercase block">Potassium (K)</span>
                  <span className="font-serif font-bold text-[#78786C] text-base">{selectedFarm.soil_health?.potassium ?? 140} kg/ha</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-dashed border-[#DED8CF] shadow-soft flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-[#5D7052]/10 text-[#5D7052]">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#2C2C24] font-serif">No Field Registered Yet</h4>
                  <p className="text-xs text-[#78786C]">Add your first farm parcel to view live soil NPK health</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('farms')}
                className="px-4 py-2 rounded-full bg-[#5D7052] text-[#FEFEFA] text-xs font-bold shadow-soft hover:bg-[#4D5E44] transition shrink-0 cursor-pointer"
              >
                + Register Farm
              </button>
            </div>
          )}
        </div>

        {/* Right Column: National Power BI Snapshot & Weather (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* National Crop Power BI Summary Card */}
          <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#2C2C24] font-serif flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#C18C5D]" />
                <span>Bharat Agriculture BI Insights</span>
              </h3>
              <button
                onClick={() => setActiveTab('national_analytics')}
                className="text-xs text-[#C18C5D] font-bold hover:underline"
              >
                Deep-Dive →
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF]">
                <span className="text-[#78786C] font-medium">Top Producing State</span>
                <span className="font-bold text-[#2C2C24] font-serif">Uttar Pradesh (58.4 MT)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF]">
                <span className="text-[#78786C] font-medium">Highest Yield Productivity</span>
                <span className="font-bold text-[#5D7052] font-serif">Punjab (94.2 Index)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF]">
                <span className="text-[#78786C] font-medium">Dominant Season Tonnage</span>
                <span className="font-bold text-[#C18C5D] font-serif">Kharif (52.4% Share)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF]">
                <span className="text-[#78786C] font-medium">National Weather Risk Index</span>
                <span className="font-bold text-[#2C2C24] font-serif">46.2 / 100 (Moderate)</span>
              </div>
            </div>
          </div>

          {/* AI Agronomist Quick Prompt Widget */}
          <div className="p-7 rounded-[2.25rem] bg-gradient-to-br from-[#FEFEFA] to-[#E6DCCD]/30 border border-[#DED8CF] shadow-soft">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 rounded-2xl bg-[#C18C5D]/10 text-[#C18C5D]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#2C2C24] font-serif">Krishi Mitra AI Assistant</h4>
                <p className="text-xs text-[#78786C] font-medium">ICAR-backed Multilingual Advisor</p>
              </div>
            </div>

            <p className="text-xs text-[#2C2C24] italic mb-5 leading-relaxed bg-[#FEFEFA] p-3.5 rounded-xl border border-[#DED8CF]/60">
              "Optimal time for second urea split dose in wheat tillering stage is 21-25 days after first irrigation."
            </p>

            <button
              onClick={() => setActiveTab('ai_agronomist')}
              className="w-full py-3 px-4 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-xs font-bold text-[#F3F4F1] shadow-soft transition flex items-center justify-center gap-2 hover:scale-102 active:scale-98"
            >
              <span>Consult AI Agronomist</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
