import React, { useState, useEffect, useCallback } from 'react';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  MapPin,
  ThermometerSun,
  Radio,
  Compass,
  Navigation,
  Activity,
  Send,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Sun,
  CloudRain,
  ShieldAlert,
  Layers,
  Sparkles,
  ChevronRight,
  Gauge
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useLocation } from '../context/LocationContext';
import { NotificationManager } from '../services/notificationManager';
import { searchLocations } from '../services/geoService';

const QUICK_LOCATIONS = [
  { name: 'Ward 108 Miyapur (Hyderabad, TG)', lat: 17.4933, lon: 78.3424, state: 'Telangana', tag: 'Deccan Zone' },
  { name: 'Ludhiana, Punjab', lat: 30.9010, lon: 75.8573, state: 'Punjab', tag: 'Indo-Gangetic' },
  { name: 'Kolhapur, Maharashtra', lat: 16.7050, lon: 74.2433, state: 'Maharashtra', tag: 'Sugar Belt' },
  { name: 'East Godavari, AP', lat: 16.9891, lon: 82.2475, state: 'Andhra Pradesh', tag: 'Coastal Delta' },
  { name: 'Mysuru / Mandya, Karnataka', lat: 12.5230, lon: 76.8970, state: 'Karnataka', tag: 'Southern Plateau' }
];

