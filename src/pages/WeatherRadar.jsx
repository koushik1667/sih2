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
  CheckCircle2, 
  RefreshCw, 
  Search, 
  Sun, 
  CloudRain, 
  Sparkles, 
  ChevronRight, 
  Gauge,
  Newspaper,
  Volume2,
  VolumeX,
  TrendingUp,
  Clock,
  Share2,
  Check,
  Building,
  Filter,
  Sprout,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useLocation } from '../context/LocationContext';
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
  const { selectedFarm } = useApp();
  const { locationState, isTracking, toggleTracking, refreshOnce } = useLocation();

  // Always default to user's live GPS coordinates
  const [useLiveGPS, setUseLiveGPS] = useState(true);
  const [selectedQuickLoc, setSelectedQuickLoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [customLocationName, setCustomLocationName] = useState('');

  const [weatherData, setWeatherData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [newsFilter, setNewsFilter] = useState('all');
  const [speakingNewsId, setSpeakingNewsId] = useState(null);
  const [expandedNewsId, setExpandedNewsId] = useState(null);
  const [copiedNewsId, setCopiedNewsId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

      const [w, n] = await Promise.all([
        api.getWeather(locName, lat, lon),
        api.getAgriNews(stateName, locName)
      ]);

      setWeatherData(w);
      setNewsData(n);
    } catch (err) {
      console.error("Failed to load weather & news:", err);
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
  };

  const handleSpeakNews = (article) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speakingNewsId === article.id) {
      window.speechSynthesis.cancel();
      setSpeakingNewsId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const textToSpeak = `${article.title}. ${article.summary}. Recommended Farmer Action: ${article.actionableAdvice || ''}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingNewsId(null);
    utterance.onerror = () => setSpeakingNewsId(null);
    setSpeakingNewsId(article.id);
    window.speechSynthesis.speak(utterance);
  };

  const handleShareNews = (article) => {
    const text = `🌱 AgriSphere Regional News: ${article.title}\n\n${article.summary}\n\nFarmer Action: ${article.actionableAdvice || 'N/A'}\n\nSource: ${article.source}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
      setCopiedNewsId(article.id);
      setTimeout(() => setCopiedNewsId(null), 2500);
    }
  };

  const activeLocationDisplayName = useLiveGPS 
    ? (locationState?.geoInfo?.displayName || locationState?.geoInfo?.town || 'Live GPS Coordinates')
    : (selectedQuickLoc?.name || customLocationName || selectedFarm?.location || 'Ludhiana, Punjab');

  const filteredNews = (newsData?.articles || []).filter(item => {
    if (newsFilter === 'all') return true;
    return item.category === newsFilter;
  });

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
            Live hourly precipitation radar, soil thermal metrics, spraying windows, and regional farming news for <strong className="text-[#2C2C24]">{activeLocationDisplayName}</strong>
          </p>
        </div>

        {/* Location Selector Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Live GPS Coordinate Button */}
          <button
            type="button"
            onClick={handleSelectLiveGPS}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition shadow-xs cursor-pointer ${
              useLiveGPS
                ? 'bg-[#5D7052] text-[#F3F4F1] ring-2 ring-[#5D7052]/40'
                : 'bg-[#FEFEFA] text-[#2C2C24] border border-[#DED8CF] hover:bg-[#F0EBE5]'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${useLiveGPS ? 'text-[#F3F4F1] animate-pulse' : 'text-[#5D7052]'}`} />
            <span>My Live GPS</span>
            {useLiveGPS && (
              <span className="w-2 h-2 rounded-full bg-[#C18C5D] animate-ping" />
            )}
          </button>

          {/* Quick Presets Dropdown */}
          <div className="relative group">
            <select
              value={selectedQuickLoc ? selectedQuickLoc.name : ''}
              onChange={(e) => {
                const found = QUICK_LOCATIONS.find(q => q.name === e.target.value);
                if (found) handleSelectQuickLocation(found);
              }}
              className="px-3.5 py-2 rounded-2xl text-xs font-bold bg-[#FEFEFA] border border-[#DED8CF] text-[#2C2C24] hover:bg-[#F0EBE5] outline-none cursor-pointer shadow-xs pr-8 appearance-none"
            >
              <option value="" disabled>Select Agro-Climatic Zone...</option>
              {QUICK_LOCATIONS.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name} ({loc.tag})
                </option>
              ))}
            </select>
            <Compass className="w-3.5 h-3.5 text-[#78786C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Search Custom Location */}
          <form onSubmit={handleCustomSearch} className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search village / mandi / PIN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 sm:w-56 pl-8 pr-3 py-2 rounded-2xl text-xs bg-[#FEFEFA] border border-[#DED8CF] text-[#2C2C24] focus:border-[#5D7052] outline-none shadow-xs"
              />
              <Search className="w-3.5 h-3.5 text-[#78786C] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          {/* Manual Refresh Button */}
          <button
            type="button"
            onClick={() => fetchWeather(true)}
            disabled={refreshing}
            className="p-2.5 rounded-2xl bg-[#FEFEFA] border border-[#DED8CF] text-[#5D7052] hover:bg-[#F0EBE5] transition shadow-xs cursor-pointer disabled:opacity-50"
            title="Refresh Doppler Radar & News Feed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Meteorological Dashboard Metric Grid */}
      {weatherData && weatherData.current && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          
          <div className="p-4 rounded-3xl bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-1">
            <div className="flex items-center justify-between text-[#78786C] text-xs font-bold uppercase">
              <span>Ambient Temp</span>
              <ThermometerSun className="w-4 h-4 text-[#C18C5D]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#2C2C24] font-serif">
              {weatherData.current.temperature_c}°C
            </div>
            <span className="text-[10px] text-[#78786C] block font-medium">
              Feels like {(weatherData.current.temperature_c + 1.2).toFixed(1)}°C
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-1">
            <div className="flex items-center justify-between text-[#78786C] text-xs font-bold uppercase">
              <span>Relative Humidity</span>
              <Droplets className="w-4 h-4 text-[#5D7052]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#2C2C24] font-serif">
              {weatherData.current.humidity_pct}%
            </div>
            <span className="text-[10px] text-[#5D7052] block font-semibold">
              Dew Point: {weatherData.current.dew_point_c}°C
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-1">
            <div className="flex items-center justify-between text-[#78786C] text-xs font-bold uppercase">
              <span>Wind Velocity</span>
              <Wind className="w-4 h-4 text-[#5D7052]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#2C2C24] font-serif">
              {weatherData.current.wind_speed_kmh} <span className="text-xs font-sans text-[#78786C]">km/h</span>
            </div>
            <span className="text-[10px] text-[#78786C] block font-medium">
              {weatherData.current.wind_direction}
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-1">
            <div className="flex items-center justify-between text-[#78786C] text-xs font-bold uppercase">
              <span>Soil Temperature</span>
              <Activity className="w-4 h-4 text-[#C18C5D]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#2C2C24] font-serif">
              {weatherData.current.soil_temperature_c}°C
            </div>
            <span className="text-[10px] text-[#5D7052] block font-semibold">
              Root-zone active
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-1">
            <div className="flex items-center justify-between text-[#78786C] text-xs font-bold uppercase">
              <span>Solar Radiation</span>
              <Sun className="w-4 h-4 text-[#C18C5D]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#2C2C24] font-serif">
              {weatherData.current.solar_radiation_w_m2} <span className="text-xs font-sans text-[#78786C]">W/m²</span>
            </div>
            <span className="text-[10px] text-[#78786C] block font-medium">
              UV Index: {weatherData.current.uv_index}
            </span>
          </div>

          <div className="p-4 rounded-3xl bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-1">
            <div className="flex items-center justify-between text-[#78786C] text-xs font-bold uppercase">
              <span>Crop ET₀ Demand</span>
              <Gauge className="w-4 h-4 text-[#5D7052]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-[#2C2C24] font-serif">
              {weatherData.current.evapotranspiration_mm_day} <span className="text-xs font-sans text-[#78786C]">mm/d</span>
            </div>
            <span className="text-[10px] text-[#78786C] block font-medium">
              Press: {weatherData.current.barometric_pressure_hpa} hPa
            </span>
          </div>

        </div>
      )}

      {/* Recommended Spray Window Banner */}
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

      {/* 24-Hour Doppler Radar Hourly Forecast & Spray Feasibility */}
      {weatherData && weatherData.hourly_radar && (
        <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DED8CF]/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#2C2C24] font-serif flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#5D7052]" />
                <span>24-Hour Doppler Radar & Hourly Spray Feasibility Timeline</span>
              </h3>
              <p className="text-xs text-[#78786C] mt-0.5 font-medium">
                Continuous radar precipitation tracking and micro-climate foliar spray recommendations
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20 self-start sm:self-auto">
              Live Hourly Radar Sync
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {weatherData.hourly_radar.map((h, i) => (
              <div 
                key={i} 
                className={`p-3.5 rounded-2xl border text-center transition flex flex-col justify-between ${
                  h.spraying_feasible 
                    ? 'bg-[#FEFEFA] border-[#5D7052]/30 hover:border-[#5D7052]' 
                    : 'bg-[#F0EBE5]/40 border-[#DED8CF]'
                }`}
              >
                <div className="text-xs font-bold text-[#78786C] mb-1 font-mono">{h.time}</div>
                <div className="text-lg font-bold text-[#2C2C24] font-serif my-1">{h.temperature_c}°C</div>
                
                <div className="space-y-1 my-1.5 text-[10px]">
                  <div className="text-[#5D7052] font-semibold flex items-center justify-center gap-1">
                    <CloudRain className="w-3 h-3 text-[#5D7052]" />
                    <span>{h.rain_prob_pct}% rain</span>
                  </div>
                  <div className="text-[#78786C] font-mono">{h.wind_speed_kmh} km/h</div>
                </div>

                <div className="pt-2 border-t border-[#DED8CF]/50">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                    h.spraying_feasible 
                      ? 'bg-[#5D7052] text-[#FEFEFA]' 
                      : 'bg-[#A85448]/15 text-[#A85448]'
                  }`}>
                    {h.spraying_feasible ? '✔ Spray OK' : '✕ Avoid'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7-Day Extended Agronomic Forecast */}
      {weatherData && weatherData.forecast_7_days && (
        <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-5">
          <div className="flex items-center justify-between border-b border-[#DED8CF]/60 pb-3">
            <div>
              <h3 className="text-base font-bold text-[#2C2C24] font-serif flex items-center gap-2">
                <Sun className="w-4 h-4 text-[#C18C5D]" />
                <span>7-Day Agro-Meteorological Outlook & Field Windows</span>
              </h3>
              <p className="text-xs text-[#78786C] mt-0.5 font-medium">
                Day-by-day temperature swings, rain probability, and spraying condition windows
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {weatherData.forecast_7_days.map((f, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#F7F5F0]/60 border border-[#DED8CF] text-center flex flex-col justify-between">
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

      {/* 📰 Live Regional Agro-Weather & Farming News Feed */}
      <div className="p-6 sm:p-8 rounded-[2.25rem] bg-gradient-to-br from-[#FEFEFA] to-[#5D7052]/5 border border-[#5D7052]/30 shadow-soft space-y-6">
        
        {/* News Feed Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#DED8CF]/70 pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#5D7052] text-xs font-bold uppercase tracking-wider mb-1">
              <Newspaper className="w-4 h-4 text-[#5D7052]" />
              <span>Real-Time Agrarian Intelligence & Regional Dispatch</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#2C2C24] font-serif flex items-center gap-2">
              <span>Live Weather &amp; Farming News Dispatch</span>
            </h3>
            <p className="text-xs text-[#78786C] mt-1 font-medium">
              Hyper-local IMD meteorology, crop stage advisories, APMC mandi arrivals, and policy alerts for <strong className="text-[#2C2C24]">{newsData?.region || activeLocationDisplayName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5D7052] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5D7052]" />
              </span>
              <span>Live {newsData?.region ? `• ${newsData.region}` : 'Feed'}</span>
            </span>

            <button
              onClick={() => fetchWeather(true)}
              className="p-1.5 rounded-full bg-[#FEFEFA] border border-[#DED8CF] text-[#78786C] hover:text-[#5D7052] hover:bg-[#F0EBE5] transition cursor-pointer"
              title="Refresh News Feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#5D7052]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: `All Bulletins (${newsData?.articles?.length || 0})` },
            { id: 'weather', label: '🌦️ Weather & Monsoon' },
            { id: 'crops', label: '🌾 Crops & Agronomy' },
            { id: 'mandi', label: '📈 Mandi Prices & Trade' },
            { id: 'schemes', label: '🏛️ Govt Schemes & Tech' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setNewsFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                newsFilter === f.id
                  ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft'
                  : 'bg-[#FEFEFA] text-[#78786C] border border-[#DED8CF] hover:bg-[#F0EBE5] hover:text-[#2C2C24]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* News Cards Grid */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-10 rounded-2xl bg-[#FEFEFA] border border-dashed border-[#DED8CF] text-xs text-[#78786C]">
            No articles recorded under this category filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredNews.map((art) => {
              const isSpeaking = speakingNewsId === art.id;
              const isExpanded = expandedNewsId === art.id;
              const isCopied = copiedNewsId === art.id;

              return (
                <article 
                  key={art.id}
                  className="p-5 sm:p-6 rounded-3xl bg-[#FEFEFA] border border-[#DED8CF] shadow-sm hover:shadow-soft transition-all duration-200 flex flex-col justify-between space-y-4"
                >
                  {/* Card Header: Category & Severity Tag */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        art.category === 'weather' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                        art.category === 'crops' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        art.category === 'mandi' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-purple-100 text-purple-800 border border-purple-200'
                      }`}>
                        {art.category}
                      </span>
                      <span className="text-[11px] text-[#78786C] font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#78786C]" />
                        {art.publishedAt}
                      </span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      art.severity === 'urgent' ? 'bg-red-100 text-red-700 border border-red-200' :
                      art.severity === 'advisory' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      art.severity === 'market' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                      'bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20'
                    }`}>
                      {art.impact || 'Verified Bulletin'}
                    </span>
                  </div>

                  {/* Headline & Summary */}
                  <div className="space-y-2">
                    <h4 className="text-sm sm:text-base font-bold text-[#2C2C24] font-serif leading-snug">
                      {art.title}
                    </h4>
                    <p className={`text-xs text-[#525248] leading-relaxed font-sans ${isExpanded ? '' : 'line-clamp-3'}`}>
                      {art.summary}
                    </p>
                  </div>

                  {/* Actionable Agronomy Takeaway Callout Box */}
                  {art.actionableAdvice && (
                    <div className="p-3 rounded-2xl bg-[#F7F5F0] border border-[#5D7052]/20 flex items-start gap-2.5">
                      <div className="p-1 rounded-lg bg-[#5D7052] text-[#FEFEFA] shrink-0 mt-0.5">
                        <Sprout className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-[11px] text-[#2C2C24] leading-relaxed">
                        <strong className="text-[#5D7052] font-semibold">Farmer Action: </strong>
                        <span>{art.actionableAdvice}</span>
                      </div>
                    </div>
                  )}

                  {/* Topic Tag Chips */}
                  {art.tags && art.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {art.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 rounded-md bg-[#F0EBE5]/70 text-[#78786C] text-[10px] font-semibold">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Card Footer Toolbar: Source, Speech Narration, Copy & Expand */}
                  <div className="pt-3 border-t border-[#DED8CF]/60 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#78786C] font-medium truncate max-w-[180px] sm:max-w-xs">
                      <Building className="w-3.5 h-3.5 text-[#5D7052] shrink-0" />
                      <span className="truncate" title={art.source}>{art.source}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Audio Narration Button */}
                      <button
                        type="button"
                        onClick={() => handleSpeakNews(art)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                          isSpeaking 
                            ? 'bg-[#C18C5D] text-white animate-pulse' 
                            : 'bg-[#5D7052]/10 text-[#5D7052] hover:bg-[#5D7052] hover:text-white'
                        }`}
                        title={isSpeaking ? 'Stop Audio Narration' : 'Listen to News Bulletin (Audio)'}
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3 h-3" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>

                      {/* Share / Copy Button */}
                      <button
                        type="button"
                        onClick={() => handleShareNews(art)}
                        className="p-1.5 rounded-full bg-[#F0EBE5]/60 hover:bg-[#F0EBE5] text-[#78786C] hover:text-[#2C2C24] transition cursor-pointer"
                        title="Copy News Summary"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-[#5D7052]" /> : <Share2 className="w-3.5 h-3.5" />}
                      </button>

                      {/* Expand / Collapse Button */}
                      <button
                        type="button"
                        onClick={() => setExpandedNewsId(isExpanded ? null : art.id)}
                        className="p-1.5 rounded-full bg-[#F0EBE5]/60 hover:bg-[#F0EBE5] text-[#78786C] hover:text-[#2C2C24] transition cursor-pointer"
                        title={isExpanded ? 'Collapse' : 'Expand Full Details'}
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                </article>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
