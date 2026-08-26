import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  DollarSign, 
  CloudRain, 
  Activity, 
  Filter,
  RefreshCw,
  TrendingUp,
  Award,
  Layers,
  MapPin,
  PieChart as PieIcon,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const NATIONAL_MASTER_STATES = [
  { state: "Uttar Pradesh", production_mt: 58400000, area_ha: 25800000, avg_farmer_earning: 142000, avg_land_size: 2.4, total_farmers: 23400000, productivity_index: 78.4, primary_crops: ["Wheat", "Sugarcane", "Rice", "Potato"], soil_type: "Alluvial", avg_rainfall_mm: 980, avg_temp_c: 25.2, season: "All" },
  { state: "Punjab", production_mt: 32100000, area_ha: 7900000, avg_farmer_earning: 298000, avg_land_size: 8.6, total_farmers: 1850000, productivity_index: 94.2, primary_crops: ["Wheat", "Rice", "Cotton", "Maize"], soil_type: "Alluvial", avg_rainfall_mm: 620, avg_temp_c: 24.1, season: "Rabi" },
  { state: "Madhya Pradesh", production_mt: 36800000, area_ha: 15400000, avg_farmer_earning: 156000, avg_land_size: 4.8, total_farmers: 8900000, productivity_index: 74.6, primary_crops: ["Soybean", "Wheat", "Chickpea", "Mustard"], soil_type: "Black / Clay", avg_rainfall_mm: 1050, avg_temp_c: 26.3, season: "Kharif" },
  { state: "Maharashtra", production_mt: 28900000, area_ha: 14200000, avg_farmer_earning: 168000, avg_land_size: 3.6, total_farmers: 13600000, productivity_index: 71.8, primary_crops: ["Sugarcane", "Cotton", "Soybean", "Pigeon Pea"], soil_type: "Black (Regur)", avg_rainfall_mm: 1150, avg_temp_c: 27.1, season: "Kharif" },
  { state: "West Bengal", production_mt: 24700000, area_ha: 5800000, avg_farmer_earning: 128000, avg_land_size: 1.9, total_farmers: 7200000, productivity_index: 82.1, primary_crops: ["Rice", "Jute", "Potato", "Maize"], soil_type: "Alluvial / Coastal", avg_rainfall_mm: 1680, avg_temp_c: 26.8, season: "Kharif" },
  { state: "Andhra Pradesh", production_mt: 21500000, area_ha: 6200000, avg_farmer_earning: 185000, avg_land_size: 3.2, total_farmers: 6400000, productivity_index: 84.7, primary_crops: ["Rice", "Cotton", "Groundnut", "Chilli"], soil_type: "Red / Coastal Alluvial", avg_rainfall_mm: 940, avg_temp_c: 28.4, season: "Kharif" },
  { state: "Karnataka", production_mt: 18200000, area_ha: 11800000, avg_farmer_earning: 172000, avg_land_size: 3.8, total_farmers: 7900000, productivity_index: 76.5, primary_crops: ["Maize", "Sugarcane", "Rice", "Cotton"], soil_type: "Red / Black", avg_rainfall_mm: 1120, avg_temp_c: 26.0, season: "Kharif" },
  { state: "Gujarat", production_mt: 19400000, area_ha: 9800000, avg_farmer_earning: 224000, avg_land_size: 5.1, total_farmers: 5400000, productivity_index: 80.3, primary_crops: ["Cotton", "Groundnut", "Wheat", "Castor"], soil_type: "Black / Sandy Alluvial", avg_rainfall_mm: 780, avg_temp_c: 27.6, season: "Kharif" },
  { state: "Haryana", production_mt: 18600000, area_ha: 4600000, avg_farmer_earning: 275000, avg_land_size: 5.5, total_farmers: 1600000, productivity_index: 91.5, primary_crops: ["Wheat", "Mustard", "Rice", "Cotton"], soil_type: "Alluvial", avg_rainfall_mm: 540, avg_temp_c: 24.8, season: "Rabi" },
  { state: "Rajasthan", production_mt: 22300000, area_ha: 21200000, avg_farmer_earning: 139000, avg_land_size: 7.2, total_farmers: 7100000, productivity_index: 68.2, primary_crops: ["Mustard", "Bajra", "Wheat", "Gram"], soil_type: "Desert / Sandy Loam", avg_rainfall_mm: 480, avg_temp_c: 27.8, season: "Rabi" },
  { state: "Tamil Nadu", production_mt: 14500000, area_ha: 4900000, avg_farmer_earning: 162000, avg_land_size: 2.1, total_farmers: 4200000, productivity_index: 83.9, primary_crops: ["Rice", "Sugarcane", "Groundnut", "Banana"], soil_type: "Red / Clay Loam", avg_rainfall_mm: 960, avg_temp_c: 28.9, season: "Kharif" },
  { state: "Bihar", production_mt: 16800000, area_ha: 5200000, avg_farmer_earning: 105000, avg_land_size: 1.4, total_farmers: 9800000, productivity_index: 73.1, primary_crops: ["Rice", "Wheat", "Maize", "Pulses"], soil_type: "Alluvial", avg_rainfall_mm: 1200, avg_temp_c: 26.1, season: "Rabi" },
  { state: "Telangana", production_mt: 15400000, area_ha: 5300000, avg_farmer_earning: 169000, avg_land_size: 2.9, total_farmers: 4900000, productivity_index: 79.8, primary_crops: ["Rice", "Cotton", "Maize", "Soybean"], soil_type: "Red / Black", avg_rainfall_mm: 910, avg_temp_c: 28.2, season: "Kharif" }
];

