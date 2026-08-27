import React, { useState, useEffect, useCallback } from 'react';
import { 
  TrendingDown, 
  TrendingUp,
  Sparkles,
  FlaskConical,
  RotateCcw,
  Coins,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { 
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
import { useApp, calcSoilScoreLocal } from '../context/AppContext';
import { historyService } from '../services/historyService';

const CROP_ECONOMICS = {
  Wheat: { baseRevenue: 44000, costOfCultivation: 16000, targetYield: "24 Q/Ac" },
  Rice: { baseRevenue: 52000, costOfCultivation: 19000, targetYield: "32 Q/Ac" },
  Cotton: { baseRevenue: 72000, costOfCultivation: 24000, targetYield: "14 Q/Ac" },
  Sugarcane: { baseRevenue: 92000, costOfCultivation: 34000, targetYield: "55 T/Ac" },
  Soybean: { baseRevenue: 46000, costOfCultivation: 15000, targetYield: "12 Q/Ac" },
  Chickpea: { baseRevenue: 44000, costOfCultivation: 13000, targetYield: "10 Q/Ac" },
  Maize: { baseRevenue: 40000, costOfCultivation: 14000, targetYield: "28 Q/Ac" },
  Mustard: { baseRevenue: 42000, costOfCultivation: 12000, targetYield: "10 Q/Ac" }
};

export const SoilPrecision = () => {
  const { t } = useLanguage();
  const { selectedFarm } = useApp();

  const getSavedSoil = () => {
    try {
      const s = localStorage.getItem('agrisphere_soil_params');
      return s ? JSON.parse(s) : null;
    } catch (_) {
      return null;
    }
  };

  const savedParams = getSavedSoil();

  const [crop, setCrop] = useState(() => savedParams?.crop || 'Wheat');
  const [nitrogen, setNitrogen] = useState(() => savedParams?.nitrogen ?? 165);
  const [phosphorus, setPhosphorus] = useState(() => savedParams?.phosphorus ?? 24);
  const [potassium, setPotassium] = useState(() => savedParams?.potassium ?? 140);
  const [ph, setPh] = useState(() => savedParams?.ph ?? 6.8);
  const [organicCarbon, setOrganicCarbon] = useState(() => savedParams?.organicCarbon ?? 0.85);
  const [moisture, setMoisture] = useState(() => savedParams?.moisture ?? 35);

  const [scoreData, setScoreData] = useState(() => {
    if (savedParams?.scoreData) return savedParams.scoreData;
    const local = calcSoilScoreLocal(165, 24, 140, 6.8, 0.85);
    const eco = CROP_ECONOMICS['Wheat'];
    const healthMultiplier = local.score >= 80 ? 1.15 : local.score >= 60 ? 0.95 : 0.75;
    const estRev = Math.round(eco.baseRevenue * healthMultiplier);
    const estCost = Math.round(eco.costOfCultivation * (local.score >= 80 ? 0.9 : local.score >= 60 ? 1.0 : 1.15));
    const netProfit = Math.max(8000, estRev - estCost);
    const lossInr = local.score >= 80 ? 1200 : local.score >= 60 ? 4500 : 9800;
    const rotationProfitBoost = local.score >= 80 ? 7500 : local.score >= 60 ? 11200 : 16400;

    return {
      score: local.score,
      risk_level: local.risk_level,
      yield_decline_probability_pct: local.score >= 80 ? 8 : local.score >= 60 ? 24 : 58,
      estimated_economic_loss_per_acre_inr: lossInr,
      estimated_net_profit_per_acre_inr: netProfit,
      gross_revenue_inr: estRev,
      input_cost_inr: estCost,
      smart_rotation_profit_boost_inr: rotationProfitBoost
    };
  });

  const [depletionData, setDepletionData] = useState(() => {
    if (savedParams?.depletionData) return savedParams.depletionData;
    return {
      monoculture_drawdown: [
        { season: 'Season 1 (Wheat)', nitrogen: 133, phosphorus: 19, potassium: 122, soil_health_score: 67 },
        { season: 'Season 2 (Wheat)', nitrogen: 101, phosphorus: 13, potassium: 104, soil_health_score: 56 },
        { season: 'Season 3 (Wheat)', nitrogen: 69, phosphorus: 8, potassium: 86, soil_health_score: 45 }
      ],
      smart_rotation_trajectory: [
        { season: 'Season 1 (Wheat)', nitrogen: 147, phosphorus: 21, potassium: 130, soil_health_score: 82 },
        { season: 'Season 2 (Chickpea)', nitrogen: 192, phosphorus: 19, potassium: 126, soil_health_score: 87 },
        { season: 'Season 3 (Wheat/Mustard)', nitrogen: 174, phosphorus: 16, potassium: 116, soil_health_score: 91 }
      ]
    };
  });

  const [rotationData, setRotationData] = useState(() => {
    if (savedParams?.rotationData) return savedParams.rotationData;
    return {
      recommended_rotation: {
        next_crop: "Chickpea (Gram / Chana)",
        nitrogen_fixation_kg_ha: 42,
        economic_benefit_inr_acre: 6400,
        rationale: "Planting a leguminous pulse introduces Rhizobium symbiosis, replenishing up to 42 kg/ha atmospheric nitrogen while breaking pest life cycles."
      }
    };
  });

  // Persist all soil parameters and results to localStorage
  useEffect(() => {
    try {
      const dataToSave = {
        crop,
        nitrogen,
        phosphorus,
        potassium,
        ph,
        organicCarbon,
        moisture,
        scoreData,
        depletionData,
        rotationData
      };
      localStorage.setItem('agrisphere_soil_params', JSON.stringify(dataToSave));
    } catch (_) {}
  }, [crop, nitrogen, phosphorus, potassium, ph, organicCarbon, moisture, scoreData, depletionData, rotationData]);

  const [loading, setLoading] = useState(false);

  const handleCalculate = useCallback(async () => {
    setLoading(true);

    // Compute local instantly
    const local = calcSoilScoreLocal(nitrogen, phosphorus, potassium, ph, organicCarbon);
    const declineProb = local.score >= 80 ? 8 : local.score >= 60 ? 24 : 58;
    const lossInr = local.score >= 80 ? 1200 : local.score >= 60 ? 4500 : 9800;

    const eco = CROP_ECONOMICS[crop] || CROP_ECONOMICS.Wheat;
    const healthMultiplier = local.score >= 80 ? 1.15 : local.score >= 60 ? 0.95 : 0.75;
    const estRev = Math.round(eco.baseRevenue * healthMultiplier);
    const estCost = Math.round(eco.costOfCultivation * (local.score >= 80 ? 0.9 : local.score >= 60 ? 1.0 : 1.15));
    const netProfit = Math.max(8000, estRev - estCost);
    const rotationProfitBoost = local.score >= 80 ? 7500 : local.score >= 60 ? 11200 : 16400;

    const mono1N = Math.max(30, Math.round(nitrogen - 32));
    const mono2N = Math.max(30, Math.round(nitrogen - 64));
    const mono3N = Math.max(30, Math.round(nitrogen - 96));

    const rot1N = Math.max(40, Math.round(nitrogen - 18));
    const rot2N = Math.min(260, Math.round(rot1N + 45));
    const rot3N = Math.max(120, Math.round(rot2N - 18));

    setScoreData({
      score: local.score,
      risk_level: local.risk_level,
      yield_decline_probability_pct: declineProb,
      estimated_economic_loss_per_acre_inr: lossInr,
      estimated_net_profit_per_acre_inr: netProfit,
      gross_revenue_inr: estRev,
      input_cost_inr: estCost,
      smart_rotation_profit_boost_inr: rotationProfitBoost
    });

    setDepletionData({
      monoculture_drawdown: [
        { season: `Season 1 (${crop})`, nitrogen: mono1N, phosphorus: Math.max(8, Math.round(phosphorus - 5)), potassium: Math.max(40, Math.round(potassium - 18)), soil_health_score: Math.max(35, Math.round(local.score - 11)) },
        { season: `Season 2 (${crop})`, nitrogen: mono2N, phosphorus: Math.max(8, Math.round(phosphorus - 11)), potassium: Math.max(40, Math.round(potassium - 36)), soil_health_score: Math.max(30, Math.round(local.score - 22)) },
        { season: `Season 3 (${crop})`, nitrogen: mono3N, phosphorus: Math.max(8, Math.round(phosphorus - 16)), potassium: Math.max(40, Math.round(potassium - 54)), soil_health_score: Math.max(25, Math.round(local.score - 33)) }
      ],
      smart_rotation_trajectory: [
        { season: `Season 1 (${crop})`, nitrogen: rot1N, phosphorus: Math.max(10, Math.round(phosphorus - 3)), potassium: Math.max(60, Math.round(potassium - 10)), soil_health_score: Math.min(95, Math.round(local.score + 4)) },
        { season: `Season 2 (Chickpea/Legume)`, nitrogen: rot2N, phosphorus: Math.max(12, Math.round(phosphorus - 4)), potassium: Math.max(70, Math.round(potassium - 14)), soil_health_score: Math.min(95, Math.round(local.score + 9)) },
        { season: `Season 3 (${crop}/Mustard)`, nitrogen: rot3N, phosphorus: Math.max(14, Math.round(phosphorus - 7)), potassium: Math.max(80, Math.round(potassium - 24)), soil_health_score: Math.min(95, Math.round(local.score + 13)) }
      ]
    });

    // Also call API to get enriched recommendations
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
          soil_score: local.score,
          ph: parseFloat(ph),
          irrigation_type: "Canal/Borewell"
        })
      ]);

      if (scoreRes && scoreRes.score) {
        setScoreData(prev => ({
          ...prev,
          ...scoreRes,
          estimated_net_profit_per_acre_inr: netProfit,
          gross_revenue_inr: estRev,
          input_cost_inr: estCost,
          smart_rotation_profit_boost_inr: rotationProfitBoost
        }));
      }
      if (depletRes && depletRes.monoculture_drawdown) setDepletionData(depletRes);
      if (rotRes && rotRes.recommended_rotation) setRotationData(rotRes);
    } catch (err) {
      console.warn("Using local agronomic computation:", err);
    } finally {
      setLoading(false);

      // Log to universal history
      historyService.addEntry({
        type: "soil_precision",
        title: `Soil NPK Health & 3-Season ROI • ${crop}`,
        location: selectedFarm?.location || "Field Plot Basin",
        coordinates: selectedFarm?.coordinates ? { lat: selectedFarm.coordinates.lat || selectedFarm.coordinates.latitude, lon: selectedFarm.coordinates.lng || selectedFarm.coordinates.longitude } : { lat: 30.9010, lon: 75.8573 },
        summary: `Soil Score: ${local.score}/100 (${local.risk_level} Risk). Net profit ₹${netProfit.toLocaleString('en-IN')}/acre with +₹${rotationProfitBoost.toLocaleString('en-IN')} rotation gain.`,
        metrics: [
          { label: "Soil Score", value: `${local.score} / 100` },
          { label: "Standing Crop", value: crop },
          { label: "Net Profit / Ac", value: `₹${netProfit.toLocaleString('en-IN')}` },
          { label: "Rotation Gain", value: `+₹${rotationProfitBoost.toLocaleString('en-IN')}` }
        ],
        tags: ["Soil Health", "NPK Drawdown", "Legume Rotation"],
        details: {
          nitrogen: `${nitrogen} kg/ha`,
          phosphorus: `${phosphorus} kg/ha`,
          potassium: `${potassium} kg/ha`,
          ph: ph,
          organic_carbon: `${organicCarbon}%`,
          moisture: `${moisture}%`
        }
      });
    }
  }, [nitrogen, phosphorus, potassium, ph, organicCarbon, moisture, crop, selectedFarm]);

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
  }, [selectedFarm]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

        {selectedFarm && (
          <div className="px-4 py-2 rounded-full bg-[#FEFEFA] border border-[#DED8CF] shadow-soft text-xs text-[#2C2C24] flex items-center gap-2 self-start">
            <span className="w-2 h-2 rounded-full bg-[#5D7052]" />
            <span className="font-bold">Active: {selectedFarm.name}</span>
          </div>
        )}
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
                className="w-full mt-3 py-3.5 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#F3F4F1] font-bold text-xs shadow-soft transition-all hover:scale-102 active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Simulating Depletion...' : t('soil_calculate')}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Health Gauge, Depletion Curve & Rotation Rec (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Soil Score & Economics Metric Cards (4 Cards Grid) */}
          {scoreData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* 1. Soil Health Index */}
              <div className="p-5 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft text-center space-y-1">
                <span className="text-[10px] text-[#78786C] font-bold uppercase tracking-wider block">
                  Soil Health Index
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-[#2C2C24] font-serif flex items-center justify-center gap-1">
                  <span>{scoreData.score}</span>
                  <span className="text-xs text-[#78786C] font-sans font-normal">/100</span>
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20">
                  {scoreData.risk_level} Risk Level
                </span>
              </div>

              {/* 2. Estimated Net Profit per Acre */}
              <div className="p-5 rounded-[2rem] bg-gradient-to-br from-[#5D7052]/15 via-[#FEFEFA] to-[#5D7052]/5 border-2 border-[#5D7052]/40 shadow-soft text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-[10px] text-[#5D7052] font-bold uppercase tracking-wider">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Est. Net Profit / Acre</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#5D7052] font-serif">
                  ₹{scoreData.estimated_net_profit_per_acre_inr?.toLocaleString() || '28,000'}
                </div>
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#5D7052] text-white shadow-xs">
                  Optimal Precision Yield
                </span>
              </div>

              {/* 3. Monoculture Loss Risk */}
              <div className="p-5 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-[10px] text-[#A85448] font-bold uppercase tracking-wider">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Monoculture Loss Risk</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#A85448] font-serif">
                  -₹{scoreData.estimated_economic_loss_per_acre_inr?.toLocaleString() || '4,500'}
                </div>
                <span className="text-[10px] text-[#78786C] block font-medium">Without rotational resting</span>
              </div>

              {/* 4. Smart Rotation Profit Boost */}
              <div className="p-5 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft text-center space-y-1">
                <div className="flex items-center justify-center gap-1 text-[10px] text-[#C18C5D] font-bold uppercase tracking-wider">
                  <Coins className="w-3.5 h-3.5" />
                  <span>Rotation Profit Gain</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#C18C5D] font-serif">
                  +₹{scoreData.smart_rotation_profit_boost_inr?.toLocaleString() || '11,200'}
                </div>
                <span className="text-[10px] text-[#5D7052] block font-semibold">+35% ROI Restoration</span>
              </div>

            </div>
          )}

          {/* 🌟 Comprehensive Farm Economic Profit & Loss Ledger */}
          {scoreData && (
            <div className="p-6 rounded-[2.25rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DED8CF]/60">
                <div>
                  <h3 className="text-base font-bold text-[#2C2C24] font-serif flex items-center gap-2">
                    <Coins className="w-4 h-4 text-[#5D7052]" />
                    <span>Farm Economic Ledger: Profit vs Loss Comparative Analysis</span>
                  </h3>
                  <p className="text-xs text-[#78786C] mt-0.5">
                    Financial forecast per acre based on soil fertility status for <strong>{crop}</strong>
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20 self-start sm:self-auto">
                  Precision Agronomy ROI
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Traditional Monoculture (Loss Scenario) */}
                <div className="p-5 rounded-2xl bg-[#A85448]/5 border border-[#A85448]/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#A85448] flex items-center gap-1.5 uppercase tracking-wider">
                      <TrendingDown className="w-4 h-4" />
                      <span>Continuous Monoculture (Depleting)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#A85448]/15 text-[#A85448] text-[10px] font-bold">
                      High Drawdown
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#78786C]">
                      <span>Gross Crop Revenue:</span>
                      <strong className="text-[#2C2C24]">₹{Math.round(scoreData.gross_revenue_inr * 0.85)?.toLocaleString()} / Ac</strong>
                    </div>
                    <div className="flex items-center justify-between text-[#78786C]">
                      <span>Fertilizer &amp; Input Expenditure:</span>
                      <strong className="text-[#A85448]">₹{Math.round(scoreData.input_cost_inr * 1.15)?.toLocaleString()} / Ac</strong>
                    </div>
                    <div className="flex items-center justify-between text-[#78786C]">
                      <span>Soil Nutrient Depletion Loss:</span>
                      <strong className="text-[#A85448]">-₹{scoreData.estimated_economic_loss_per_acre_inr?.toLocaleString()} / Ac</strong>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#A85448]/20 text-sm font-bold text-[#2C2C24]">
                      <span>Net Farmer Profit:</span>
                      <span className="text-[#A85448] font-serif">
                        ₹{Math.max(4000, Math.round(scoreData.gross_revenue_inr * 0.85 - scoreData.input_cost_inr * 1.15 - scoreData.estimated_economic_loss_per_acre_inr))?.toLocaleString()} / Ac
                      </span>
                    </div>
                  </div>
                </div>

                {/* Precision NPK & Smart Rotation (Profit Maximized) */}
                <div className="p-5 rounded-2xl bg-[#5D7052]/10 border-2 border-[#5D7052]/40 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5D7052] flex items-center gap-1.5 uppercase tracking-wider">
                      <TrendingUp className="w-4 h-4" />
                      <span>Precision NPK + Rotation (Optimized)</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#5D7052] text-white text-[10px] font-bold">
                      +38% Net Gain
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#78786C]">
                      <span>Targeted Precision Gross Revenue:</span>
                      <strong className="text-[#2C2C24]">₹{scoreData.gross_revenue_inr?.toLocaleString()} / Ac</strong>
                    </div>
                    <div className="flex items-center justify-between text-[#78786C]">
                      <span>Optimized Input Cost (Dosing AI):</span>
                      <strong className="text-[#5D7052]">₹{scoreData.input_cost_inr?.toLocaleString()} / Ac</strong>
                    </div>
                    <div className="flex items-center justify-between text-[#78786C]">
                      <span>Bio-Fixation Savings (Rhizobium):</span>
                      <strong className="text-[#5D7052]">+₹3,400 / Ac</strong>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#5D7052]/30 text-sm font-bold text-[#2C2C24]">
                      <span>Maximized Net Farmer Profit:</span>
                      <span className="text-[#5D7052] font-serif font-extrabold text-base">
                        ₹{(scoreData.estimated_net_profit_per_acre_inr + 3400)?.toLocaleString()} / Ac
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* 3-Year Cumulative Wealth Advantage */}
              <div className="p-4 rounded-xl bg-[#F0EBE5]/50 border border-[#DED8CF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#5D7052] text-white flex items-center justify-center shrink-0 font-bold">
                    ₹
                  </div>
                  <div>
                    <span className="font-bold text-[#2C2C24] block">3-Season Cumulative Profit Forecast</span>
                    <span className="text-[#78786C] text-[11px]">Rotational harvest yields ₹1,48,000 / acre vs ₹86,000 / acre in monoculture</span>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-[#5D7052] text-white font-bold text-xs shrink-0 self-start sm:self-auto shadow-xs">
                  +₹62,000 / Acre Net Gain
                </span>
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
                    +₹{rotationData.recommended_rotation.economic_benefit_inr_acre?.toLocaleString() || '6,400'} / acre
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
