import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Sprout, ArrowRight } from 'lucide-react';
import { authAPI } from '../services/api';
import ParticleField from '../components/ParticleField';
import TextReveal from '../components/TextReveal';

export default function Register({ setAuth }) {
  const [formData, setFormData] = useState({
    name: '', phone: '', password: '', district: '', state: '', village: '', language: 'en'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const set = (field) => (e) => setFormData(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await authAPI.register(formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuth(true);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all";
  const labelClass = "text-sm font-medium text-neutral-300 block mb-2";

  return (
    <div className="min-h-[100dvh] w-full flex font-sans overflow-hidden">

      {/* ── Brand panel ─────────────────────────────── */}
      <div className="hidden lg:flex w-1/3 relative bg-neutral-950 items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ParticleField count={50} color="245, 158, 11" className="w-full h-full" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,rgba(10,10,10,0.78)_0%,transparent_100%)] pointer-events-none" />
        <div className="absolute w-[40vw] h-[40vw] bg-amber-500/10 rounded-full blur-[130px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-xs mx-auto px-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.07, 1],
              boxShadow: ['0 0 0px rgba(245,158,11,0)', '0 0 32px rgba(245,158,11,0.45)', '0 0 0px rgba(245,158,11,0)'],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.5 }}
            className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-amber-500/30"
          >
            <Sprout className="w-8 h-8 text-amber-400" />
          </motion.div>

          <h1 className="text-4xl font-semibold tracking-tighter text-white mb-4 leading-tight">
            <TextReveal delay={0.35}>Join the Network.</TextReveal>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="text-neutral-400 text-sm leading-relaxed"
          >
            Create an account to scale your agricultural capabilities using predictive AI.
          </motion.p>
        </motion.div>
      </div>

      {/* ── Form panel ──────────────────────────────── */}
      <div className="w-full lg:w-2/3 flex items-center justify-center bg-neutral-950 p-6 sm:p-10 md:p-14 relative overflow-y-auto">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center mb-8 shadow-[0_0_24px_rgba(245,158,11,0.4)]">
            <Sprout className="w-6 h-6 text-white" />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl font-semibold tracking-tight text-white mb-2"
          >
            Create Account
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-neutral-500 mb-10"
          >
            Register to get started with AgriTech AI.
          </motion.p>

          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {/* Full name */}
              <div className="md:col-span-2 space-y-1">
                <label className={labelClass}>{t('name')}</label>
                <input type="text" value={formData.name} onChange={set('name')} required className={inputClass} placeholder="Full Name" />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className={labelClass}>{t('phone')}</label>
                <input type="tel" value={formData.phone} onChange={set('phone')} required className={inputClass} placeholder="Phone Number" />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className={labelClass}>{t('password')}</label>
                <input type="password" value={formData.password} onChange={set('password')} required className={inputClass} placeholder="••••••••" />
              </div>

              {/* Language */}
              <div className="space-y-1">
                <label className={labelClass}>Language Preference</label>
                <select value={formData.language} onChange={set('language')} className={inputClass + ' appearance-none'}>
                  <option value="en">English</option>
                  <option value="kn">ಕನ್ನಡ</option>
                  <option value="hi">हिंदी</option>
                  <option value="ta">தமிழ்</option>
                  <option value="te">తెలుగు</option>
                </select>
              </div>

              {/* State */}
              <div className="space-y-1">
                <label className={labelClass}>{t('state')}</label>
                <input type="text" value={formData.state} onChange={set('state')} required className={inputClass} placeholder="State" />
              </div>

              {/* District */}
              <div className="space-y-1">
                <label className={labelClass}>{t('district')}</label>
                <input type="text" value={formData.district} onChange={set('district')} required className={inputClass} placeholder="District" />
              </div>

              {/* Village */}
              <div className="space-y-1">
                <label className={labelClass}>{t('village')} <span className="text-neutral-600 font-normal">(Optional)</span></label>
                <input type="text" value={formData.village} onChange={set('village')} className={inputClass} placeholder="Village" />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="md:col-span-2 text-red-400 text-sm font-medium"
                >
                  {error}
                </motion.p>
              )}

              <div className="md:col-span-2 mt-2">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(16,185,129,0.25)' }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isLoading}
                  className="group w-full py-3.5 px-4 bg-brand text-neutral-950 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 shadow-[0_4px_24px_rgba(16,185,129,0.2)]"
                >
                  {isLoading ? 'Creating Account...' : t('register')}
                  {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </motion.button>
              </div>

              <div className="md:col-span-2 text-center mt-2">
                <p className="text-neutral-600 text-sm">
                  Already registered?{' '}
                  <button type="button" onClick={() => navigate('/login')} className="text-brand font-medium hover:underline">
                    {t('login')}
                  </button>
                </p>
              </div>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