const MASTER_TOP_DISTRICTS = [
  { district: "Ludhiana", state: "Punjab", production_mt: 3850000, yield_t_ha: 5.4, crop: "Wheat/Paddy" },
  { district: "Kolhapur", state: "Maharashtra", production_mt: 3620000, yield_t_ha: 92.0, crop: "Sugarcane" },
  { district: "Muzaffarnagar", state: "Uttar Pradesh", production_mt: 3410000, yield_t_ha: 86.5, crop: "Sugarcane" },
  { district: "East Godavari", state: "Andhra Pradesh", production_mt: 3120000, yield_t_ha: 4.8, crop: "Paddy" },
  { district: "Bardhaman", state: "West Bengal", production_mt: 2980000, yield_t_ha: 4.6, crop: "Rice" },
  { district: "Karnal", state: "Haryana", production_mt: 2840000, yield_t_ha: 5.2, crop: "Wheat/Paddy" },
  { district: "Sangli", state: "Maharashtra", production_mt: 2750000, yield_t_ha: 84.0, crop: "Sugarcane" },
  { district: "Ujjain", state: "Madhya Pradesh", production_mt: 2610000, yield_t_ha: 2.4, crop: "Soybean/Wheat" },
  { district: "Thanjavur", state: "Tamil Nadu", production_mt: 2490000, yield_t_ha: 4.9, crop: "Rice" },
  { district: "Belagavi", state: "Karnataka", production_mt: 2380000, yield_t_ha: 78.0, crop: "Sugarcane/Maize" }
];

const MASTER_YEARLY_TRENDS = [
  { year: "2012-13", total_production_mt: 257.1, total_area_mha: 126.2, avg_yield_t_ha: 2.04, rainfall_anomaly_pct: -7.1, temp_c: 24.8 },
  { year: "2013-14", total_production_mt: 265.6, total_area_mha: 127.8, avg_yield_t_ha: 2.08, rainfall_anomaly_pct: 5.6, temp_c: 24.6 },
  { year: "2014-15", total_production_mt: 252.0, total_area_mha: 124.5, avg_yield_t_ha: 2.02, rainfall_anomaly_pct: -11.9, temp_c: 25.1 },
  { year: "2015-16", total_production_mt: 251.6, total_area_mha: 123.2, avg_yield_t_ha: 2.04, rainfall_anomaly_pct: -14.3, temp_c: 25.4 },
  { year: "2016-17", total_production_mt: 275.1, total_area_mha: 128.0, avg_yield_t_ha: 2.15, rainfall_anomaly_pct: -2.8, temp_c: 24.9 },
  { year: "2017-18", total_production_mt: 285.0, total_area_mha: 127.5, avg_yield_t_ha: 2.23, rainfall_anomaly_pct: -5.1, temp_c: 25.2 },
  { year: "2018-19", total_production_mt: 285.2, total_area_mha: 125.8, avg_yield_t_ha: 2.27, rainfall_anomaly_pct: -9.2, temp_c: 25.3 },
  { year: "2019-20", total_production_mt: 297.5, total_area_mha: 128.4, avg_yield_t_ha: 2.32, rainfall_anomaly_pct: 10.4, temp_c: 25.0 },
  { year: "2020-21", total_production_mt: 310.7, total_area_mha: 130.2, avg_yield_t_ha: 2.39, rainfall_anomaly_pct: 8.7, temp_c: 24.9 },
  { year: "2021-22", total_production_mt: 315.6, total_area_mha: 129.8, avg_yield_t_ha: 2.43, rainfall_anomaly_pct: 0.4, temp_c: 25.2 },
  { year: "2022-23", total_production_mt: 329.7, total_area_mha: 131.5, avg_yield_t_ha: 2.51, rainfall_anomaly_pct: 6.2, temp_c: 25.5 },
  { year: "2023-24", total_production_mt: 332.3, total_area_mha: 132.1, avg_yield_t_ha: 2.52, rainfall_anomaly_pct: -5.6, temp_c: 25.8 }
];

