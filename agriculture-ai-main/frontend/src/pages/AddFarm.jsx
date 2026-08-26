import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Map, Droplets, FlaskConical } from 'lucide-react';
import { farmsAPI } from '../services/api';
import TextReveal from '../components/TextReveal';

export default function AddFarm() {
  const [formData, setFormData] = useState({
    landSize: '',
    irrigationType: 'rainfed',
    currentSoilHealth: { N: '', P: '', K: '', pH: '', organicCarbon: '' },
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const setSoil = (field) => (e) =>
    setFormData(f => ({ ...f, currentSoilHealth: { ...f.currentSoilHealth, [field]: e.target.value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        landSize: Number(formData.landSize),
        currentSoilHealth: {
          N: Number(formData.currentSoilHealth.N),
          P: Number(formData.currentSoilHealth.P),
          K: Number(formData.currentSoilHealth.K),
          pH: Number(formData.currentSoilHealth.pH),
          organicCarbon: Number(formData.currentSoilHealth.organicCarbon),
        },
      };
      await farmsAPI.create(payload);
      navigate('/farms');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const spring = { type: 'spring', stiffness: 80, damping: 16 };
  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: spring },
  };

  const inputClass = "w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all";
  const labelClass = "text-sm font-medium text-neutral-300 block mb-2";

  return (
    <div className="min-h-[100dvh] bg-neutral-950 px-4 py-8 md:p-12 text-white font-sans relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-brand/6 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[45vw] h-[45vw] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/farms')}
            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors duration-300 font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Cancel & Return
          </button>
        </motion.div>

        {/* Header */}
        <header className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-brand text-xs font-semibold tracking-widest uppercase mb-3"
          >
            New Entry
          </motion.p>
          <h1 className="text-4xl tracking-tighter font-semibold text-white mb-2">
            <TextReveal delay={0.05}>Register Farm</TextReveal>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-neutral-500 max-w-[50ch]"
          >
            Input field dimensions and initial soil chemistry to establish a baseline for your predictive models.
          </motion.p>
        </header>

        <form onSubmit={handleSubmit}>
          <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-6">

            {/* Spatial Data card */}
            <motion.div
              variants={item}
              className="bg-neutral-900/80 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 border border-white/[0.07] shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 text-white/[0.04] pointer-events-none">
                <Map className="w-32 h-32 translate-x-4 -translate-y-4" />
              </div>

              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 relative z-10">
                <Map className="w-5 h-5 text-brand" /> Spatial Data
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                <div>
                  <label className={labelClass}>
                    Land Size <span className="text-neutral-500 font-normal">(Acres)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.landSize}
                    onChange={e => setFormData(f => ({ ...f, landSize: e.target.value }))}
                    required step="0.1"
                    className={inputClass}
                    placeholder="e.g. 12.5"
                  />
                </div>

                <div>
                  <label className={labelClass + ' flex items-center gap-2'}>
                    <Droplets className="w-4 h-4 text-blue-400" /> Irrigation Type
                  </label>
                  <select
                    value={formData.irrigationType}
                    onChange={e => setFormData(f => ({ ...f, irrigationType: e.target.value }))}
                    className={inputClass + ' appearance-none'}
                  >
                    <option value="rainfed">Rainfed</option>
                    <option value="canal">Canal</option>
                    <option value="drip">Drip</option>
                    <option value="sprinkler">Sprinkler</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Soil Chemistry card */}
            <motion.div
              variants={item}
              className="bg-neutral-900/80 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 border border-white/[0.07] shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)]"
            >
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-amber-400" /> Initial Soil Chemistry Profile
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {[
                  { label: 'Nitrogen (N)', unit: 'kg/acre', field: 'N', accent: 'brand' },
                  { label: 'Phosphorus (P)', unit: 'kg/acre', field: 'P', accent: 'blue' },
                  { label: 'Potassium (K)', unit: 'kg/acre', field: 'K', accent: 'amber' },
                  { label: 'pH Level', unit: null, field: 'pH', accent: 'amber' },
                  { label: 'Organic Carbon', unit: '%', field: 'organicCarbon', accent: 'amber' },
                ].map(({ label, unit, field }) => (
                  <div key={field}>
                    <label className={labelClass}>
                      {label}
                      {unit && <span className="text-neutral-500 font-normal ml-1 text-xs">{unit}</span>}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.currentSoilHealth[field]}
                      onChange={setSoil(field)}
                      className={inputClass}
                      placeholder="0.0"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div variants={item} className="pt-2 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(16,185,129,0.25)' }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                disabled={isLoading}
                className="group px-8 py-4 bg-brand text-neutral-950 rounded-xl font-semibold text-base flex items-center gap-3 disabled:opacity-60 shadow-[0_4px_24px_rgba(16,185,129,0.2)]"
              >
                {isLoading ? 'Processing Data...' : 'Finalize Baseline & Save Farm'}
                {!isLoading && (
                  <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
              </motion.button>
            </motion.div>

          </motion.div>
        </form>
      </div>
    </div>
  );
}
