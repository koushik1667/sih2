import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Droplets, ArrowRight, Plus, Sprout, ArrowLeft } from 'lucide-react';
import { farmsAPI } from '../services/api';
import ParticleField from '../components/ParticleField';
import TiltCard from '../components/TiltCard';
import TextReveal from '../components/TextReveal';

export default function FarmsList() {
  const [farms, setFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    farmsAPI.getAll()
      .then(({ data }) => setFarms(data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const spring = { type: 'spring', stiffness: 75, damping: 14, mass: 0.9 };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: spring },
  };

  return (
    <div className="min-h-[100dvh] bg-neutral-950 px-4 py-8 md:p-12 text-white font-sans relative overflow-hidden">

      {/* Particle bg */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <ParticleField count={40} className="w-full h-full" />
      </div>

      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-brand/7 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors duration-300 text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </motion.div>

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-brand text-xs font-semibold tracking-widest uppercase mb-3"
            >
              Land Registry
            </motion.p>
            <h1 className="text-4xl md:text-5xl tracking-tighter font-semibold text-white mb-2">
              <TextReveal delay={0.05}>Farm Directory</TextReveal>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-neutral-500 max-w-[40ch]"
            >
              Select a land zone to run deep predictive soil intelligence and rotation modelling.
            </motion.p>
          </div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/farms/add')}
            className="group px-6 py-3 bg-brand text-neutral-950 rounded-full font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(16,185,129,0.3)]"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            Register New Farm
          </motion.button>
        </header>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-neutral-900/60 border border-white/[0.06] rounded-[2rem] h-64 animate-pulse" />
              ))}
            </motion.div>
          ) : farms.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={spring}
              className="text-center py-24 bg-neutral-900/50 rounded-[2rem] border border-white/[0.06]"
            >
              <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sprout className="w-8 h-8 text-neutral-500" />
              </div>
              <h3 className="text-xl font-medium tracking-tight mb-2 text-white">No Farms Found</h3>
              <p className="text-neutral-500 mb-6 max-w-[30ch] mx-auto">You haven't registered any land yet. Add a farm to start running analysis.</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              style={{ perspective: '1200px' }}
            >
              {farms.map((farm) => (
                <motion.div key={farm._id} variants={cardVariants}>
                  <TiltCard intensity={4} className="h-full">
                    <div className="group relative bg-neutral-900/80 backdrop-blur-sm rounded-[2rem] p-8 border border-white/[0.07] shadow-[0_10px_40px_-20px_rgba(0,0,0,0.4)] hover:border-brand/30 transition-colors duration-500 h-full">

                      <div className="absolute inset-0 bg-gradient-to-br from-brand/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] pointer-events-none" />

                      <div className="absolute top-0 right-0 p-6 text-white/5 group-hover:text-brand/15 transition-colors duration-500">
                        <Map className="w-24 h-24 translate-x-4 -translate-y-4" />
                      </div>

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-8">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-brand/15 text-brand flex items-center justify-center border border-brand/25">
                              <Map className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-mono text-neutral-500 bg-neutral-800 px-2 py-1 rounded-md">
                              #{farm._id.slice(-6)}
                            </span>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">Land Size</p>
                              <p className="text-lg font-medium text-white">{farm.landSize} <span className="text-neutral-500 text-base font-normal">acres</span></p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">Irrigation</p>
                              <div className="flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-blue-400" />
                                <p className="text-base font-medium text-white capitalize">{farm.irrigationType.replace('_', ' ')}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/analysis/${farm._id}`)}
                          className="mt-auto pt-6 border-t border-white/[0.06] flex items-center justify-between text-neutral-500 group-hover:text-brand transition-colors"
                        >
                          <span className="font-semibold text-sm">Run AI Analysis</span>
                          <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center group-hover:bg-brand group-hover:text-neutral-950 transition-all group-hover:translate-x-1 duration-300">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
