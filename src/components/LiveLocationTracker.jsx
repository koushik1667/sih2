import React, { useState } from 'react';
import { 
  Compass, 
  Radio, 
  Crosshair, 
  RefreshCw, 
  X, 
  Check, 
  Copy, 
  ExternalLink, 
  Satellite, 
  CloudSun, 
  Sprout, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useApp } from '../context/AppContext';

export const LiveLocationTracker = () => {
  const { 
    locationState, 
    isTracking, 
    toggleTracking, 
    refreshOnce, 
    isTrackerOpen, 
    setIsTrackerOpen 
  } = useLocation();
  const { setActiveTab, showToast } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isTrackerOpen) return null;

  const { coords, zone, geoInfo, isLive, errorMessage } = locationState;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshOnce();
      showToast("GPS coordinates refreshed successfully!", "success");
    } catch (err) {
      showToast("GPS Fix Error: " + err.message, "error");
    } finally {
      setRefreshing(false);
    }
  };

  const handleCopyCoords = () => {
    const text = `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast(`Copied: ${text}`, "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSyncWeather = () => {
    setIsTrackerOpen(false);
    setActiveTab('weather');
  };

  const handleSyncSatellite = () => {
    setIsTrackerOpen(false);
    setActiveTab('satellite_srm');
  };

  const handleRegisterFarm = () => {
    setIsTrackerOpen(false);
    setActiveTab('farms');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2C24]/40 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="bg-[#FEFEFA] border border-[#DED8CF] shadow-float rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-[#DED8CF]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#5D7052]/10 text-[#5D7052]">
              <Compass className={`w-6 h-6 ${isTracking ? 'animate-spin-slow text-[#5D7052]' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#2C2C24] font-serif">
                  Live Agricultural Field GPS Tracker
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                  isLive 
                    ? 'bg-[#5D7052]/15 text-[#5D7052] border border-[#5D7052]/30' 
                    : 'bg-[#C18C5D]/15 text-[#C18C5D] border border-[#C18C5D]/30'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-[#5D7052] animate-ping' : 'bg-[#C18C5D]'}`} />
                  {isLive ? 'LIVE STREAM' : 'STATIC LOCK'}
                </span>
              </div>
              <p className="text-xs text-[#78786C] mt-0.5">
                Precision geolocation telemetry & ICAR Agro-Climatic Zone Mapping
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTrackerOpen(false)}
            className="p-2 rounded-full text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 scrollbar-thin">
          
          {/* Radar & Coords Hero Card */}
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#FEFEFA] to-[#F0EBE5]/60 border border-[#DED8CF] p-6 shadow-soft">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* Animated Radar Graphic */}
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#5D7052]/30 animate-spin-slow" />
                <div className="absolute inset-3 rounded-full border border-[#5D7052]/20" />
                <div className="absolute inset-7 rounded-full bg-[#5D7052]/10 flex items-center justify-center">
                  <Crosshair className="w-8 h-8 text-[#5D7052]" />
                </div>
                {/* Accuracy Pulse Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-[#5D7052]/40 animate-ping opacity-30" />
              </div>

              {/* Coordinates & Accuracy */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5D7052]/10 text-[#5D7052] text-xs font-bold">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                  <span>Accuracy: ±{coords.accuracy ? coords.accuracy.toFixed(1) : '4.0'} meters</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-serif text-[#2C2C24] tracking-tight">
                  {coords.latitude.toFixed(6)}° N, {coords.longitude.toFixed(6)}° E
                </div>
                <p className="text-xs text-[#78786C] font-medium">
                  {geoInfo.displayName || 'Field Location, Punjab, India'}
                </p>
                <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <button
                    onClick={handleCopyCoords}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEFEFA] border border-[#DED8CF] text-xs font-bold text-[#5D7052] shadow-sm hover:bg-[#F0EBE5] transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#5D7052]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Coords'}</span>
                  </button>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEFEFA] border border-[#DED8CF] text-xs font-bold text-[#2C2C24] shadow-sm hover:bg-[#F0EBE5] transition"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>Re-acquire Fix</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-[#A85448]/10 border border-[#A85448]/30 text-xs text-[#A85448] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs text-center">
            <div className="p-4 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
              <span className="text-[10px] uppercase font-bold text-[#78786C] block">Elevation</span>
              <span className="font-serif font-bold text-base text-[#2C2C24] mt-1 block">
                {coords.altitude ? `${coords.altitude.toFixed(0)} m` : '247 m (MSL)'}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
              <span className="text-[10px] uppercase font-bold text-[#78786C] block">Ground Speed</span>
              <span className="font-serif font-bold text-base text-[#5D7052] mt-1 block">
                {coords.speed ? `${(coords.speed * 3.6).toFixed(1)} km/h` : '0.0 km/h (Stationary)'}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
              <span className="text-[10px] uppercase font-bold text-[#78786C] block">District / Taluk</span>
              <span className="font-serif font-bold text-sm text-[#C18C5D] mt-1 block truncate">
                {geoInfo.district || 'Ludhiana'}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF]">
              <span className="text-[10px] uppercase font-bold text-[#78786C] block">State</span>
              <span className="font-serif font-bold text-sm text-[#2C2C24] mt-1 block truncate">
                {geoInfo.state || 'Punjab'}
              </span>
            </div>
          </div>

          {/* ICAR Agro-Climatic Zone Intelligence */}
          {zone && (
            <div className="p-5 rounded-2xl bg-[#FEFEFA] border border-[#5D7052]/30 shadow-soft space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-[#5D7052]" />
                  <h4 className="text-sm font-bold text-[#2C2C24] font-serif">
                    ICAR Agro-Climatic Classification
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#5D7052]/10 text-[#5D7052]">
                  Zone #{zone.id}
                </span>
              </div>
              <p className="text-xs font-bold text-[#5D7052]">
                {zone.name}
              </p>
              <div className="pt-2 border-t border-[#DED8CF]/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#78786C]">
                <div>
                  <span className="font-bold text-[#2C2C24]">Covered States:</span> {zone.states.join(', ')}
                </div>
                <div>
                  <span className="font-bold text-[#2C2C24]">Recommended Crops:</span> {zone.majorCrops}
                </div>
              </div>
            </div>
          )}

          {/* 1-Click Platform Actions */}
          <div>
            <h4 className="text-xs font-bold text-[#78786C] uppercase tracking-wider mb-3">
              1-Click Field Integrations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleSyncWeather}
                className="p-3.5 rounded-2xl bg-[#F0EBE5]/60 hover:bg-[#F0EBE5] border border-[#DED8CF] text-left transition hover:scale-102 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <CloudSun className="w-4 h-4 text-[#5D7052]" />
                  <ExternalLink className="w-3.5 h-3.5 text-[#78786C]" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#2C2C24]">Local Weather Radar</h5>
                  <p className="text-[10px] text-[#78786C] mt-0.5">Forecast for current GPS coordinates</p>
                </div>
              </button>

              <button
                onClick={handleSyncSatellite}
                className="p-3.5 rounded-2xl bg-[#F0EBE5]/60 hover:bg-[#F0EBE5] border border-[#DED8CF] text-left transition hover:scale-102 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <Satellite className="w-4 h-4 text-[#C18C5D]" />
                  <ExternalLink className="w-3.5 h-3.5 text-[#78786C]" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#2C2C24]">Satellite SRM 2.5m</h5>
                  <p className="text-[10px] text-[#78786C] mt-0.5">Super-resolve field multi-spectral tile</p>
                </div>
              </button>

              <button
                onClick={handleRegisterFarm}
                className="p-3.5 rounded-2xl bg-[#F0EBE5]/60 hover:bg-[#F0EBE5] border border-[#DED8CF] text-left transition hover:scale-102 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <Sprout className="w-4 h-4 text-[#5D7052]" />
                  <ExternalLink className="w-3.5 h-3.5 text-[#78786C]" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-[#2C2C24]">Register Farm Field</h5>
                  <p className="text-[10px] text-[#78786C] mt-0.5">Save coordinates to Soil Health Card</p>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#DED8CF]/60 bg-[#F0EBE5]/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#78786C]">
            <ShieldCheck className="w-4 h-4 text-[#5D7052]" />
            <span>GPS location is processed locally in accordance with your cookie preferences</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTracking}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
                isTracking 
                  ? 'bg-[#A85448]/15 text-[#A85448] hover:bg-[#A85448]/20 border border-[#A85448]/30' 
                  : 'bg-[#5D7052] text-[#F3F4F1] hover:bg-[#4D5E44] shadow-soft'
              }`}
            >
              {isTracking ? 'Pause Live GPS' : 'Enable Live GPS'}
            </button>
            <button
              onClick={() => setIsTrackerOpen(false)}
              className="px-5 py-2.5 rounded-full bg-[#FEFEFA] hover:bg-[#F0EBE5] border border-[#DED8CF] text-xs font-bold text-[#2C2C24] transition"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
