import React, { useState } from 'react';
import { 
  Sprout, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Satellite, 
  BarChart3, 
  Leaf, 
  Check, 
  Eye, 
  EyeOff,
  CloudSun,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { 
    loginWithGoogle, 
    loginWithEmail, 
    signupWithEmail, 
    resetPassword, 
    authError, 
    setAuthError 
  } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState(initialMode); // 'login', 'signup', 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [stateName, setStateName] = useState('Punjab');
  const [preferredCrop, setPreferredCrop] = useState('Wheat');
  
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [localError, setLocalError] = useState('');

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setGoogleSubmitting(true);
    setLocalError('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      setLocalError(err.message || "Google sign-in failed. Please try again.");
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');

    if (!email || !email.includes('@')) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    if (mode === 'forgot') {
      setSubmitting(true);
      try {
        await resetPassword(email);
        setSuccessMessage("Password reset email sent! Check your inbox.");
      } catch (err) {
        setLocalError(err.message || "Failed to send reset link.");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (!password || password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match.");
        return;
      }
      if (!displayName.trim()) {
        setLocalError("Please enter your name.");
        return;
      }

      setSubmitting(true);
      try {
        await signupWithEmail(email, password, displayName, {
          phone,
          state: stateName,
          preferredCrop
        });
        setSuccessMessage("Account created successfully!");
        setTimeout(() => {
          onClose();
        }, 800);
      } catch (err) {
        setLocalError(err.message || "Account creation failed.");
      } finally {
        setSubmitting(false);
      }
    } else {
      // Login
      setSubmitting(true);
      try {
        await loginWithEmail(email, password);
        setSuccessMessage("Welcome back to AgriSphere AI!");
        setTimeout(() => {
          onClose();
        }, 600);
      } catch (err) {
        setLocalError(err.message || "Login failed.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#2C2C24]/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#FEFEFA] border border-[#DED8CF] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Decorative Gradient Accents */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#5D7052]/10 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C18C5D]/10 rounded-full blur-2xl pointer-events-none -ml-12 -mb-12" />

        {/* Modal Header */}
        <div className="relative p-6 sm:p-8 pb-4 border-b border-[#DED8CF]/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#5D7052] text-[#F3F4F1] flex items-center justify-center shadow-soft">
                <Sprout className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#2C2C24] font-serif">
                  {mode === 'login' && "Welcome Back"}
                  {mode === 'signup' && "Create Farmer Account"}
                  {mode === 'forgot' && "Reset Password"}
                </h2>
                <p className="text-xs text-[#78786C] font-medium">
                  {mode === 'login' && "Sign in to sync your farm database, satellite tiles & AI telemetry"}
                  {mode === 'signup' && "Get your personal dedicated cloud database for precision farming"}
                  {mode === 'forgot' && "Enter your email to receive recovery instructions"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F0EBE5]/80 hover:bg-[#E6DCCD] text-[#78786C] hover:text-[#2C2C24] flex items-center justify-center transition"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex gap-2 mt-5 p-1 bg-[#F0EBE5]/70 rounded-full border border-[#DED8CF]">
            <button
              type="button"
              onClick={() => { setMode('login'); setLocalError(''); setSuccessMessage(''); }}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition ${
                mode === 'login'
                  ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft'
                  : 'text-[#78786C] hover:text-[#2C2C24]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setLocalError(''); setSuccessMessage(''); }}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition ${
                mode === 'signup'
                  ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft'
                  : 'text-[#78786C] hover:text-[#2C2C24]'
              }`}
            >
              New Register
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 pt-4 overflow-y-auto space-y-5">
          
          {/* Alerts / Error Messages */}
          {(localError || authError) && (
            <div className="p-3.5 rounded-2xl bg-[#A85448]/10 border border-[#A85448]/30 flex items-start gap-2.5 text-xs text-[#A85448]">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="font-semibold">{localError || authError}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-[#5D7052]/10 border border-[#5D7052]/30 flex items-start gap-2.5 text-xs text-[#5D7052]">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* 1-Click Google Sign In Button */}
          {mode !== 'forgot' && (
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleSubmitting || submitting}
                className="w-full py-3 px-4 rounded-2xl border border-[#DED8CF] bg-[#FEFEFA] hover:bg-[#F0EBE5] text-[#2C2C24] font-bold text-xs shadow-soft transition flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer group"
              >
                {googleSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-[#5D7052] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-[#DED8CF]/70" />
                <span className="px-3 text-[10px] uppercase font-bold text-[#78786C] tracking-wider">or with email</span>
                <div className="flex-grow border-t border-[#DED8CF]/70" />
              </div>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold text-[#2C2C24] mb-1 uppercase tracking-wider">
                    Full Name / Farmer Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#78786C] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Gurpreet Singh"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs text-[#2C2C24] placeholder-[#78786C]/60 focus:bg-[#FEFEFA] focus:border-[#5D7052] focus:ring-1 focus:ring-[#5D7052] outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#2C2C24] mb-1 uppercase tracking-wider">
                      State / Region
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-[#78786C] absolute left-3 top-3" />
                      <select
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs text-[#2C2C24] focus:bg-[#FEFEFA] focus:border-[#5D7052] outline-none transition cursor-pointer"
                      >
                        <option value="Punjab">Punjab</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Bihar">Bihar</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Telangana">Telangana</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#2C2C24] mb-1 uppercase tracking-wider">
                      Primary Crop
                    </label>
                    <div className="relative">
                      <Leaf className="w-3.5 h-3.5 text-[#78786C] absolute left-3 top-3" />
                      <select
                        value={preferredCrop}
                        onChange={(e) => setPreferredCrop(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs text-[#2C2C24] focus:bg-[#FEFEFA] focus:border-[#5D7052] outline-none transition cursor-pointer"
                      >
                        <option value="Wheat">Wheat (गेंहू)</option>
                        <option value="Rice">Rice / Paddy (चावल)</option>
                        <option value="Sugarcane">Sugarcane (गन्ना)</option>
                        <option value="Cotton">Cotton (कपास)</option>
                        <option value="Maize">Maize (मक्का)</option>
                        <option value="Soybean">Soybean (सोयाबीन)</option>
                        <option value="Mustard">Mustard (सरसों)</option>
                        <option value="Pulses">Pulses / Gram (दालें)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#2C2C24] mb-1 uppercase tracking-wider">
                    Mobile Number (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#78786C] absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs text-[#2C2C24] placeholder-[#78786C]/60 focus:bg-[#FEFEFA] focus:border-[#5D7052] outline-none transition"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold text-[#2C2C24] mb-1 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#78786C] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@agrisphere.ai"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs text-[#2C2C24] placeholder-[#78786C]/60 focus:bg-[#FEFEFA] focus:border-[#5D7052] focus:ring-1 focus:ring-[#5D7052] outline-none transition"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-[#2C2C24] uppercase tracking-wider">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setLocalError(''); }}
                      className="text-[11px] font-bold text-[#5D7052] hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#78786C] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs text-[#2C2C24] placeholder-[#78786C]/60 focus:bg-[#FEFEFA] focus:border-[#5D7052] focus:ring-1 focus:ring-[#5D7052] outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#78786C] hover:text-[#2C2C24]"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#78786C]" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-[#2C2C24] mb-1 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#78786C] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs text-[#2C2C24] placeholder-[#78786C]/60 focus:bg-[#FEFEFA] focus:border-[#5D7052] focus:ring-1 focus:ring-[#5D7052] outline-none transition"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || googleSubmitting}
              className="w-full py-3.5 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#F3F4F1] font-bold text-xs shadow-soft transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50 hover:scale-101 active:scale-99 cursor-pointer"
            >
              {submitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-[#FEFEFA] border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'login' && "Sign In to Farm Workspace"}
                    {mode === 'signup' && "Create My Farm Database"}
                    {mode === 'forgot' && "Send Reset Link"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Security Badges */}
          <div className="pt-3 border-t border-[#DED8CF]/60 flex items-center justify-between text-[10px] text-[#78786C]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5D7052]" />
              <span>Isolated Firestore Database</span>
            </div>
            <span>End-to-End Encrypted</span>
          </div>

        </div>

      </div>
    </div>
  );
};
