import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Map, 
  DollarSign, 
  CloudRain, 
  Activity, 
  Filter, 
  TrendingUp, 
  PieChart as PieIcon,
  Layers,
  Sparkles,
  Gauge
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

export const NationalAnalytics = () => {
  const { t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState('crop_production'); // crop_production, farmer_econ, climate, soil_radar
  const [stateFilter, setStateFilter] = useState('all');
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async (state = stateFilter, season = seasonFilter) => {
    setLoading(true);
    try {
      const data = await api.getAnalyticsSummary({
        state: state === 'all' ? null : state,
        season: season === 'all' ? null : season
      });
      setAnalyticsData(data);
    } catch (err) {
      console.error("Failed to load national analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'];

  if (loading && !analyticsData) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-slate-500 gap-3">
        <BarChart3 className="w-10 h-10 animate-bounce text-cyan-400" />
        <p className="text-sm font-medium">Aggregating National Agricultural BI Datasets...</p>
      </div>
    );
  }

  const kpis = analyticsData?.kpis || {};
  const states = analyticsData?.states || [];
  const topDistricts = analyticsData?.top_districts || [];
  const yearlyTrends = analyticsData?.yearly_trends || [];
  const soilRadar = analyticsData?.soil_radar || [];
  const climateImpact = analyticsData?.climate_impact || [];
  const farmerDemographics = analyticsData?.farmer_demographics || {};

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header & Sub-Tab Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#5D7052] text-xs font-bold uppercase tracking-wider mb-1.5">
            <BarChart3 className="w-4 h-4" />
            <span>Power BI Agronomy & Macroeconomic Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2C2C24] font-serif">
            {t('bi_title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#78786C] mt-1.5 font-medium">
            {t('bi_subtitle')}
          </p>
        </div>

        {/* Global Slicers Bar */}
        <div className="flex flex-wrap items-center gap-2.5 bg-[#FEFEFA] p-2.5 rounded-full border border-[#DED8CF] shadow-soft self-start">
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
            className="px-3 py-1.5 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs font-bold text-[#2C2C24] cursor-pointer outline-none focus:ring-2 ring-[#5D7052]/30"
          >
            <option value="all">{t('all_states')}</option>
            {states.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
          </select>

          {/* Season Slicer */}
          <select
            value={seasonFilter}
            onChange={(e) => {
              setSeasonFilter(e.target.value);
              fetchAnalytics(stateFilter, e.target.value);
            }}
            aria-label="Filter Season"
            className="px-3 py-1.5 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs font-bold text-[#2C2C24] cursor-pointer outline-none focus:ring-2 ring-[#5D7052]/30"
          >
            <option value="all">All Seasons (Kharif / Rabi / Zaid)</option>
            <option value="Kharif">Kharif (Monsoon)</option>
            <option value="Rabi">Rabi (Winter)</option>
            <option value="Zaid">Zaid (Summer)</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Row (Aggregated Live from Slicers) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div className="p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
          <span className="text-[10px] uppercase font-bold text-[#78786C] block">{t('bi_total_prod')}</span>
          <span className="text-2xl sm:text-3xl font-bold font-serif text-[#5D7052] mt-1.5 block">
            {kpis.total_production_mt} MT
          </span>
          <span className="text-[10px] text-[#78786C] font-medium">Metric Tonnes</span>
        </div>

        <div className="p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
          <span className="text-[10px] uppercase font-bold text-[#78786C] block">{t('bi_cultivated_area')}</span>
          <span className="text-2xl sm:text-3xl font-bold font-serif text-[#C18C5D] mt-1.5 block">
            {kpis.total_area_mha} Mha
          </span>
          <span className="text-[10px] text-[#78786C] font-medium">Million Hectares</span>
        </div>

        <div className="p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
          <span className="text-[10px] uppercase font-bold text-[#78786C] block">{t('bi_avg_yield')}</span>
          <span className="text-2xl sm:text-3xl font-bold font-serif text-[#2C2C24] mt-1.5 block">
            {kpis.avg_yield_t_ha} t/ha
          </span>
          <span className="text-[10px] text-[#78786C] font-medium">Productivity Rate</span>
        </div>

        <div className="p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
          <span className="text-[10px] uppercase font-bold text-[#78786C] block">{t('bi_avg_income')}</span>
          <span className="text-2xl sm:text-3xl font-bold font-serif text-[#A85448] mt-1.5 block">
            ₹{kpis.avg_farmer_earning_inr?.toLocaleString()}
          </span>
          <span className="text-[10px] text-[#78786C] font-medium">Per Farmer / Year</span>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex space-x-2.5 border-b border-[#DED8CF]/60 pb-3 overflow-x-auto scrollbar-none">
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
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#5D7052] text-[#F3F4F1] shadow-soft'
                  : 'text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5]'
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
            
            {/* Top 10 Districts by Production */}
            <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
              <h3 className="text-base font-bold text-[#2C2C24] font-serif mb-1">Top Districts by Total Production (MT)</h3>
              <p className="text-xs text-[#78786C] mb-4 font-medium">Leading agrarian districts across wheat, cane, paddy belts</p>
              
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topDistricts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                    <XAxis type="number" stroke="#78786C" fontSize={10} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                    <YAxis dataKey="district" type="category" stroke="#78786C" fontSize={11} width={90} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#FEFEFA', borderColor: '#DED8CF', borderRadius: '1rem', fontSize: '11px', boxShadow: '0 4px 20px -2px rgba(93,112,82,0.15)' }}
                      formatter={(val) => [`${(val/1000000).toFixed(2)} Million Tonnes`, 'Total Production']}
                    />
                    <Bar dataKey="production_mt" fill="#5D7052" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Yearly National Production Trends (2012-2024) */}
            <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
              <h3 className="text-base font-bold text-[#2C2C24] font-serif mb-1">National Production & Area Trends (2012 - 2024)</h3>
              <p className="text-xs text-[#78786C] mb-4 font-medium">Total Output (MT) vs Cultivated Area (Mha)</p>
              
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={yearlyTrends}>
                    <defs>
                      <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C18C5D" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#C18C5D" stopOpacity={0.02}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                    <XAxis dataKey="year" stroke="#78786C" fontSize={10} />
                    <YAxis stroke="#78786C" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#FEFEFA', borderColor: '#DED8CF', borderRadius: '1rem', fontSize: '11px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="total_production_mt" name="Production (MT)" stroke="#C18C5D" strokeWidth={2.5} fill="url(#colorProd)" />
                    <Line type="monotone" dataKey="total_area_mha" name="Cultivated Area (Mha)" stroke="#5D7052" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* State Comparison Table */}
          <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <h3 className="text-base font-bold text-[#2C2C24] font-serif mb-4">State-Level Agricultural Benchmarks</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2C2C24]">
                <thead className="bg-[#F0EBE5]/80 text-[#78786C] uppercase text-[10px] font-bold border-b border-[#DED8CF]">
                  <tr>
                    <th className="p-3.5">State Name</th>
                    <th className="p-3.5">Production (MT)</th>
                    <th className="p-3.5">Area (Ha)</th>
                    <th className="p-3.5">Productivity Index</th>
                    <th className="p-3.5">Avg Land Size</th>
                    <th className="p-3.5">Soil Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DED8CF]/60 font-sans">
                  {states.map((st) => (
                    <tr key={st.state} className="hover:bg-[#F0EBE5]/40 transition">
                      <td className="p-3.5 font-bold text-[#2C2C24] font-serif">{st.state}</td>
                      <td className="p-3.5 font-bold text-[#5D7052]">{(st.production_mt / 1000000).toFixed(1)} MT</td>
                      <td className="p-3.5 text-[#78786C]">{(st.area_ha / 1000000).toFixed(1)} Mha</td>
                      <td className="p-3.5 text-[#C18C5D] font-bold">{st.productivity_index} / 100</td>
                      <td className="p-3.5 text-[#78786C]">{st.avg_land_size} Acres</td>
                      <td className="p-3.5 text-[#78786C]">{st.soil_type}</td>
                    </tr>
                  ))}
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
          <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <h3 className="text-base font-bold text-[#2C2C24] font-serif mb-1">Average Farmer Annual Earning (INR) by State</h3>
            <p className="text-xs text-[#78786C] mb-4 font-medium">Benchmark comparison across intensive agricultural states</p>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={states}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                  <XAxis dataKey="state" stroke="#78786C" fontSize={9} interval={0} angle={-30} textAnchor="end" height={60} />
                  <YAxis stroke="#78786C" fontSize={10} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#FEFEFA', borderColor: '#DED8CF', borderRadius: '1rem', fontSize: '11px' }} />
                  <Bar dataKey="avg_farmer_earning" name="Annual Earning (INR)" fill="#5D7052" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Irrigation Distribution & Productivity */}
          <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <h3 className="text-base font-bold text-[#2C2C24] font-serif mb-1">Irrigation Infrastructure Share (%)</h3>
            <p className="text-xs text-[#78786C] mb-4 font-medium">Correlation with farm productivity and water access</p>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={farmerDemographics.irrigation || []}
                    dataKey="share_pct"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) => `${name.split('/')[0]} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {(farmerDemographics.irrigation || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#5D7052', '#C18C5D', '#A85448', '#78786C', '#DED8CF'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#FEFEFA', borderColor: '#DED8CF', borderRadius: '1rem', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* ── TAB 3: MONSOON & CLIMATE EFFECT ── */}
      {activeSubTab === 'climate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Rainfall vs Yield Correlation */}
          <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <h3 className="text-base font-bold text-[#2C2C24] font-serif mb-1">Rainfall (mm) vs National Crop Yield (t/ha)</h3>
            <p className="text-xs text-[#78786C] mb-4 font-medium">Monsoon variance and yield elasticity (2018 - 2024)</p>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={climateImpact}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                  <XAxis dataKey="year" stroke="#78786C" fontSize={10} />
                  <YAxis yAxisId="left" stroke="#5D7052" fontSize={10} />
                  <YAxis yAxisId="right" orientation="right" stroke="#C18C5D" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#FEFEFA', borderColor: '#DED8CF', borderRadius: '1rem', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="rainfall_mm" name="Total Rainfall (mm)" stroke="#5D7052" strokeWidth={2.5} />
                  <Line yAxisId="right" type="monotone" dataKey="crop_yield_t_ha" name="Crop Yield (t/ha)" stroke="#C18C5D" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Extreme Weather Events & Economic Impact */}
          <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <h3 className="text-base font-bold text-[#2C2C24] font-serif mb-1">Extreme Weather Events & Economic Losses ($M USD)</h3>
            <p className="text-xs text-[#78786C] mb-4 font-medium">Unseasonal heatwaves, hailstorms, and drought impact</p>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={climateImpact}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                  <XAxis dataKey="year" stroke="#78786C" fontSize={10} />
                  <YAxis stroke="#78786C" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#FEFEFA', borderColor: '#DED8CF', borderRadius: '1rem', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="economic_impact_m_usd" name="Economic Loss ($M USD)" fill="#A85448" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* ── TAB 4: SOIL HEALTH RADAR MATRIX ── */}
      {activeSubTab === 'soil_radar' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Crop-wise Soil Health Radar */}
          <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <h3 className="text-base font-bold text-[#2C2C24] font-serif mb-1">Crop-Wise Soil Health & Fertility Radar</h3>
            <p className="text-xs text-[#78786C] mb-4 font-medium">Multi-dimensional radar comparing Soil Health Score & Fertility</p>
            
            <div className="h-80 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={soilRadar}>
                  <PolarGrid stroke="#DED8CF" />
                  <PolarAngleAxis dataKey="crop" stroke="#78786C" fontSize={10} />
                  <PolarRadiusAxis stroke="#78786C" fontSize={9} />
                  <Radar name="Soil Health Score" dataKey="soil_health_score" stroke="#5D7052" fill="#5D7052" fillOpacity={0.35} />
                  <Radar name="Fertility Index" dataKey="fertility_index" stroke="#C18C5D" fill="#C18C5D" fillOpacity={0.3} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#FEFEFA', borderColor: '#DED8CF', borderRadius: '1rem', fontSize: '11px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Moisture vs Soil Health Plot */}
          <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <h3 className="text-base font-bold text-[#2C2C24] font-serif mb-1">Soil Moisture (%) vs Overall Soil Health Index</h3>
            <p className="text-xs text-[#78786C] mb-4 font-medium">Optimal moisture envelope for maximum nutrient bioavailability</p>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                  <XAxis dataKey="moisture_pct" name="Moisture %" unit="%" stroke="#78786C" fontSize={10} />
                  <YAxis dataKey="soil_health_score" name="Health Score" stroke="#78786C" fontSize={10} domain={[60, 90]} />
                  <ZAxis dataKey="nitrogen" range={[60, 400]} name="Nitrogen Level" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#FEFEFA', borderColor: '#DED8CF', borderRadius: '1rem', fontSize: '11px' }}
                  />
                  <Scatter name="Crops" data={soilRadar} fill="#C18C5D" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