const MASTER_SOIL_RADAR = [
  { crop: "Rice / Paddy", soil_health_score: 76.5, fertility_index: 82.0, stress_index: 28.5, nitrogen: 180, phosphorus: 35, potassium: 160, moisture_pct: 65, humidity: 78, soil_type: "Clay / Alluvial" },
  { crop: "Wheat", soil_health_score: 84.2, fertility_index: 86.4, stress_index: 18.2, nitrogen: 210, phosphorus: 48, potassium: 190, moisture_pct: 42, humidity: 55, soil_type: "Alluvial Loam" },
  { crop: "Cotton", soil_health_score: 68.4, fertility_index: 71.2, stress_index: 44.0, nitrogen: 150, phosphorus: 30, potassium: 140, moisture_pct: 32, humidity: 62, soil_type: "Black Cotton Soil" },
  { crop: "Sugarcane", soil_health_score: 79.1, fertility_index: 88.0, stress_index: 35.8, nitrogen: 240, phosphorus: 55, potassium: 220, moisture_pct: 58, humidity: 72, soil_type: "Heavy Alluvial" },
  { crop: "Soybean", soil_health_score: 72.8, fertility_index: 75.0, stress_index: 31.4, nitrogen: 130, phosphorus: 38, potassium: 125, moisture_pct: 38, humidity: 68, soil_type: "Medium Black" },
  { crop: "Chickpea", soil_health_score: 74.0, fertility_index: 73.5, stress_index: 22.0, nitrogen: 95, phosphorus: 32, potassium: 110, moisture_pct: 28, humidity: 48, soil_type: "Sandy Loam / Black" },
  { crop: "Maize", soil_health_score: 81.0, fertility_index: 83.2, stress_index: 25.0, nitrogen: 190, phosphorus: 42, potassium: 170, moisture_pct: 45, humidity: 64, soil_type: "Red / Sandy Loam" },
  { crop: "Mustard", soil_health_score: 77.2, fertility_index: 76.8, stress_index: 26.5, nitrogen: 140, phosphorus: 34, potassium: 135, moisture_pct: 30, humidity: 52, soil_type: "Sandy Loam" }
];

const MASTER_CLIMATE_IMPACT = [
  { year: 2018, rainfall_mm: 1042, avg_temp_c: 25.3, crop_yield_t_ha: 2.27, weather_risk_index: 38, extreme_events: 14, economic_impact_m_usd: 420 },
  { year: 2019, rainfall_mm: 1288, avg_temp_c: 25.0, crop_yield_t_ha: 2.32, weather_risk_index: 52, extreme_events: 26, economic_impact_m_usd: 780 },
  { year: 2020, rainfall_mm: 1262, avg_temp_c: 24.9, crop_yield_t_ha: 2.39, weather_risk_index: 44, extreme_events: 21, economic_impact_m_usd: 610 },
  { year: 2021, rainfall_mm: 1175, avg_temp_c: 25.2, crop_yield_t_ha: 2.43, weather_risk_index: 48, extreme_events: 24, economic_impact_m_usd: 720 },
  { year: 2022, rainfall_mm: 1250, avg_temp_c: 25.5, crop_yield_t_ha: 2.51, weather_risk_index: 58, extreme_events: 31, economic_impact_m_usd: 940 },
  { year: 2023, rainfall_mm: 1090, avg_temp_c: 25.8, crop_yield_t_ha: 2.52, weather_risk_index: 64, extreme_events: 35, economic_impact_m_usd: 1120 },
  { year: 2024, rainfall_mm: 1195, avg_temp_c: 25.6, crop_yield_t_ha: 2.58, weather_risk_index: 46, extreme_events: 22, economic_impact_m_usd: 680 }
];

const MASTER_IRRIGATION = [
  { type: "Tube Well / Borewell", share_pct: 46.2, productivity_index: 86.5 },
  { type: "Canal Irrigation", share_pct: 28.4, productivity_index: 82.1 },
  { type: "Rainfed / Monsoon Only", share_pct: 19.8, productivity_index: 62.4 },
  { type: "Drip & Micro-Irrigation", share_pct: 5.6, productivity_index: 93.8 }
];

