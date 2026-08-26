import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Sprout, ArrowRight } from 'lucide-react';
import { authAPI } from '../services/api';
import ParticleField from '../components/ParticleField';
import TextReveal from '../components/TextReveal';

export default function Login({ setAuth }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await authAPI.login({ phone, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAuth(true);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex font-sans overflow-hidden">

      {/* ── Brand panel ─────────────────────────────── */}
      <div className="hidden lg:flex w-1/2 relative bg-neutral-950 items-center justify-center overflow-hidden">

        {/* Particle network fills the whole panel */}
        <div className="absolute inset-0">
          <ParticleField count={65} className="w-full h-full" />
        </div>

        {/* Radial overlay so text stays readable */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,rgba(10,10,10,0.75)_0%,transparent_100%)] pointer-events-none" />

        {/* Glow blob */}
        <div className="absolute w-[45vw] h-[45vw] bg-brand/12 rounded-full blur-[130px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-md mx-auto px-8"
        >
          <motion.div
            animate={{
              scale: [1, 1.07, 1],
              boxShadow: [
                '0 0 0px rgba(16,185,129,0)',
                '0 0 36px rgba(16,185,129,0.5)',
                '0 0 0px rgba(16,185,129,0)',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.5 }}
            className="w-20 h-20 bg-brand/20 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-brand/35"
          >
            <Sprout className="w-10 h-10 text-brand" />
          </motion.div>

          <h1 className="text-5xl font-semibold tracking-tighter text-white mb-6 leading-tight">
            <TextReveal delay={0.45}>Intelligent Farming,</TextReveal>
            <br />
            <span className="text-neutral-500">
              <TextReveal delay={0.65}>Perfectly Managed.</TextReveal>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="text-neutral-400 text-base leading-relaxed"
          >
            Discover deep soil insights and optimize your crop rotation effortlessly.
          </motion.p>
        </motion.div>
      </div>

      {/* ── Form panel ──────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-neutral-950 p-8 sm:p-12 md:p-24 relative">
        <div className="absolute top-0 right-0 w-[55vw] h-[55vw] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden w-12 h-12 bg-brand rounded-xl flex items-center justify-center mb-8 shadow-[0_0_24px_rgba(16,185,129,0.4)]">
            <Sprout className="w-6 h-6 text-white" />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl font-semibold tracking-tight text-white mb-2"
          >
            Welcome Back
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22, duration: 0.6 }}
            className="text-neutral-500 mb-10"
          >
            Sign in to your AgriTech AI dashboard.
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: t('phone'), type: 'text', value: phone, set: setPhone, ph: 'Enter your phone number' },
              { label: t('password'), type: 'password', value: password, set: setPassword, ph: '••••••••' },
            ].map(({ label, type, value, set, ph }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-2"
              >
                <label className="text-sm font-medium text-neutral-300 block">{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={e => set(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-all"
                  placeholder={ph}
                />
              </motion.div>
            ))}

            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-400 text-sm font-medium"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.54, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(16,185,129,0.25)' }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isLoading}
              className="group w-full py-3.5 px-4 bg-brand text-neutral-950 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? 'Signing in...' : t('login')}
              {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center pt-2"
            >
              <p className="text-neutral-600 text-sm">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-brand font-medium hover:underline"
                >
                  {t('register')}
                </button>
              </p>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
