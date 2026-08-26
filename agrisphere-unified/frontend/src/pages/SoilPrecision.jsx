import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  TrendingDown, 
  ArrowRight, 
  ShieldAlert, 
  RotateCcw, 
  DollarSign, 
  Sparkles,
  HelpCircle,
  FlaskConical,
  CheckCircle2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const SoilPrecision = () => {
  const { t } = useLanguage();
  const { selectedFarm } = useApp();

  const [crop, setCrop] = useState('Wheat');
  const [nitrogen, setNitrogen] = useState(165);
  const [phosphorus, setPhosphorus] = useState(24);
  const [potassium, setPotassium] = useState(140);
  const [ph, setPh] = useState(6.8);
  const [organicCarbon, setOrganicCarbon] = useState(0.85);
  const [moisture, setMoisture] = useState(35);

  const [scoreData, setScoreData] = useState(null);
  const [depletionData, setDepletionData] = useState(null);
  const [rotationData, setRotationData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync with selected farm if available
  useEffect(() => {
    if (selectedFarm && selectedFarm.soil_health) {
      setCrop(selectedFarm.current_crop || 'Wheat');
      setNitrogen(selectedFarm.soil_health.nitrogen || 165);
      setPhosphorus(selectedFarm.soil_health.phosphorus || 24);
      setPotassium(selectedFarm.soil_health.potassium || 140);
      setPh(selectedFarm.soil_health.ph || 6.8);
      setOrganicCarbon(selectedFarm.soil_health.organic_carbon || 0.85);
      setMoisture(selectedFarm.soil_health.moisture || 35);
    }
    handleCalculate();
  }, [selectedFarm]);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const [scoreRes, depletRes, rotRes] = await Promise.all([
        api.calculateSoilScore({
          nitrogen: parseFloat(nitrogen),
          phosphorus: parseFloat(phosphorus),
          potassium: parseFloat(potassium),
          ph: parseFloat(ph),
          organic_carbon: parseFloat(organicCarbon),
          moisture: parseFloat(moisture)
        }),
        api.predictSoilDepletion({
          crop,
          nitrogen: parseFloat(nitrogen),
          phosphorus: parseFloat(phosphorus),
          potassium: parseFloat(potassium),
          organic_carbon: parseFloat(organicCarbon),
          seasons: 3
        }),
        api.getCropRotation({
          current_crop: crop,
          soil_score: 75.0,
          ph: parseFloat(ph),
          irrigation_type: "Canal/Borewell"
        })
      ]);

      setScoreData(scoreRes);
      setDepletionData(depletRes);
      setRotationData(rotRes);
    } catch (err) {
      console.error("Soil analysis error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data comparing monoculture vs rotation
  const getCombinedChartData = () => {
    if (!depletionData) return [];
    const mono = depletionData.monoculture_drawdown || [];
    const rot = depletionData.smart_rotation_trajectory || [];
    
    return mono.map((m, idx) => ({
      season: m.season,
      mono_n: m.nitrogen,
      mono_score: m.soil_health_score,
      rot_n: rot[idx] ? rot[idx].nitrogen : m.nitrogen,
      rot_score: rot[idx] ? rot[idx].soil_health_score : m.soil_health_score,
      potassium: m.potassium,
      phosphorus: m.phosphorus
    }));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[#5D7052] text-xs font-bold uppercase tracking-wider mb-1.5">
          <FlaskConical className="w-4 h-4" />
          <span>Precision Agronomy & NPK Depletion Simulator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#2C2C24] font-serif">
          {t('soil_title')}
        </h1>
        <p className="text-xs sm:text-sm text-[#78786C] mt-1.5 font-medium">
          {t('soil_subtitle')}
        </p>
      </div>

      {/* Main Grid: Form Left, Results & Charts Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Soil Card Input Parameters (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <h3 className="text-base font-bold text-[#2C2C24] font-serif mb-5 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-[#5D7052]" />
              <span>{t('soil_input_card')}</span>
            </h3>

            <div className="space-y-4 text-xs font-sans">
              {/* Crop Selector */}
              <div>
                <label className="block text-[#2C2C24] font-bold mb-1.5">Current Standing Crop</label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full p-3 rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] text-xs font-bold text-[#2C2C24] cursor-pointer outline-none focus:ring-2 ring-[#5D7052]/30"
                >
                  {["Wheat", "Rice", "Cotton", "Sugarcane", "Soybean", "Chickpea", "Maize", "Mustard"].map((c) => (
                    <option key={c} value={c} className="bg-[#FEFEFA] text-[#2C2C24]">{c}</option>
                  ))}
                </select>
              </div>

              {/* Nitrogen (N) */}
              <div>
                <div className="flex justify-between text-[#2C2C24] font-bold mb-1.5">
                  <span>{t('soil_nitrogen')}</span>
                  <span className="font-serif text-[#5D7052] font-bold text-sm">{nitrogen} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="400"
                  value={nitrogen}
                  onChange={(e) => setNitrogen(parseFloat(e.target.value))}
                  className="w-full accent-[#5D7052] cursor-pointer"
                />
              </div>

              {/* Phosphorus (P) */}
              <div>
                <div className="flex justify-between text-[#2C2C24] font-bold mb-1.5">
                  <span>{t('soil_phosphorus')}</span>
                  <span className="font-serif text-[#C18C5D] font-bold text-sm">{phosphorus} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(parseFloat(e.target.value))}
                  className="w-full accent-[#C18C5D] cursor-pointer"
                />
              </div>

              {/* Potassium (K) */}
              <div>
                <div className="flex justify-between text-[#2C2C24] font-bold mb-1.5">
                  <span>{t('soil_potassium')}</span>
                  <span className="font-serif text-[#78786C] font-bold text-sm">{potassium} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="350"
                  value={potassium}
                  onChange={(e) => setPotassium(parseFloat(e.target.value))}
                  className="w-full accent-[#78786C] cursor-pointer"
                />
              </div>

              {/* Soil pH */}
              <div>
                <div className="flex justify-between text-[#2C2C24] font-bold mb-1.5">
                  <span>{t('soil_ph')}</span>
                  <span className="font-serif text-[#A85448] font-bold text-sm">{ph}</span>
                </div>
                <input
                  type="range"
                  min="4.5"
                  max="9.0"
                  step="0.1"
                  value={ph}
                  onChange={(e) => setPh(parseFloat(e.target.value))}
                  className="w-full accent-[#A85448] cursor-pointer"
                />
              </div>

              {/* Organic Carbon */}
              <div>
                <div className="flex justify-between text-[#2C2C24] font-bold mb-1.5">
                  <span>{t('soil_oc')}</span>
                  <span className="font-serif text-[#5D7052] font-bold text-sm">{organicCarbon}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.0"
                  step="0.05"
                  value={organicCarbon}
                  onChange={(e) => setOrganicCarbon(parseFloat(e.target.value))}
                  className="w-full accent-[#5D7052] cursor-pointer"
                />
              </div>

              <button
                onClick={handleCalculate}
                disabled={loading}
                className="w-full mt-3 py-3.5 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#F3F4F1] font-bold text-xs shadow-soft transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
              >
                {loading ? 'Simulating Depletion...' : t('soil_calculate')}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Health Gauge, Depletion Curve & Rotation Rec (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Soil Score & Risk Metric Cards */}
          {scoreData && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft text-center">
                <span className="text-[11px] text-[#78786C] font-bold uppercase tracking-wider block">
                  Soil Health Index
                </span>
                <div className="mt-2 text-3xl font-bold text-[#2C2C24] font-serif flex items-center justify-center gap-1.5">
                  <span>{scoreData.score}</span>
                  <span className="text-sm text-[#78786C] font-sans font-normal">/100</span>
                </div>
                <span className="inline-block mt-2.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20">
                  {scoreData.risk_level} Risk
                </span>
              </div>

              <div className="p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft text-center">
                <span className="text-[11px] text-[#78786C] font-bold uppercase tracking-wider block">
                  Yield Decline Probability
                </span>
                <div className="mt-2 text-3xl font-bold text-[#C18C5D] font-serif">
                  {scoreData.yield_decline_probability_pct}%
                </div>
                <span className="text-[11px] text-[#78786C] block mt-2 font-medium">Under continuous monoculture</span>
              </div>

              <div className="p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft text-center">
                <span className="text-[11px] text-[#78786C] font-bold uppercase tracking-wider block">
                  Est. Economic Loss Risk
                </span>
                <div className="mt-2 text-3xl font-bold text-[#A85448] font-serif">
                  ₹{scoreData.estimated_economic_loss_per_acre_inr.toLocaleString()}
                </div>
                <span className="text-[11px] text-[#78786C] block mt-2 font-medium">Per acre / season without rotation</span>
              </div>
            </div>
          )}

          {/* 3-Season Nutrient Trajectory Chart */}
          <div className="p-7 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#2C2C24] font-serif flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-[#5D7052]" />
                  <span>3-Season Soil Health Trajectory (Monoculture vs Smart Rotation)</span>
                </h3>
                <p className="text-xs text-[#78786C] mt-1 font-medium">
                  Nitrogen (kg/ha) and Overall Soil Score forecast over consecutive cropping cycles
                </p>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getCombinedChartData()}>
                  <defs>
                    <linearGradient id="colorRot" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5D7052" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#5D7052" stopOpacity={0.02}/>
                    </linearGradient>
                    <linearGradient id="colorMono" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A85448" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#A85448" stopOpacity={0.02}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DED8CF" strokeOpacity={0.6} />
                  <XAxis dataKey="season" stroke="#78786C" textAnchor="middle" fontSize={11} />
                  <YAxis stroke="#78786C" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FEFEFA', borderColor: '#DED8CF', borderRadius: '1rem', fontSize: '11px', boxShadow: '0 4px 20px -2px rgba(93,112,82,0.15)' }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="rot_n" name="Smart Rotation Available N (kg/ha)" stroke="#5D7052" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRot)" />
                  <Area type="monotone" dataKey="mono_n" name="Monoculture Depletion N (kg/ha)" stroke="#A85448" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMono)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Crop Rotation Recommendation */}
          {rotationData && rotationData.recommended_rotation && (
            <div className="p-7 rounded-[2.25rem] bg-gradient-to-br from-[#FEFEFA] to-[#5D7052]/5 border border-[#5D7052]/30 shadow-soft">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-[#2C2C24] font-serif flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#5D7052]" />
                  <span>{t('soil_rotation_rec')}</span>
                </h3>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20">
                  Biological Restoration
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FEFEFA] border border-[#DED8CF] shadow-sm">
                  <span className="text-[10px] text-[#78786C] font-bold uppercase block">Recommended Next Sowing</span>
                  <span className="font-bold text-[#2C2C24] text-base mt-1 block font-serif">
                    {rotationData.recommended_rotation.next_crop}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FEFEFA] border border-[#DED8CF] shadow-sm">
                  <span className="text-[10px] text-[#78786C] font-bold uppercase block">Atmospheric N Fixed</span>
                  <span className="font-bold text-[#5D7052] text-base mt-1 block font-serif">
                    +{rotationData.recommended_rotation.nitrogen_fixation_kg_ha} kg/ha
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FEFEFA] border border-[#DED8CF] shadow-sm">
                  <span className="text-[10px] text-[#78786C] font-bold uppercase block">Est. Economic Gain</span>
                  <span className="font-bold text-[#C18C5D] text-base mt-1 block font-serif">
                    +₹{rotationData.recommended_rotation.economic_benefit_inr_acre.toLocaleString()} / acre
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#2C2C24] leading-relaxed bg-[#FEFEFA] p-4 rounded-2xl border border-[#DED8CF]/60">
                💡 <span className="font-bold text-[#5D7052]">Agronomic Rationale:</span> {rotationData.recommended_rotation.rationale}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

