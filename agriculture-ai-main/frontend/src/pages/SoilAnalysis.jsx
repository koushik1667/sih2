import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { inView, animate, stagger } from 'motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Beaker, Leaf, TrendingDown, ArrowLeft, AlertTriangle, IndianRupee } from 'lucide-react';
import { farmsAPI, predictionsAPI } from '../services/api';

export default function SoilAnalysis() {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const [farm, setFarm] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [rotation, setRotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const yieldRef = useRef(null);
  const rotationRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: farmData } = await farmsAPI.getOne(farmId);
        setFarm(farmData);
        const { data: predData } = await predictionsAPI.analyze(farmData);
        setPrediction(predData);
        const { data: rotData } = await predictionsAPI.getRotation(farmData);
        setRotation(rotData);
      } catch (err) {
        console.error(err);
        setError('Failed to load analysis. Make sure all services are running.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [farmId]);

  useEffect(() => {
    if (!yieldRef.current || !prediction) return;
    const target = Number(prediction.yieldDeclineProbability) || 0;
    const stop = inView(yieldRef.current, () => {
      animate(0, target, {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
        onUpdate(v) {
          if (yieldRef.current) yieldRef.current.textContent = Math.round(v);
        },
      });
    });
    return stop;
  }, [prediction]);

  useEffect(() => {
    if (!rotationRef.current || !rotation) return;
    const stop = inView(rotationRef.current, () => {
      animate(
        rotationRef.current.querySelectorAll('.rotation-card'),
        { opacity: [0, 1], y: [20, 0] },
        { delay: stagger(0.1), duration: 0.5, ease: [0.16, 1, 0.3, 1] }
      );
    }, { amount: 0.15 });
    return stop;
  }, [rotation]);

  const spring = { type: 'spring', stiffness: 80, damping: 16 };
  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: spring },
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-neutral-950 flex flex-col items-center justify-center gap-5">
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-brand/30 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
            className="relative z-10 w-10 h-10 rounded-full border-2 border-brand/20 border-t-brand"
          />
        </div>
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-neutral-500 text-sm tracking-wide"
        >
          Analysing soil data…
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[100dvh] bg-neutral-950 flex items-center justify-center text-red-400 font-medium gap-2">
        <AlertTriangle className="w-5 h-5" /> {error}
      </div>
    );
  }

  const chartData = prediction?.nutrientDepletion?.N?.projected?.map((_, i) => ({
    season: `S${i + 1}`,
    N: prediction.nutrientDepletion.N.projected[i],
    P: prediction.nutrientDepletion.P.projected[i],
    K: prediction.nutrientDepletion.K.projected[i],
  })) || [];

  return (
    <div className="min-h-[100dvh] bg-neutral-950 px-4 py-8 md:p-12 text-white font-sans relative">
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-brand/6 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/farms')}
            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors duration-300 font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Farms
          </button>
        </motion.div>

        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                animate={{ boxShadow: ['0 0 0px rgba(16,185,129,0)', '0 0 24px rgba(16,185,129,0.4)', '0 0 0px rgba(16,185,129,0)'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center border border-brand/25"
              >
                <Activity className="w-6 h-6 text-brand" />
              </motion.div>
              <h1 className="text-4xl tracking-tighter font-semibold text-white">Soil Intelligence</h1>
            </div>
            <p className="text-neutral-500 max-w-[50ch] text-base">
              Farm{' '}
              <span className="font-mono text-neutral-300 bg-neutral-800/80 px-2 py-0.5 rounded-md">
                #{farmId.slice(-6)}
              </span>{' '}
              — Real-time predictive metrics and rotation guidance.
            </p>
          </motion.div>
        </header>

        <motion.div
          variants={staggerVariants} initial="hidden" animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Risk Overview */}
          <motion.div variants={itemVariants} className="lg:col-span-4 bg-neutral-900/80 backdrop-blur-sm rounded-[2rem] p-8 border border-white/[0.07] shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)]">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-amber-400" /> Risk Assessment
            </h2>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2">Overall Health Risk</p>
                <div className={`px-3 py-1.5 inline-flex rounded-lg font-semibold text-sm ${prediction?.riskScore === 'Low' ? 'bg-brand/15 text-brand' : 'bg-red-500/15 text-red-400'}`}>
                  {prediction?.riskScore}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">Yield Decline Prob.</p>
                <div className="flex items-baseline gap-1">
                  <span ref={yieldRef} className="text-4xl font-semibold tracking-tighter text-white">
                    {prediction?.yieldDeclineProbability}
                  </span>
                  <span className="text-neutral-500 text-lg">%</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">Econ. Impact Est.</p>
                <div className="flex items-baseline gap-1 text-red-400 font-medium">
                  <IndianRupee className="w-4 h-4" />
                  <span className="text-2xl">{prediction?.economicLoss}</span>
                  <span className="text-sm font-normal text-neutral-500">/acre</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">Recovery Timeline</p>
                <p className="text-lg font-medium text-white">
                  {prediction?.soilRecoveryTimeline}{' '}
                  <span className="text-neutral-500 font-normal">months</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-8 bg-neutral-900/80 backdrop-blur-sm rounded-[2rem] p-8 border border-white/[0.07] shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)] flex flex-col">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
              <TrendingDown className="w-5 h-5 text-neutral-400" /> Depletion Trend
            </h2>
            <div className="flex-grow w-full min-h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                  <XAxis dataKey="season" axisLine={false} tickLine={false} tick={{ fill: '#525252', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#525252', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: '#171717', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', color: '#fff' }}
                    labelStyle={{ color: '#a3a3a3' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', color: '#737373' }} />
                  <Line type="monotone" dataKey="N" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="P" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="K" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Rotation */}
          <motion.div variants={itemVariants} className="lg:col-span-12 bg-neutral-900/80 backdrop-blur-sm rounded-[2rem] p-8 border border-white/[0.07] shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)]">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
              <Leaf className="w-5 h-5 text-brand" /> Rotation Intelligence
            </h2>
            <div ref={rotationRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {rotation?.recommendations?.map((rec, i) => (
                <div
                  key={i}
                  className="rotation-card bg-neutral-800/60 rounded-[1.5rem] p-6 border border-white/[0.06] hover:border-brand/30 transition-colors"
                >
                  <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center text-sm font-semibold tracking-tight mb-4 border border-white/[0.08] text-neutral-300">
                    {rec.season}
                  </div>
                  <h3 className="text-base font-semibold tracking-tight mb-2 text-white">{rec.crop}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{rec.reason}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
