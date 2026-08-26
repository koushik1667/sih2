import React, { useState } from 'react';
import { 
  Sprout, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Leaf,
  Database,
  Satellite,
  Bot,
  Zap,
  LogOut,
  Edit2,
  Save,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

export const AuthPage = ({ onSuccess }) => {
  const { 
    user,
    userProfile,
    isAuthenticated,
    loginWithGoogle, 
    loginWithEmail, 
    signupWithEmail, 
    resetPassword, 
    logout,
    updateUserData,
    authError, 
    setAuthError 
  } = useAuth();
  const { farms, setActiveTab, showToast } = useApp();
  const { t } = useLanguage();

  const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot'
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

  // Profile editing state when authenticated
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userProfile?.displayName || user?.displayName || '');
  const [editPhone, setEditPhone] = useState(userProfile?.phone || '');
  const [editState, setEditState] = useState(userProfile?.state || 'Punjab');
  const [editCrop, setEditCrop] = useState(userProfile?.preferredCrop || 'Wheat');
  const [savingProfile, setSavingProfile] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleSubmitting(true);
    setLocalError('');
    try {
      await loginWithGoogle();
      showToast("Signed in successfully with Google!", "success");
      if (onSuccess) onSuccess();
    } catch (err) {
      setLocalError(err.message || "Google sign-in failed. Please try again.");
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('farmer.demo@agrisphere.ai');
    setPassword('Krishi123456');
    setLocalError('');
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
        setSuccessMessage("Password reset instructions sent! Please check your email inbox.");
        showToast("Password reset link dispatched to your email", "info");
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
        setSuccessMessage("Account created successfully! Initializing your personal farm database...");
        showToast(`Welcome to AgriSphere AI, ${displayName}!`, "success");
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 500);
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
        setSuccessMessage("Welcome back! Loading your agricultural workspace...");
        showToast("Welcome back to your farm workspace!", "success");
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 400);
      } catch (err) {
        setLocalError(err.message || "Login failed. Please check your credentials or create a new account.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await updateUserData({
        displayName: editName,
        phone: editPhone,
        state: editState,
        preferredCrop: editCrop
      });
      setIsEditingProfile(false);
      showToast("Profile details updated in your Firestore DB!", "success");
    } catch (err) {
      showToast("Failed to update profile", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast("Signed out of your AgriSphere account.", "info");
  };

  // If user is authenticated, render the Account Dashboard & Cloud Settings
  if (isAuthenticated && user) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        {/* Header Profile Banner */}
        <div className="relative bg-[#FEFEFA] border border-[#DED8CF] rounded-[2.5rem] p-6 sm:p-8 shadow-soft overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#5D7052] text-[#FEFEFA] flex items-center justify-center font-bold text-2xl font-serif shadow-soft overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'Avatar'} className="w-full h-full object-cover" />
                ) : (
                  (userProfile?.displayName || user.displayName || user.email || 'F').charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-[#2C2C24] font-serif">
                    {userProfile?.displayName || user.displayName || 'Farmer Account'}
                  </h1>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Cloud Synced</span>
                  </span>
                </div>
                <p className="text-xs text-[#78786C] font-mono mt-1">
                  {user.email}
                </p>
                <p className="text-[11px] text-[#78786C] mt-0.5">
                  Firestore UID: <span className="font-mono bg-[#F0EBE5] px-1.5 py-0.5 rounded text-[#5D7052]">{user.uid.slice(0, 12)}...</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('command_center')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-[#5D7052] text-[#FEFEFA] font-bold text-xs shadow-soft hover:bg-[#4D5E44] transition flex items-center justify-center gap-2"
              >
                <span>Command Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-full bg-[#A85448]/10 text-[#A85448] font-bold text-xs hover:bg-[#A85448]/20 transition flex items-center gap-1.5 border border-[#A85448]/20"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Database Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold text-[#78786C]">Your Registered Plots</span>
              <div className="p-2 rounded-xl bg-[#5D7052]/10 text-[#5D7052]">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-serif text-[#2C2C24]">
              {farms.length}
            </div>
            <p className="text-xs text-[#78786C] mt-1 font-medium">
              {farms.length > 0 ? "Saved directly in your Firestore" : "No farms yet. Register your first farm"}
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('farms')}
              className="mt-4 text-xs font-bold text-[#5D7052] hover:underline flex items-center gap-1"
            >
              <span>Manage Field Plots</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold text-[#78786C]">Cultivated Acreage</span>
              <div className="p-2 rounded-xl bg-[#C18C5D]/10 text-[#C18C5D]">
                <Sprout className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold font-serif text-[#C18C5D]">
              {farms.reduce((acc, f) => acc + (parseFloat(f.land_size_acres) || 0), 0).toFixed(1)} <span className="text-sm font-sans font-normal text-[#78786C]">Acres</span>
            </div>
            <p className="text-xs text-[#78786C] mt-1 font-medium">
              Calculated across your private field records
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('soil_precision')}
              className="mt-4 text-xs font-bold text-[#C18C5D] hover:underline flex items-center gap-1"
            >
              <span>Soil Health Precision</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-6 rounded-[2rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-bold text-[#78786C]">Database Security</span>
              <div className="p-2 rounded-xl bg-[#5D7052]/10 text-[#5D7052]">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold font-serif text-[#5D7052]">
              User Isolated
            </div>
            <p className="text-xs text-[#78786C] mt-1 font-medium">
              Protected by Firestore security rules
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#78786C]">
              <span className="w-2 h-2 rounded-full bg-[#5D7052]" />
              <span>Real-time sync active</span>
            </div>
          </div>
        </div>

        {/* Farmer Profile Editor */}
        <div className="p-7 sm:p-9 rounded-[2.5rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#5D7052]/10 text-[#5D7052]">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C2C24] font-serif">Farmer Profile & Regional Setting</h3>
                <p className="text-xs text-[#78786C]">Customizes agronomy advisories and weather alerts for your state</p>
              </div>
            </div>

            {!isEditingProfile ? (
              <button
                type="button"
                onClick={() => {
                  setEditName(userProfile?.displayName || user?.displayName || '');
                  setEditPhone(userProfile?.phone || '');
                  setEditState(userProfile?.state || 'Punjab');
                  setEditCrop(userProfile?.preferredCrop || 'Wheat');
                  setIsEditingProfile(true);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F0EBE5] text-[#2C2C24] text-xs font-bold hover:bg-[#E6DCCD] transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-[#78786C] hover:text-[#2C2C24]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#5D7052] text-[#FEFEFA] text-xs font-bold shadow-soft hover:bg-[#4D5E44] transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            )}
          </div>

          {isEditingProfile ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#78786C] uppercase mb-1.5">Farmer Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs text-[#2C2C24] outline-none focus:border-[#5D7052]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#78786C] uppercase mb-1.5">Mobile Phone</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs text-[#2C2C24] outline-none focus:border-[#5D7052]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#78786C] uppercase mb-1.5">Location State</label>
                <select
                  value={editState}
                  onChange={(e) => setEditState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs text-[#2C2C24] outline-none cursor-pointer"
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

              <div>
                <label className="block text-[11px] font-bold text-[#78786C] uppercase mb-1.5">Primary Crop Focus</label>
                <select
                  value={editCrop}
                  onChange={(e) => setEditCrop(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs text-[#2C2C24] outline-none cursor-pointer"
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#F0EBE5]/40 border border-[#DED8CF]">
                <span className="text-[10px] text-[#78786C] block uppercase font-bold">State Jurisdiction</span>
                <span className="font-bold text-sm text-[#2C2C24] mt-1 block">{userProfile?.state || 'Punjab'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F0EBE5]/40 border border-[#DED8CF]">
                <span className="text-[10px] text-[#78786C] block uppercase font-bold">Primary Cultivation</span>
                <span className="font-bold text-sm text-[#2C2C24] mt-1 block">{userProfile?.preferredCrop || 'Wheat'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F0EBE5]/40 border border-[#DED8CF]">
                <span className="text-[10px] text-[#78786C] block uppercase font-bold">Mobile Contact</span>
                <span className="font-bold text-sm text-[#2C2C24] mt-1 block">{userProfile?.phone || 'Not configured'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F0EBE5]/40 border border-[#DED8CF]">
                <span className="text-[10px] text-[#78786C] block uppercase font-bold">Account Tier</span>
                <span className="font-bold text-sm text-[#5D7052] mt-1 block">Full Agronomist Pro</span>
              </div>
            </div>
          )}

          {/* Quick Shortcuts */}
          <div className="pt-2 border-t border-[#DED8CF]/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('farms')}
                className="text-xs font-bold text-[#5D7052] hover:underline flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Register / View Farm Plots ({farms.length})</span>
              </button>
              <span className="text-[#DED8CF]">•</span>
              <button
                type="button"
                onClick={() => setActiveTab('soil_precision')}
                className="text-xs font-bold text-[#5D7052] hover:underline flex items-center gap-1"
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>Soil Precision Test</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Unauthenticated: Dedicated Dashboard Page for Login & Registration
  return (
    <div className="w-full flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn space-y-4">
      {/* Top Breadcrumb Navigation */}
      <div className="w-full max-w-5xl flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FEFEFA] hover:bg-[#F0EBE5] border border-[#DED8CF] text-[#78786C] hover:text-[#2C2C24] text-xs font-bold shadow-soft transition cursor-pointer"
        >
          <span>← Back to Home Overview</span>
        </button>

        <span className="text-[11px] text-[#78786C] font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5D7052]" />
          <span>Encrypted Cloud Gateway</span>
        </span>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Brand Story & Dedicated Database Benefits */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#5D7052] text-[#F3F4F1] flex items-center justify-center shadow-soft">
              <Sprout className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-[#2C2C24] font-serif block">
                AgriSphere <span className="text-[#5D7052] italic font-normal">AI</span>
              </span>
              <span className="text-xs text-[#78786C] font-semibold">
                Unified Agricultural Intelligence &amp; SRM Platform
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#5D7052]/10 text-[#5D7052] text-[10px] font-bold uppercase tracking-wider">
              <span>Authentication Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2C2C24] font-serif leading-tight">
              Farmer Access &amp; Cloud Database
            </h1>
            <p className="text-sm text-[#78786C] font-medium leading-relaxed">
              Sign in with your email or Google account to access your private farm plots, live Doppler radar, and ICAR agronomist precision tools.
            </p>
          </div>

          {/* Value Props */}
          <div className="space-y-3 pt-1">
            {[
              {
                icon: Database,
                title: "Personalized Farm Database",
                desc: "Each farmer gets their own private, cloud-isolated database."
              },
              {
                icon: Satellite,
                title: "GeoSR-AI Super-Resolution",
                desc: "Sub-meter multispectral satellite tiles with NDVI & NIR analysis."
              },
              {
                icon: Bot,
                title: "ICAR-Grounded Krishi Mitra",
                desc: "24/7 AI agronomist tailored to your specific crop and soil conditions."
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FEFEFA] border border-[#DED8CF] shadow-soft">
                  <div className="w-9 h-9 rounded-xl bg-[#5D7052]/10 text-[#5D7052] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2C2C24] font-serif">{item.title}</h4>
                    <p className="text-[11px] text-[#78786C]">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Demo Credentials Pill */}
          <div className="p-3.5 rounded-2xl bg-[#5D7052]/10 border border-[#5D7052]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#5D7052]" />
              <div>
                <span className="text-xs font-bold text-[#2C2C24] block">Want to test instantly?</span>
                <span className="text-[10px] text-[#78786C]">Click to prefill test credentials</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="px-3 py-1.5 rounded-full bg-[#5D7052] text-[#FEFEFA] text-[11px] font-bold shadow-soft hover:bg-[#4D5E44] transition cursor-pointer"
            >
              Auto-Fill
            </button>
          </div>

        </div>

        {/* Right Side: Auth Card Container */}
        <div className="lg:col-span-7">
          <div className="relative bg-[#FEFEFA] border border-[#DED8CF] rounded-[2.5rem] p-7 sm:p-9 shadow-soft space-y-6">
            
            {/* Tab switchers */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#2C2C24] font-serif">
                  {mode === 'login' && "Sign In"}
                  {mode === 'signup' && "Register Farm Account"}
                  {mode === 'forgot' && "Reset Password"}
                </h2>
                <p className="text-xs text-[#78786C] mt-0.5 font-medium">
                  {mode === 'login' && "Enter your credentials or use Google"}
                  {mode === 'signup' && "Create your private farm database in seconds"}
                  {mode === 'forgot' && "Receive recovery instructions on your email"}
                </p>
              </div>

              <div className="flex p-1 bg-[#F0EBE5]/70 rounded-full border border-[#DED8CF]">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setLocalError(''); setSuccessMessage(''); }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
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
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    mode === 'signup'
                      ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft'
                      : 'text-[#78786C] hover:text-[#2C2C24]'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Error or Success notification */}
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

            {/* Google Authentication Button */}
            {mode !== 'forgot' && (
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleSubmitting || submitting}
                  className="w-full py-3.5 px-4 rounded-2xl border border-[#DED8CF] bg-[#FEFEFA] hover:bg-[#F0EBE5] text-[#2C2C24] font-bold text-xs shadow-soft transition flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
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
                  <span>Sign in with Google</span>
                </button>

                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-[#DED8CF]/70" />
                  <span className="px-3 text-[10px] uppercase font-bold text-[#78786C] tracking-wider">or continue with email</span>
                  <div className="flex-grow border-t border-[#DED8CF]/70" />
                </div>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-[#2C2C24] mb-1 uppercase tracking-wider">
                      Farmer / Landowner Name
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#2C2C24] mb-1 uppercase tracking-wider">
                        State
                      </label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-[#78786C] absolute left-3 top-3" />
                        <select
                          value={stateName}
                          onChange={(e) => setStateName(e.target.value)}
                          className="w-full pl-8 pr-2 py-2.5 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs text-[#2C2C24] focus:bg-[#FEFEFA] focus:border-[#5D7052] outline-none transition cursor-pointer"
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
                          className="w-full pl-8 pr-2 py-2.5 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs text-[#2C2C24] focus:bg-[#FEFEFA] focus:border-[#5D7052] outline-none transition cursor-pointer"
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
                        Forgot Password?
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF] text-xs text-[#2C2C24] placeholder-[#78786C]/60 focus:bg-[#FEFEFA] focus:border-[#5D7052] outline-none transition"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || googleSubmitting}
                className="w-full py-3.5 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#F3F4F1] font-bold text-xs shadow-soft transition flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-101 active:scale-99 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-[#FEFEFA] border-t-transparent rounded-full animate-spin" />
                    <span>Connecting Database...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === 'login' && "Sign In to Farm Database"}
                      {mode === 'signup' && "Create Private Farm Database"}
                      {mode === 'forgot' && "Send Password Reset Link"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-[#DED8CF]/60 flex items-center justify-between text-[11px] text-[#78786C]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#5D7052]" />
                <span>Isolated Security Rules per User UID</span>
              </div>
              <span className="font-semibold text-[#5D7052]">Firestore Protected</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