export const WeatherRadar = () => {
  const { t } = useLanguage();
  const { selectedFarm, farms } = useApp();
  const { locationState, isTracking, toggleTracking, refreshOnce, setIsTrackerOpen } = useLocation();

  // Always default to user's live GPS coordinates
  const [useLiveGPS, setUseLiveGPS] = useState(true);
  const [selectedQuickLoc, setSelectedQuickLoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [customLocationName, setCustomLocationName] = useState('');

  const [weatherData, setWeatherData] = useState(null);
  const [alertsData, setAlertsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pushStatus, setPushStatus] = useState({});

  // Auto-acquire live location on load if not already live
  useEffect(() => {
    if (!locationState.isLive && typeof refreshOnce === 'function') {
      refreshOnce().catch(() => {});
    }
  }, []);

  const fetchWeather = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      let lat = null;
      let lon = null;
      let locName = 'Live Ag Field Location';
      let stateName = 'General';

      if (useLiveGPS && locationState?.coords) {
        lat = locationState.coords.latitude;
        lon = locationState.coords.longitude;
        locName = locationState.geoInfo?.displayName || locationState.geoInfo?.town || `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`;
        stateName = locationState.geoInfo?.state || 'General';
      } else if (selectedQuickLoc) {
        lat = selectedQuickLoc.lat;
        lon = selectedQuickLoc.lon;
        locName = selectedQuickLoc.name;
        stateName = selectedQuickLoc.state;
      } else if (selectedFarm) {
        locName = selectedFarm.location;
        lat = selectedFarm.coordinates?.lat || null;
        lon = selectedFarm.coordinates?.lng || null;
        stateName = selectedFarm.location?.split(',')[1]?.trim() || 'Punjab';
      } else if (customLocationName) {
        locName = customLocationName;
      }

      const [w, a] = await Promise.all([
        api.getWeather(locName, lat, lon),
        api.getWeatherAlerts(stateName)
      ]);

      setWeatherData(w);
      setAlertsData(a);
    } catch (err) {
      console.error("Failed to load weather:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [useLiveGPS, locationState?.coords, locationState?.geoInfo, selectedQuickLoc, selectedFarm, customLocationName]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const handleSelectLiveGPS = () => {
    setUseLiveGPS(true);
    setSelectedQuickLoc(null);
    setCustomLocationName('');
    if (!isTracking) {
      toggleTracking();
    }
  };

  const handleSelectQuickLocation = (loc) => {
    setUseLiveGPS(false);
    setSelectedQuickLoc(loc);
    setCustomLocationName('');
  };

  const handleSelectFarm = (farm) => {
    setUseLiveGPS(false);
    setSelectedQuickLoc(null);
    setCustomLocationName(farm.location);
  };

  const handleCustomSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setUseLiveGPS(false);
    
    try {
      const results = await searchLocations(searchQuery.trim());
      if (results && results.length > 0) {
        const top = results[0];
        setSelectedQuickLoc({
          name: top.displayName,
          lat: top.lat,
          lon: top.lon,
          state: top.state || 'India'
        });
        setCustomLocationName(top.displayName);
      } else {
        setSelectedQuickLoc(null);
        setCustomLocationName(searchQuery.trim());
      }
    } catch {
      setSelectedQuickLoc(null);
      setCustomLocationName(searchQuery.trim());
    }
    setIsSearching(false);
  };

  const handleDispatchPush = async (alt) => {
    setPushStatus(prev => ({ ...prev, [alt.id]: 'sending' }));
    try {
      await NotificationManager.sendTestPush({
        title: `🚨 ${alt.type}`,
        body: alt.advisory,
        severity: alt.severity?.toLowerCase() === 'warning' ? 'critical' : 'warning',
        category: 'weather'
      });
      setPushStatus(prev => ({ ...prev, [alt.id]: 'sent' }));
      setTimeout(() => {
        setPushStatus(prev => ({ ...prev, [alt.id]: null }));
      }, 3500);
    } catch {
      setPushStatus(prev => ({ ...prev, [alt.id]: 'error' }));
    }
  };

  const activeLocationDisplayName = useLiveGPS 
    ? (locationState?.geoInfo?.displayName || locationState?.geoInfo?.town || 'Live GPS Coordinates')
    : (selectedQuickLoc?.name || customLocationName || selectedFarm?.location || 'Ludhiana, Punjab');

  return (
    <div className="space-y-8 animate-fadeIn font-sans pb-12">
      
      {/* Header & Source Selection Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#5D7052] text-xs font-bold uppercase tracking-wider mb-1.5">
            <CloudSun className="w-4 h-4" />
            <span>Hyper-Local Micro-Climate & Agro-Weather Radar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2C2C24] font-serif">
            {t('nav_weather')}
          </h1>
          <p className="text-xs sm:text-sm text-[#78786C] mt-1.5 font-medium">
            Live hourly precipitation radar, soil thermal metrics, spraying windows, and agro-hazard warnings for <strong className="text-[#2C2C24]">{activeLocationDisplayName}</strong>
          </p>
        </div>

        {/* Action Controls & Location Pills */}
        <div className="flex flex-wrap items-center gap-2 self-start bg-[#FEFEFA] p-1.5 rounded-full border border-[#DED8CF] shadow-soft">
          {/* Live GPS Button */}
          <button
            onClick={handleSelectLiveGPS}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              useLiveGPS 
                ? 'bg-[#5D7052] text-[#F3F4F1] shadow-soft scale-102' 
                : 'text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5]'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${isTracking ? 'animate-spin-slow' : ''}`} />
            <span>Live GPS ({locationState?.geoInfo?.town || locationState?.geoInfo?.district || (locationState?.coords ? `${locationState.coords.latitude.toFixed(2)}°N, ${locationState.coords.longitude.toFixed(2)}°E` : 'My Live GPS')})</span>
            <span className={`w-2 h-2 rounded-full ${useLiveGPS ? 'bg-[#A8E6CF] animate-ping' : 'bg-[#C18C5D]'}`} />
          </button>

          {/* Quick Major Farm Pills */}
          {QUICK_LOCATIONS.slice(1, 3).map((loc, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectQuickLocation(loc)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                !useLiveGPS && selectedQuickLoc?.name === loc.name
                  ? 'bg-[#2C2C24] text-white shadow-soft'
                  : 'text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px]">{loc.name.split(',')[0]}</span>
            </button>
          ))}

          {/* Refresh Button */}
          <button
            onClick={() => fetchWeather(true)}
            disabled={refreshing}
            className="p-2 rounded-full text-[#78786C] hover:text-[#5D7052] hover:bg-[#F0EBE5] transition cursor-pointer"
            title="Refresh Live Meteorology Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#5D7052]' : ''}`} />
          </button>

          {/* GPS Radar Modal Trigger */}
          <button
            onClick={() => setIsTrackerOpen(true)}
            className="p-2 rounded-full text-[#78786C] hover:text-[#5D7052] hover:bg-[#F0EBE5] transition cursor-pointer"
            title="Open Detailed GPS Telemetry Radar"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Location Quick Switcher Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#78786C] mr-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" /> Regional Presets:
        </span>
        {QUICK_LOCATIONS.map((loc, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectQuickLocation(loc)}
            className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
              !useLiveGPS && selectedQuickLoc?.name === loc.name
                ? 'bg-[#5D7052]/15 border-[#5D7052] text-[#5D7052] font-bold'
                : 'bg-[#FEFEFA] border-[#DED8CF] text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5]'
            }`}
          >
            {loc.name}
          </button>
        ))}

        {/* Custom Location Search Form */}
        {isSearching ? (
          <form onSubmit={handleCustomSearch} className="flex items-center gap-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter village, district, or coordinates..."
              className="px-3 py-1 text-xs rounded-xl border border-[#5D7052] bg-[#FEFEFA] text-[#2C2C24] focus:outline-none w-56"
              autoFocus
            />
            <button
              type="submit"
              className="px-2.5 py-1 text-xs font-bold bg-[#5D7052] text-white rounded-xl hover:bg-[#4A5A41] transition"
            >
              Go
            </button>
            <button
              type="button"
              onClick={() => setIsSearching(false)}
              className="px-2 py-1 text-xs text-[#78786C] hover:text-[#2C2C24]"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsSearching(true)}
            className="text-xs px-3 py-1.5 rounded-xl border border-dashed border-[#DED8CF] text-[#78786C] hover:text-[#5D7052] hover:border-[#5D7052] bg-transparent flex items-center gap-1 transition"
          >
            <Search className="w-3 h-3" /> Search Other District
          </button>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && !weatherData && (
        <div className="space-y-6 animate-pulse">
          <div className="h-20 rounded-[2rem] bg-[#F0EBE5]/60 border border-[#DED8CF]" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 rounded-[2rem] bg-[#F0EBE5]/60 border border-[#DED8CF]" />
            ))}
          </div>
          <div className="h-56 rounded-[2.25rem] bg-[#F0EBE5]/60 border border-[#DED8CF]" />
        </div>
      )}

      {/* Live GPS Telemetry & Doppler Station Banner */}
      {weatherData && weatherData.gps && (
        <div className="p-5 rounded-[2rem] bg-gradient-to-r from-[#FEFEFA] via-[#F0EBE5]/80 to-[#FEFEFA] border border-[#DED8CF] shadow-soft flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-[#5D7052]/10 text-[#5D7052]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[#2C2C24] font-serif text-sm">
                  {weatherData.gps.latitude}° N, {weatherData.gps.longitude}° E
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20">
                  {weatherData.gps.region_classification}
                </span>
                {weatherData.source && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-[#2C2C24]/5 text-[#78786C]">
                    🛰️ {weatherData.source}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#78786C] mt-1">
                Station: <strong className="text-[#2C2C24]">{weatherData.gps.radar_station}</strong> • {weatherData.gps.distance_to_station_km} km Doppler range
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-[#78786C] font-semibold">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#78786C] block">Evapotranspiration (ET₀)</span>
              <span className="font-serif font-bold text-sm text-[#5D7052]">{weatherData.current?.evapotranspiration_mm_day} mm/day</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#78786C] block">Solar Radiation</span>
              <span className="font-serif font-bold text-sm text-[#C18C5D]">{weatherData.current?.solar_radiation_w_m2} W/m²</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#78786C] block">Surface Pressure</span>
              <span className="font-serif font-bold text-sm text-[#2C2C24]">{weatherData.current?.barometric_pressure_hpa} hPa</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#78786C] block">Overpass</span>
              <span className="font-serif font-bold text-xs text-[#2C2C24]">{weatherData.gps.next_sentinel_overpass}</span>
            </div>
          </div>
        </div>
      )}

      {/* Primary Microclimate Telemetry Grid */}
      {weatherData && weatherData.current && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Temperature Card */}
          <div className="p-5 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#78786C] text-xs font-bold">
              <span>Air Temp</span>
              <ThermometerSun className="w-4 h-4 text-[#C18C5D]" />
            </div>
            <div className="my-2">
              <div className="text-3xl font-bold font-serif text-[#2C2C24]">
                {weatherData.current.temperature_c}°C
              </div>
              <span className="text-[11px] text-[#5D7052] font-semibold block">{weatherData.current.condition}</span>
            </div>
            <span className="text-[10px] text-[#78786C] font-medium border-t border-[#DED8CF]/60 pt-1.5">
              Dew Point: {weatherData.current.dew_point_c}°C
            </span>
          </div>

          {/* Humidity Card */}
          <div className="p-5 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#78786C] text-xs font-bold">
              <span>Relative Humidity</span>
              <Droplets className="w-4 h-4 text-[#5D7052]" />
            </div>
            <div className="my-2">
              <div className="text-3xl font-bold font-serif text-[#5D7052]">
                {weatherData.current.humidity_pct}%
              </div>
              <span className="text-[11px] text-[#78786C] font-semibold block">Vapor Demand: Normal</span>
            </div>
            <span className="text-[10px] text-[#78786C] font-medium border-t border-[#DED8CF]/60 pt-1.5">
              Cloud Cover: {weatherData.current.cloud_cover_pct}%
            </span>
          </div>

          {/* Root-Zone Soil Temp Card */}
          <div className="p-5 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#78786C] text-xs font-bold">
              <span>Soil Temp (0-7cm)</span>
              <ThermometerSun className="w-4 h-4 text-[#C18C5D]" />
            </div>
            <div className="my-2">
              <div className="text-3xl font-bold font-serif text-[#C18C5D]">
                {weatherData.current.soil_temperature_c}°C
              </div>
              <span className="text-[11px] text-[#C18C5D] font-semibold block">Active Biological Zone</span>
            </div>
            <span className="text-[10px] text-[#78786C] font-medium border-t border-[#DED8CF]/60 pt-1.5">
              Moisture: {weatherData.current.soil_moisture_pct}%
            </span>
          </div>

          {/* Wind Speed & Vector */}
          <div className="p-5 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#78786C] text-xs font-bold">
              <span>Wind Velocity</span>
              <Wind className="w-4 h-4 text-[#78786C]" />
            </div>
            <div className="my-2">
              <div className="text-3xl font-bold font-serif text-[#2C2C24]">
                {weatherData.current.wind_speed_kmh} <span className="text-sm font-normal">km/h</span>
              </div>
              <span className="text-[11px] text-[#78786C] font-semibold block">{weatherData.current.wind_direction}</span>
            </div>
            <span className={`text-[10px] font-bold border-t border-[#DED8CF]/60 pt-1.5 ${
              weatherData.current.wind_speed_kmh < 15 ? 'text-[#5D7052]' : 'text-[#A85448]'
            }`}>
              {weatherData.current.wind_speed_kmh < 15 ? '✔ Low Drift Risk' : '⚠️ High Drift Risk'}
            </span>
          </div>

          {/* UV Solar Index */}
          <div className="p-5 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#78786C] text-xs font-bold">
              <span>UV Radiation</span>
              <Sun className="w-4 h-4 text-[#C18C5D]" />
            </div>
            <div className="my-2">
              <div className="text-3xl font-bold font-serif text-[#C18C5D]">
                {weatherData.current.uv_index}
              </div>
              <span className="text-[11px] text-[#78786C] font-semibold block">Index Category: Moderate</span>
            </div>
            <span className="text-[10px] text-[#78786C] font-medium border-t border-[#DED8CF]/60 pt-1.5">
              PAR: High Photosynthesis
            </span>
          </div>

          {/* Reference ET0 Card */}
          <div className="p-5 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#78786C] text-xs font-bold">
              <span>Crop ET₀ Demand</span>
              <Gauge className="w-4 h-4 text-[#5D7052]" />
            </div>
            <div className="my-2">
              <div className="text-3xl font-bold font-serif text-[#5D7052]">
                {weatherData.current.evapotranspiration_mm_day} <span className="text-sm font-normal">mm/d</span>
              </div>
              <span className="text-[11px] text-[#5D7052] font-semibold block">FAO-56 Standard</span>
            </div>
            <span className="text-[10px] text-[#78786C] font-medium border-t border-[#DED8CF]/60 pt-1.5">
              Light Irrigation Advised
            </span>
          </div>

        </div>
      )}

      {/* Spray Window Banner */}
      <div className="p-6 rounded-[2rem] bg-gradient-to-r from-[#5D7052]/10 via-[#FEFEFA] to-[#5D7052]/5 border border-[#5D7052]/20 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-[#5D7052] text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-[#2C2C24] font-serif text-sm">
              Today's Recommended Spraying Window: <span className="text-[#5D7052]">06:00 AM – 09:30 AM</span>
            </h4>
            <p className="text-xs text-[#78786C] mt-0.5">
              Wind speed is forecast under 11 km/h with 0% rain probability. Ideal for foliar micro-nutrients & pesticide coverage.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#5D7052]/15 text-[#5D7052] border border-[#5D7052]/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Drift Index: Safe
          </span>
        </div>
      </div>

      {/* 24-Hour Precipitation Probability & Spraying Feasibility Radar */}
      {weatherData && weatherData.hourly_radar && (
        <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#2C2C24] font-serif flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#5D7052]" />
                <span>24-Hour Live Precipitation Radar & Spraying Feasibility Timeline</span>
              </h3>
              <p className="text-xs text-[#78786C] mt-0.5 font-medium">
                Hourly micro-climatic rain probability (%) and agricultural spraying window suitability
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20 self-start sm:self-auto">
              ⚡ Live Radar Stream
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
            {weatherData.hourly_radar.map((h, i) => (
              <div 
                key={i} 
                className={`p-3.5 rounded-2xl border text-center text-xs transition-all ${
                  h.spraying_feasible 
                    ? 'bg-[#F0EBE5]/50 border-[#DED8CF] hover:border-[#5D7052]' 
                    : 'bg-[#A85448]/10 border-[#A85448]/30'
                }`}
              >
                <span className="font-bold text-[#2C2C24] block font-serif text-xs">{h.time}</span>
                <div className="font-bold text-base my-1.5 text-[#2C2C24]">
                  {h.temperature_c}°C
                </div>
                <div className="text-[11px] font-bold text-[#5D7052] mb-1 flex items-center justify-center gap-1">
                  <CloudRain className="w-3 h-3 text-[#5D7052]" /> {h.rain_prob_pct}%
                </div>
                <div className="text-[10px] text-[#78786C] mb-2">
                  💨 {h.wind_speed_kmh} km/h
                </div>
                <span className={`text-[9px] font-bold block px-2 py-0.5 rounded-full ${
                  h.spraying_feasible 
                    ? 'bg-[#5D7052]/15 text-[#5D7052]' 
                    : 'bg-[#A85448]/20 text-[#A85448]'
                }`}>
                  {h.spraying_feasible ? '✔ Spray OK' : '❌ Avoid'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7-Day Agricultural Weather Forecast */}
      {weatherData && weatherData.forecast_7_days && (
        <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#2C2C24] font-serif flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-[#5D7052]" />
                <span>7-Day Agricultural Weather Outlook & Field Planning</span>
              </h3>
              <p className="text-xs text-[#78786C] mt-0.5 font-medium">
                Long-range temperatures, precipitation probability, and daily spraying suitability
              </p>
            </div>
            <span className="text-xs text-[#78786C] font-semibold">
              Location: {activeLocationDisplayName.split(',')[0]}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5 text-center text-xs">
            {weatherData.forecast_7_days.map((f, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border transition-all ${
                  f.rain_prob_pct > 50
                    ? 'bg-[#A85448]/10 border-[#A85448]/30'
                    : 'bg-[#F0EBE5]/50 border-[#DED8CF]'
                }`}
              >
                <span className="font-bold text-[#2C2C24] block mb-1 font-serif text-sm">{f.day}</span>
                <div className="text-base font-bold text-[#2C2C24] font-serif my-1">
                  {f.temp_max}° / <span className="text-[#78786C] text-xs">{f.temp_min}°C</span>
                </div>
                <span className="text-[11px] text-[#78786C] block font-medium my-1">{f.condition}</span>
                <div className="mt-3 pt-2.5 border-t border-[#DED8CF]/60">
                  <span className="text-[11px] text-[#5D7052] font-bold block mb-1.5 flex items-center justify-center gap-1">
                    <CloudRain className="w-3 h-3 text-[#5D7052]" /> {f.rain_prob_pct}% Rain
                  </span>
                  <span className={`text-[9px] font-bold block px-2 py-0.5 rounded-full ${
                    f.spraying_window.includes('Avoid') 
                      ? 'bg-[#A85448]/15 text-[#A85448]' 
                      : 'bg-[#5D7052]/15 text-[#5D7052]'
                  }`}>
                    {f.spraying_window.includes('Avoid') ? '❌ No Spray' : '✔ Spray OK'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Agro-Climatic Hazards & Advisories */}
      {alertsData && alertsData.active_alerts && (
        <div className="p-7 rounded-[2.25rem] bg-gradient-to-br from-[#FEFEFA] to-[#C18C5D]/10 border border-[#C18C5D]/30 shadow-soft space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#2C2C24] font-serif flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#C18C5D]" />
                <span>Active Regional Agro-Weather Advisories & Alerts</span>
              </h3>
              <p className="text-xs text-[#78786C] mt-0.5 font-medium">
                Real-time advisories dispatched to farmer mobile apps and field push devices
              </p>
            </div>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openNotificationCenter'))}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-[#C18C5D]/15 hover:bg-[#C18C5D]/25 text-[#C18C5D] border border-[#C18C5D]/30 transition self-start sm:self-auto cursor-pointer shadow-xs"
              title="Open FCM Notification & Alert Center"
            >
              <Radio className="w-3 h-3 text-[#C18C5D] animate-pulse" />
              <span>FCM HTTP v1 Alert Hub</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {alertsData.active_alerts.map((alt) => {
              const status = pushStatus[alt.id];
              return (
                <div key={alt.id} className="p-5 rounded-2xl bg-[#FEFEFA] border border-[#DED8CF] shadow-sm text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#2C2C24] text-sm font-serif">{alt.type}</span>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#C18C5D]/15 text-[#C18C5D] border border-[#C18C5D]/30">
                        {alt.severity}
                      </span>
                      <button
                        onClick={() => handleDispatchPush(alt)}
                        disabled={status === 'sending' || status === 'sent'}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full border text-[10px] font-bold transition cursor-pointer ${
                          status === 'sent' 
                            ? 'bg-[#5D7052] text-white border-[#5D7052]'
                            : status === 'sending'
                              ? 'bg-[#F0EBE5] text-[#78786C] border-[#DED8CF]'
                              : 'bg-[#5D7052]/10 hover:bg-[#5D7052] text-[#5D7052] hover:text-[#F3F4F1] border-[#5D7052]/30'
                        }`}
                        title="Dispatch real-time FCM push notification to connected farmer devices"
                      >
                        {status === 'sent' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-white" />
                            <span>Pushed</span>
                          </>
                        ) : status === 'sending' ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3" />
                            <span>Push Alert</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-[#2C2C24] leading-relaxed font-sans">{alt.advisory}</p>
                  <div className="mt-3 pt-2 border-t border-[#DED8CF]/60 text-[11px] text-[#78786C] flex items-center justify-between font-medium">
                    <span>Impacted Zones: {Array.isArray(alt.impacted_regions) ? alt.impacted_regions.join(', ') : alt.impacted_regions}</span>
                    <span className="font-mono text-[#5D7052] font-bold">Window: {alt.valid_until}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