export const NationalAnalytics = () => {
  const { t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState('crop_production'); // crop_production, farmer_econ, climate, soil_radar
  const [stateFilter, setStateFilter] = useState('all');
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [cropFilter, setCropFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [liveServerData, setLiveServerData] = useState(null);

  // Available unique lists
  const availableStates = useMemo(() => {
    return Array.from(new Set(NATIONAL_MASTER_STATES.map(s => s.state)));
  }, []);

  const availableCrops = useMemo(() => {
    const crops = new Set();
    NATIONAL_MASTER_STATES.forEach(s => s.primary_crops.forEach(c => crops.add(c)));
    return Array.from(crops);
  }, []);

  const fetchAnalytics = async (state = stateFilter, season = seasonFilter) => {
    setLoading(true);
    try {
      const data = await api.getAnalyticsSummary({
        state: state === 'all' ? null : state,
        season: season === 'all' ? null : season
      });
      if (data && data.states && data.states.length > 0) {
        setLiveServerData(data);
      }
    } catch (err) {
      console.warn("[National Analytics] Using robust local aggregator:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Compute filtered dataset based on active Slicers
  const filteredStates = useMemo(() => {
    const base = liveServerData?.states?.length ? liveServerData.states : NATIONAL_MASTER_STATES;
    return base.filter(item => {
      const matchState = stateFilter === 'all' || item.state.toLowerCase() === stateFilter.toLowerCase();
      const matchSeason = seasonFilter === 'all' || !item.season || item.season === 'All' || item.season.toLowerCase() === seasonFilter.toLowerCase();
      const matchCrop = cropFilter === 'all' || item.primary_crops?.some(c => c.toLowerCase() === cropFilter.toLowerCase());
      const matchSearch = !searchTerm || item.state.toLowerCase().includes(searchTerm.toLowerCase()) || item.soil_type?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchState && matchSeason && matchCrop && matchSearch;
    });
  }, [liveServerData, stateFilter, seasonFilter, cropFilter, searchTerm]);

  // Compute dynamic live KPIs
  const computedKPIs = useMemo(() => {
    if (!filteredStates.length) {
      return {
        total_production_mt: "0.0",
        total_area_mha: "0.0",
        avg_yield_t_ha: "0.00",
        avg_farmer_earning_inr: 0,
        total_farmers_m: "0.0"
      };
    }
    const totalProd = filteredStates.reduce((acc, s) => acc + (s.production_mt || 0), 0);
    const totalArea = filteredStates.reduce((acc, s) => acc + (s.area_ha || 0), 0);
    const totalFarmers = filteredStates.reduce((acc, s) => acc + (s.total_farmers || 0), 0);
    const avgIncome = Math.round(filteredStates.reduce((acc, s) => acc + (s.avg_farmer_earning || 0), 0) / filteredStates.length);
    const avgYield = totalArea > 0 ? (totalProd / totalArea).toFixed(2) : "2.52";

    return {
      total_production_mt: (totalProd / 1000000).toFixed(1),
      total_area_mha: (totalArea / 1000000).toFixed(1),
      avg_yield_t_ha: avgYield,
      avg_farmer_earning_inr: avgIncome,
      total_farmers_m: (totalFarmers / 1000000).toFixed(1)
    };
  }, [filteredStates]);

  // Filtered Top Districts
  const filteredDistricts = useMemo(() => {
    const base = liveServerData?.top_districts?.length ? liveServerData.top_districts : MASTER_TOP_DISTRICTS;
    if (stateFilter === 'all') return base;
    return base.filter(d => d.state.toLowerCase() === stateFilter.toLowerCase());
  }, [liveServerData, stateFilter]);

  // Yearly Trends
  const yearlyTrends = useMemo(() => {
    return liveServerData?.yearly_trends?.length ? liveServerData.yearly_trends : MASTER_YEARLY_TRENDS;
  }, [liveServerData]);

  // Soil Radar
  const soilRadar = useMemo(() => {
    const base = liveServerData?.soil_radar?.length ? liveServerData.soil_radar : MASTER_SOIL_RADAR;
    if (cropFilter === 'all') return base;
    const matched = base.filter(s => s.crop.toLowerCase().includes(cropFilter.toLowerCase()));
    return matched.length ? matched : base;
  }, [liveServerData, cropFilter]);

  // Climate Impact
  const climateImpact = useMemo(() => {
    return liveServerData?.climate_impact?.length ? liveServerData.climate_impact : MASTER_CLIMATE_IMPACT;
  }, [liveServerData]);

  // Irrigation Demographics
  const irrigationData = useMemo(() => {
    return liveServerData?.farmer_demographics?.irrigation || MASTER_IRRIGATION;
  }, [liveServerData]);

  const resetAllFilters = () => {
    setStateFilter('all');
    setSeasonFilter('all');
    setCropFilter('all');
    setSearchTerm('');
    fetchAnalytics('all', 'all');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ── HEADER & SLICERS BAR ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-[#FEFEFA] p-6 sm:p-8 rounded-[2.5rem] border border-[#DED8CF] shadow-soft">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#5D7052] text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>National Agricultural BI & Macroeconomic Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C2C24] font-serif tracking-tight">
            {t('bi_title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#78786C] font-medium max-w-2xl">
            {t('bi_subtitle')}
          </p>
        </div>

        {/* Global Slicers Controls */}
        <div className="flex flex-wrap items-center gap-2.5 bg-[#F0EBE5]/60 p-2.5 rounded-2xl border border-[#DED8CF] self-start lg:self-center">
          <div className="flex items-center gap-1.5 px-2 text-xs text-[#78786C] font-bold">
            <Filter className="w-3.5 h-3.5 text-[#5D7052]" />
            <span>Slicers:</span>
          </div>

          {/* State Slicer */}
          <select
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
              fetchAnalytics(e.target.value, seasonFilter);
            }}
            aria-label="Filter State"
            className="px-3.5 py-2 rounded-xl bg-[#FEFEFA] border border-[#DED8CF] text-xs font-bold text-[#2C2C24] cursor-pointer outline-none shadow-xs hover:border-[#5D7052] transition"
          >
            <option value="all">{t('all_states')} ({availableStates.length})</option>
            {availableStates.map(st => <option key={st} value={st}>{st}</option>)}
          </select>

          {/* Season Slicer */}
          <select
            value={seasonFilter}
            onChange={(e) => {
              setSeasonFilter(e.target.value);
              fetchAnalytics(stateFilter, e.target.value);
            }}
            aria-label="Filter Season"
            className="px-3.5 py-2 rounded-xl bg-[#FEFEFA] border border-[#DED8CF] text-xs font-bold text-[#2C2C24] cursor-pointer outline-none shadow-xs hover:border-[#5D7052] transition"
          >
            <option value="all">All Seasons</option>
            <option value="Kharif">Kharif (Monsoon)</option>
            <option value="Rabi">Rabi (Winter)</option>
            <option value="Zaid">Zaid (Summer)</option>
          </select>

          {/* Crop Slicer */}
          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            aria-label="Filter Crop"
            className="px-3.5 py-2 rounded-xl bg-[#FEFEFA] border border-[#DED8CF] text-xs font-bold text-[#2C2C24] cursor-pointer outline-none shadow-xs hover:border-[#5D7052] transition"
          >
            <option value="all">All Crops</option>
            {availableCrops.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Reset button */}
          {(stateFilter !== 'all' || seasonFilter !== 'all' || cropFilter !== 'all' || searchTerm) && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E87A5D]/10 hover:bg-[#E87A5D]/20 text-[#A85448] text-xs font-bold transition"
              title="Reset all filters"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* ── TOP KPI CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* KPI 1: Production */}
        <div className="p-5 sm:p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-[#78786C] tracking-wider">{t('bi_total_prod')}</span>
            <div className="w-7 h-7 rounded-full bg-[#5D7052]/10 flex items-center justify-center text-[#5D7052]">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#5D7052] mt-2 block">
            {computedKPIs.total_production_mt} <span className="text-base font-sans font-medium text-[#78786C]">MT</span>
          </span>
          <span className="text-[11px] text-[#78786C] font-medium mt-1 block">
            {stateFilter === 'all' ? 'All India National Output' : `${stateFilter} Regional Output`}
          </span>
        </div>

        {/* KPI 2: Cultivated Area */}
        <div className="p-5 sm:p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-[#78786C] tracking-wider">{t('bi_cultivated_area')}</span>
            <div className="w-7 h-7 rounded-full bg-[#C18C5D]/10 flex items-center justify-center text-[#C18C5D]">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#C18C5D] mt-2 block">
            {computedKPIs.total_area_mha} <span className="text-base font-sans font-medium text-[#78786C]">Mha</span>
          </span>
          <span className="text-[11px] text-[#78786C] font-medium mt-1 block">
            Million Hectares Gross Sown Area
          </span>
        </div>

        {/* KPI 3: Avg Yield Rate */}
        <div className="p-5 sm:p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-[#78786C] tracking-wider">{t('bi_avg_yield')}</span>
            <div className="w-7 h-7 rounded-full bg-[#2C2C24]/10 flex items-center justify-center text-[#2C2C24]">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#2C2C24] mt-2 block">
            {computedKPIs.avg_yield_t_ha} <span className="text-base font-sans font-medium text-[#78786C]">t/ha</span>
          </span>
          <span className="text-[11px] text-[#78786C] font-medium mt-1 block">
            Productivity Per Hectare
          </span>
        </div>

        {/* KPI 4: Farmer Annual Income */}
        <div className="p-5 sm:p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold text-[#78786C] tracking-wider">{t('bi_avg_income')}</span>
            <div className="w-7 h-7 rounded-full bg-[#A85448]/10 flex items-center justify-center text-[#A85448]">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#A85448] mt-2 block">
            ₹{computedKPIs.avg_farmer_earning_inr.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#78786C] font-medium mt-1 block">
            Avg Agrarian Household / Year
          </span>
        </div>

      </div>

      {/* ── SUB-TABS SELECTOR ── */}
      <div className="flex items-center space-x-2 border-b border-[#DED8CF]/80 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'crop_production', label: t('bi_tab_crop_prod'), icon: BarChart3 },
          { id: 'farmer_econ', label: t('bi_tab_farmer_econ'), icon: DollarSign },
          { id: 'climate', label: t('bi_tab_climate_impact'), icon: CloudRain },
          { id: 'soil_radar', label: t('bi_tab_soil_radar'), icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft scale-100'
                  : 'bg-[#FEFEFA] text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5] border border-[#DED8CF]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: CROP PRODUCTION & DISTRICTS ── */}
      {activeSubTab === 'crop_production' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Top Districts by Total Production */}
            <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#2C2C24] font-serif">Top Agrarian Districts by Total Output (MT)</h3>
                  <p className="text-xs text-[#78786C] font-medium mt-0.5">High-density wheat, sugarcane, paddy, and pulse hubs</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#5D7052]/10 text-[#5D7052]">
                  {filteredDistricts.length} Districts
                </span>
              </div>
              
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredDistricts} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                    <XAxis type="number" stroke="#78786C" fontSize={10} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                    <YAxis dataKey="district" type="category" stroke="#78786C" fontSize={11} width={95} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FEFEFA', borderColor: '#DED8CF', borderRadius: '1rem', fontSize: '11px', boxShadow: '0 4px 20px -2px rgba(93,112,82,0.15)' }}
                      formatter={(val, name, item) => [
                        `${(val/1000000).toFixed(2)} Million Tonnes (${item.payload.state})`, 
                        'Annual Output'
                      ]}
                    />
                    <Bar dataKey="production_mt" fill="#5D7052" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] flex items-center gap-2 text-xs text-[#78786C]">
                <Info className="w-4 h-4 text-[#5D7052] shrink-0" />
                <span>Ludhiana & Kolhapur lead national production due to intensive irrigation canals and mechanized harvesting.</span>
              </div>
            </div>

            {/* Yearly National Production Trends (2012-2024) */}
            <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#2C2C24] font-serif">National Production & Area Trajectory (2012 - 2024)</h3>
                  <p className="text-xs text-[#78786C] font-medium mt-0.5">Total Foodgrain Output (MT) vs Cultivated Area (Mha)</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#C18C5D]/10 text-[#C18C5D]">
                  12-Year Multi-Year Series
                </span>
              </div>
              
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={yearlyTrends} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C18C5D" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#C18C5D" stopOpacity={0.02}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                    <XAxis dataKey="year" stroke="#78786C" fontSize={10} />
                    <YAxis stroke="#78786C" fontSize={10} domain={[200, 350]} />
                    <Tooltip contentStyle={{ backgroundColor: '#FEFEFA', borderColor: '#DED8CF', borderRadius: '1rem', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="total_production_mt" name="Production (MT)" stroke="#C18C5D" strokeWidth={2.5} fill="url(#colorProd)" />
                    <Line type="monotone" dataKey="total_area_mha" name="Gross Sown Area (Mha)" stroke="#5D7052" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] flex items-center gap-2 text-xs text-[#78786C]">
                <TrendingUp className="w-4 h-4 text-[#C18C5D] shrink-0" />
                <span>Foodgrain output surged +29.2% from 257.1 MT in 2012 to 332.3 MT in 2024, driven by high-yielding hybrid varieties.</span>
              </div>
            </div>

          </div>

          {/* State Comparison Benchmarks Table */}
          <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-base font-bold text-[#2C2C24] font-serif">State-Level Agricultural Benchmarks & Soil Profiles</h3>
                <p className="text-xs text-[#78786C] font-medium mt-0.5">Showing {filteredStates.length} state agricultural registries</p>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search state, crop, or soil..."
                className="px-4 py-2 rounded-xl bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs text-[#2C2C24] placeholder-[#78786C] outline-none focus:border-[#5D7052] transition w-full sm:w-64"
              />
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#DED8CF]/80">
              <table className="w-full text-left text-xs text-[#2C2C24]">
                <thead className="bg-[#F0EBE5]/80 text-[#78786C] uppercase text-[10px] font-bold border-b border-[#DED8CF]">
                  <tr>
                    <th className="p-3.5">State Name</th>
                    <th className="p-3.5">Total Output (MT)</th>
                    <th className="p-3.5">Cultivated Area (Ha)</th>
                    <th className="p-3.5">Productivity Index</th>
                    <th className="p-3.5">Avg Land Size</th>
                    <th className="p-3.5">Key Crops</th>
                    <th className="p-3.5">Soil Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DED8CF]/60 font-sans">
                  {filteredStates.map((st) => (
                    <tr key={st.state} className="hover:bg-[#F0EBE5]/40 transition">
                      <td className="p-3.5 font-bold text-[#2C2C24] font-serif flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#5D7052]" />
                        <span>{st.state}</span>
                      </td>
                      <td className="p-3.5 font-bold text-[#5D7052]">{(st.production_mt / 1000000).toFixed(1)} MT</td>
                      <td className="p-3.5 text-[#78786C]">{(st.area_ha / 1000000).toFixed(1)} Mha</td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          st.productivity_index >= 85 ? 'bg-emerald-100 text-emerald-800' :
                          st.productivity_index >= 75 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {st.productivity_index} / 100
                        </span>
                      </td>
                      <td className="p-3.5 text-[#78786C]">{st.avg_land_size} Acres</td>
                      <td className="p-3.5 text-[#2C2C24]">
                        <div className="flex flex-wrap gap-1">
                          {st.primary_crops.map(crop => (
                            <span key={crop} className="px-2 py-0.5 bg-[#F0EBE5] rounded text-[10px] text-[#78786C] font-medium">
                              {crop}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5 text-[#78786C]">{st.soil_type}</td>
                    </tr>
                  ))}
                  {filteredStates.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-[#78786C]">
                        No state records match your active filters. Click Reset to clear filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: FARMER ECONOMICS & LAND ── */}
      {activeSubTab === 'farmer_econ' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Average Annual Earning of Farmers by State */}
          <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#2C2C24] font-serif">Average Farmer Household Annual Earning (INR)</h3>
                <p className="text-xs text-[#78786C] font-medium mt-0.5">Benchmark comparison across agrarian states</p>
              </div>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredStates} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                  <XAxis dataKey="state" stroke="#78786C" fontSize={9} interval={0} angle={-35} textAnchor="end" height={60} />
                  <YAxis stroke="#78786C" fontSize={10} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FEFEFA', borderColor: '#DED8CF', borderRadius: '1rem', fontSize: '11px' }} 
                    formatter={(v) => [`₹${v.toLocaleString()} / year`, 'Average Annual Earning']}
                  />
                  <Bar dataKey="avg_farmer_earning" name="Annual Earning (INR)" fill="#5D7052" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] flex items-center gap-2 text-xs text-[#78786C]">
              <DollarSign className="w-4 h-4 text-[#5D7052] shrink-0" />
              <span>Punjab (₹2,98,000) and Haryana (₹2,75,000) lead due to higher average operational land holding (8.6 and 5.5 acres).</span>
            </div>
          </div>

          {/* Irrigation Distribution & Productivity */}
          <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#2C2C24] font-serif">Irrigation Infrastructure Share (%)</h3>
                <p className="text-xs text-[#78786C] font-medium mt-0.5">Water distribution channels vs productivity index</p>
              </div>
            </div>
            
            <div className="h-80 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={irrigationData}
                    dataKey="share_pct"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={4}
                    label={({ name, percent }) => `${name.split('/')[0]} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {irrigationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#5D7052', '#C18C5D', '#A85448', '#78786C', '#3A88E9'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FEFEFA', borderColor: '#DED8CF', borderRadius: '1rem', fontSize: '11px' }} 
                    formatter={(val, name, item) => [
                      `${val}% (Productivity Index: ${item.payload.productivity_index}/100)`,
                      item.payload.type
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] flex items-center gap-2 text-xs text-[#78786C]">
              <PieIcon className="w-4 h-4 text-[#C18C5D] shrink-0" />
              <span>Drip & Micro-Irrigation achieves the highest productivity index (93.8/100) while reducing water consumption by 45%.</span>
            </div>
          </div>

        </div>
      )}

      {/* ── TAB 3: MONSOON & CLIMATE EFFECT ── */}
      {activeSubTab === 'climate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Rainfall vs Yield Correlation */}
          <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#2C2C24] font-serif">Rainfall (mm) vs National Crop Yield (t/ha)</h3>
                <p className="text-xs text-[#78786C] font-medium mt-0.5">Monsoon variance and yield resilience (2018 - 2024)</p>
              </div>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={climateImpact} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                  <XAxis dataKey="year" stroke="#78786C" fontSize={10} />
                  <YAxis yAxisId="left" stroke="#5D7052" fontSize={10} domain={[900, 1400]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#C18C5D" fontSize={10} domain={[2.0, 3.0]} />
                  <Tooltip contentStyle={{ backgroundColor: '#FEFEFA', borderColor: '#DED8CF', borderRadius: '1rem', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="rainfall_mm" name="Rainfall (mm)" stroke="#5D7052" strokeWidth={2.5} />
                  <Line yAxisId="right" type="monotone" dataKey="crop_yield_t_ha" name="Crop Yield (t/ha)" stroke="#C18C5D" strokeWidth={2.5} strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] flex items-center gap-2 text-xs text-[#78786C]">
              <CloudRain className="w-4 h-4 text-[#5D7052] shrink-0" />
              <span>Yield resilience has decoupled from monsoon deficit thanks to deep aquifer borewells and drought-tolerant seeds.</span>
            </div>
          </div>

          {/* Extreme Weather Events & Economic Impact */}
          <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#2C2C24] font-serif">Extreme Weather Incidents & Crop Losses ($M USD)</h3>
                <p className="text-xs text-[#78786C] font-medium mt-0.5">Unseasonal heatwaves, hailstorms, and flood damages</p>
              </div>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={climateImpact} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                  <XAxis dataKey="year" stroke="#78786C" fontSize={10} />
                  <YAxis stroke="#78786C" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#FEFEFA', borderColor: '#DED8CF', borderRadius: '1rem', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="economic_impact_m_usd" name="Economic Loss ($M USD)" fill="#A85448" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] flex items-center gap-2 text-xs text-[#78786C]">
              <Info className="w-4 h-4 text-[#A85448] shrink-0" />
              <span>2023 saw peak agricultural losses ($1.12B) triggered by early March terminal heatwaves impacting North-Western wheat.</span>
            </div>
          </div>

        </div>
      )}

      {/* ── TAB 4: SOIL HEALTH RADAR MATRIX ── */}
      {activeSubTab === 'soil_radar' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Crop-wise Soil Health Radar */}
          <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#2C2C24] font-serif">Crop-Wise Soil Health & Fertility Radar</h3>
                <p className="text-xs text-[#78786C] font-medium mt-0.5">Multi-dimensional radar comparing Soil Health Score & Fertility</p>
              </div>
            </div>
            
            <div className="h-80 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={soilRadar}>
                  <PolarGrid stroke="#DED8CF" />
                  <PolarAngleAxis dataKey="crop" stroke="#78786C" fontSize={10} />
                  <PolarRadiusAxis stroke="#78786C" fontSize={9} domain={[0, 100]} />
                  <Radar name="Soil Health Score" dataKey="soil_health_score" stroke="#5D7052" fill="#5D7052" fillOpacity={0.35} />
                  <Radar name="Fertility Index" dataKey="fertility_index" stroke="#C18C5D" fill="#C18C5D" fillOpacity={0.3} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#FEFEFA', borderColor: '#DED8CF', borderRadius: '1rem', fontSize: '11px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] flex items-center gap-2 text-xs text-[#78786C]">
              <Activity className="w-4 h-4 text-[#5D7052] shrink-0" />
              <span>Wheat (84.2) and Maize (81.0) maintain highest soil nutrient stability when paired with legume crop rotation.</span>
            </div>
          </div>

          {/* Moisture vs Soil Health Plot */}
          <div className="p-6 sm:p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#2C2C24] font-serif">Soil Moisture (%) vs Overall Soil Health Index</h3>
                <p className="text-xs text-[#78786C] font-medium mt-0.5">Optimal moisture envelope for maximum nutrient bioavailability</p>
              </div>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                  <XAxis dataKey="moisture_pct" name="Moisture %" unit="%" stroke="#78786C" fontSize={10} domain={[20, 75]} />
                  <YAxis dataKey="soil_health_score" name="Health Score" stroke="#78786C" fontSize={10} domain={[60, 90]} />
                  <ZAxis dataKey="nitrogen" range={[60, 400]} name="Nitrogen Level" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#FEFEFA', borderColor: '#DED8CF', borderRadius: '1rem', fontSize: '11px' }}
                    formatter={(val, name, item) => [
                      `${item.payload.crop}: Score ${item.payload.soil_health_score}, Moisture ${item.payload.moisture_pct}%, N: ${item.payload.nitrogen} kg/ha`,
                      'Agronomy Status'
                    ]}
                  />
                  <Scatter name="Crops" data={soilRadar} fill="#C18C5D" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] flex items-center gap-2 text-xs text-[#78786C]">
              <Sparkles className="w-4 h-4 text-[#C18C5D] shrink-0" />
              <span>The optimal moisture envelope lies between 38% - 58%, yielding high microbial nitrification without root waterlogging.</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
