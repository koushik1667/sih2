import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Sun, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle,
  MapPin,
  ThermometerSun,
  Radio,
  Compass,
  Navigation,
  Sparkles,
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useLocation } from '../context/LocationContext';

export const WeatherRadar = () => {
  const { t } = useLanguage();
  const { selectedFarm, farms } = useApp();
  const { locationState, isTracking, toggleTracking, setIsTrackerOpen } = useLocation();

  const [useLiveGPS, setUseLiveGPS] = useState(false);
  const [location, setLocation] = useState(selectedFarm?.location || 'Ludhiana, Punjab');
  const [weatherData, setWeatherData] = useState(null);
  const [alertsData, setAlertsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-sync with live GPS coordinates if enabled
  useEffect(() => {
    async function loadWeather() {
      setLoading(true);
      try {
        let lat = null;
        let lon = null;
        let locName = location;

        if (useLiveGPS && locationState?.coords) {
          lat = locationState.coords.latitude;
          lon = locationState.coords.longitude;
          locName = locationState.geoInfo?.displayName || `${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`;
        }

        const [w, a] = await Promise.all([
          api.getWeather(locName, lat, lon),
          api.getWeatherAlerts(locationState?.geoInfo?.state || 'Punjab')
        ]);
        setWeatherData(w);
        setAlertsData(a);
      } catch (err) {
        console.error("Failed to load weather:", err);
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, [location, useLiveGPS, locationState?.coords?.latitude, locationState?.coords?.longitude]);

  const handleSelectLiveGPS = () => {
    setUseLiveGPS(true);
    if (!isTracking) {
      toggleTracking();
    }
  };

  const handleSelectFarm = (farm) => {
    setUseLiveGPS(false);
    setLocation(farm.location);
  };

  return (
    <div className="space-y-8 animate-fadeIn font-sans">
      
      {/* Header & Source Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#5D7052] text-xs font-bold uppercase tracking-wider mb-1.5">
            <CloudSun className="w-4 h-4" />
            <span>Hyper-Local Micro-Climate & Agro-Weather Radar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2C2C24] font-serif">
            {t('nav_weather')}
          </h1>
          <p className="text-xs sm:text-sm text-[#78786C] mt-1.5 font-medium">
            Precision hourly precipitation radar, spraying windows, and agro-hazard warnings for {useLiveGPS ? (locationState?.geoInfo?.town || 'Live GPS') : location}
          </p>
        </div>

        {/* Location Source Pills */}
        <div className="flex flex-wrap items-center gap-2 self-start bg-[#FEFEFA] p-1.5 rounded-full border border-[#DED8CF] shadow-soft">
          <button
            onClick={handleSelectLiveGPS}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              useLiveGPS 
                ? 'bg-[#5D7052] text-[#F3F4F1] shadow-soft scale-102' 
                : 'text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5]'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${isTracking ? 'animate-spin-slow' : ''}`} />
            <span>Live Field GPS ({locationState?.geoInfo?.town || 'Locate'})</span>
            <span className={`w-2 h-2 rounded-full ${useLiveGPS && isTracking ? 'bg-[#F3F4F1] animate-ping' : 'bg-[#C18C5D]'}`} />
          </button>

          {farms.slice(0, 2).map((f) => (
            <button
              key={f.id}
              onClick={() => handleSelectFarm(f)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                !useLiveGPS && location === f.location
                  ? 'bg-[#2C2C24] text-white shadow-soft'
                  : 'text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate max-w-[120px]">{f.name}</span>
            </button>
          ))}

          <button
            onClick={() => setIsTrackerOpen(true)}
            className="p-2 rounded-full text-[#78786C] hover:text-[#5D7052] hover:bg-[#F0EBE5] transition"
            title="Open Detailed GPS Telemetry Radar"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live GPS Telemetry Bar */}
      {weatherData && weatherData.gps && (
        <div className="p-5 rounded-[2rem] bg-gradient-to-r from-[#FEFEFA] to-[#F0EBE5]/70 border border-[#DED8CF] shadow-soft flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#5D7052]/10 text-[#5D7052]">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#2C2C24] font-serif">
                  {weatherData.gps.latitude}° N, {weatherData.gps.longitude}° E
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5D7052]/10 text-[#5D7052]">
                  {weatherData.gps.region_classification}
                </span>
              </div>
              <p className="text-[11px] text-[#78786C] mt-0.5">
                {weatherData.gps.radar_station} • {weatherData.gps.distance_to_station_km} km away
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#78786C] font-semibold">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#78786C] block">Evapotranspiration</span>
              <span className="font-serif font-bold text-sm text-[#5D7052]">{weatherData.current.evapotranspiration_mm_day} mm/day</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#78786C] block">Solar Radiation</span>
              <span className="font-serif font-bold text-sm text-[#C18C5D]">{weatherData.current.solar_radiation_w_m2} W/m²</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#78786C] block">Overpass</span>
              <span className="font-serif font-bold text-xs text-[#2C2C24]">{weatherData.gps.next_sentinel_overpass}</span>
            </div>
          </div>
        </div>
      )}

      {/* Current Microclimate Telemetry Row */}
      {weatherData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div className="p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <div className="flex items-center justify-between text-[#78786C] text-xs font-bold">
              <span>Air Temperature</span>
              <ThermometerSun className="w-4 h-4 text-[#C18C5D]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-[#2C2C24] mt-2">
              {weatherData.current.temperature_c}°C
            </div>
            <span className="text-[11px] text-[#78786C] mt-1 block font-medium">Dew Point: {weatherData.current.dew_point_c}°C</span>
          </div>

          <div className="p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <div className="flex items-center justify-between text-[#78786C] text-xs font-bold">
              <span>Relative Humidity</span>
              <Droplets className="w-4 h-4 text-[#5D7052]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-[#5D7052] mt-2">
              {weatherData.current.humidity_pct}%
            </div>
            <span className="text-[11px] text-[#78786C] mt-1 block font-medium">Cloud Cover: {weatherData.current.cloud_cover_pct}%</span>
          </div>

          <div className="p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <div className="flex items-center justify-between text-[#78786C] text-xs font-bold">
              <span>Soil Temperature (10cm)</span>
              <ThermometerSun className="w-4 h-4 text-[#C18C5D]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-[#C18C5D] mt-2">
              {weatherData.current.soil_temperature_c}°C
            </div>
            <span className="text-[11px] text-[#78786C] mt-1 block font-medium">Moisture: {weatherData.current.soil_moisture_pct}%</span>
          </div>

          <div className="p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <div className="flex items-center justify-between text-[#78786C] text-xs font-bold">
              <span>Wind Velocity & Vector</span>
              <Wind className="w-4 h-4 text-[#78786C]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-serif text-[#78786C] mt-2">
              {weatherData.current.wind_speed_kmh} km/h
            </div>
            <span className="text-[11px] text-[#78786C] mt-1 block font-medium">{weatherData.current.wind_direction}</span>
          </div>
        </div>
      )}

      {/* 24-Hour Precipitation Probability & Spraying Feasibility Radar */}
      {weatherData && weatherData.hourly_radar && (
        <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#2C2C24] font-serif flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#5D7052]" />
                <span>24-Hour Live Precipitation Radar & Spraying Feasibility</span>
              </h3>
              <p className="text-xs text-[#78786C] mt-0.5 font-medium">
                Hourly rain probability (%) & drift thresholds for agricultural spraying
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20 hidden sm:inline">
              ⚡ Real-Time Radar Sync
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
            {weatherData.hourly_radar.map((h, i) => (
              <div 
                key={i} 
                className={`p-3 rounded-2xl border text-center text-xs transition-all ${
                  h.spraying_feasible 
                    ? 'bg-[#F0EBE5]/50 border-[#DED8CF] hover:border-[#5D7052]' 
                    : 'bg-[#A85448]/10 border-[#A85448]/30'
                }`}
              >
                <span className="font-bold text-[#2C2C24] block font-serif text-[11px]">{h.time}</span>
                <div className="font-bold text-sm my-1 text-[#2C2C24]">
                  {h.temperature_c}°C
                </div>
                <div className="text-[10px] font-bold text-[#5D7052] mb-1">
                  🌧 {h.rain_prob_pct}%
                </div>
                <span className={`text-[9px] font-bold block px-1.5 py-0.5 rounded-full ${
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

      {/* 7-Day Agricultural Forecast Table */}
      {weatherData && (
        <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-5">
          <h3 className="text-base font-bold text-[#2C2C24] font-serif flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-[#5D7052]" />
            <span>7-Day Agricultural Weather Outlook & Spraying Windows</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-7 gap-3.5 text-center text-xs">
            {weatherData.forecast_7_days.map((f, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border transition-all ${
                  f.rain_prob_pct > 50
                    ? 'bg-[#A85448]/10 border-[#A85448]/30'
                    : 'bg-[#F0EBE5]/50 border-[#DED8CF]'
                }`}
              >
                <span className="font-bold text-[#2C2C24] block mb-1 font-serif">{f.day}</span>
                <div className="text-base font-bold text-[#2C2C24] font-serif my-1">
                  {f.temp_max}° / {f.temp_min}°
                </div>
                <span className="text-[10px] text-[#78786C] block font-medium">{f.condition}</span>
                <div className="mt-3 pt-2.5 border-t border-[#DED8CF]/60">
                  <span className="text-[10px] text-[#5D7052] font-bold block">🌧 {f.rain_prob_pct}% Rain</span>
                  <span className={`text-[9px] font-bold block mt-1.5 px-2 py-0.5 rounded-full ${
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

      {/* Active Agro-Climatic Hazards & Alerts */}
      {alertsData && (
        <div className="p-7 rounded-[2.25rem] bg-gradient-to-br from-[#FEFEFA] to-[#C18C5D]/10 border border-[#C18C5D]/30 shadow-soft space-y-5">
          <h3 className="text-base font-bold text-[#2C2C24] font-serif flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#C18C5D]" />
            <span>Active Regional Agro-Weather Advisories</span>
          </h3>

          <div className="space-y-3.5">
            {alertsData.active_alerts.map((alt) => (
              <div key={alt.id} className="p-5 rounded-2xl bg-[#FEFEFA] border border-[#DED8CF] shadow-sm text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#2C2C24] text-sm font-serif">{alt.type}</span>
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#C18C5D]/15 text-[#C18C5D] border border-[#C18C5D]/30">
                    {alt.severity}
                  </span>
                </div>
                <p className="text-[#2C2C24] leading-relaxed font-sans">{alt.advisory}</p>
                <div className="mt-3 pt-2 border-t border-[#DED8CF]/60 text-[11px] text-[#78786C] flex items-center justify-between font-medium">
                  <span>Impacts: {alt.impacted_regions.join(', ')}</span>
                  <span className="font-mono text-[#5D7052] font-bold">Window: {alt.valid_until}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};


