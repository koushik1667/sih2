import React, { useState } from 'react';
import { 
  Sprout, 
  Satellite, 
  ShieldCheck, 
  Bot, 
  BarChart3, 
  CloudSun, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  MapPin, 
  CheckCircle2, 
  Zap, 
  LogIn, 
  Compass, 
  Activity, 
  Globe, 
  TrendingUp,
  Cpu,
  ChevronRight,
  Database
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PublicHome = ({ onNavigateToAuth, onQuickDemoLogin }) => {
  const { t } = useLanguage();

  // Quick Interactive Soil Simulator on the Home Screen
  const [testNitrogen, setTestNitrogen] = useState(175);
  const [testPhosphorus, setTestPhosphorus] = useState(32);
  const [testPotassium, setTestPotassium] = useState(155);
  const [testPh, setTestPh] = useState(6.8);

  // Calculate instant simulated score
  const nScore = testNitrogen < 140 ? (testNitrogen / 140) * 60 : testNitrogen <= 280 ? 60 + ((testNitrogen - 140) / 140) * 40 : 85;
  const pScore = testPhosphorus < 15 ? (testPhosphorus / 15) * 60 : testPhosphorus <= 45 ? 60 + ((testPhosphorus - 15) / 30) * 40 : 80;
  const kScore = testPotassium < 100 ? (testPotassium / 100) * 60 : testPotassium <= 250 ? 60 + ((testPotassium - 100) / 150) * 40 : 85;
  const phScore = testPh >= 6.5 && testPh <= 7.5 ? 95 : 75;
  const simulatedScore = Math.round((nScore * 0.3 + pScore * 0.25 + kScore * 0.25 + phScore * 0.2) * 10) / 10;

  return (
    <div className="space-y-16 sm:space-y-24 animate-fadeIn pb-12">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-4 sm:pt-8 text-center max-w-4xl mx-auto space-y-6">
        
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5D7052]/10 border border-[#5D7052]/20 text-[#5D7052] text-xs font-bold shadow-soft">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Agricultural Intelligence &amp; Cloud SRM • SIH 2026</span>
        </div>

        {/* Display Typography Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#2C2C24] font-serif leading-[1.15] tracking-tight">
          Precision Agronomy Powered by <br className="hidden sm:inline" />
          <span className="text-[#5D7052] italic font-normal">Super-Resolution Satellites</span> &amp; AI
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#78786C] max-w-2xl mx-auto font-medium leading-relaxed">
          Unifying ISRO/Sentinel sub-meter satellite super-resolution, ICAR soil health diagnostics, and Krishi Mitra AI to empower Indian farmers with data-driven yield precision.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={onNavigateToAuth}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#FEFEFA] font-bold text-sm shadow-soft transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Open Login Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('platform-features');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#FEFEFA] hover:bg-[#F0EBE5] border border-[#DED8CF] text-[#2C2C24] font-bold text-sm shadow-soft transition-all hover:scale-102 cursor-pointer"
          >
            <span>Explore Platform Features</span>
          </button>
        </div>

        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 text-left">
          {[
            { label: "Super-Resolution", val: "2.5m Sub-Meter", desc: "GeoSR-AI multispectral" },
            { label: "Soil Knowledge", val: "100% ICAR-Grounded", desc: "Government soil health" },
            { label: "Cloud Privacy", val: "User Isolated DB", desc: "Encrypted Firestore" },
            { label: "Krishi AI Assistant", val: "13 Languages", desc: "Voice & native script" },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-2xl bg-[#FEFEFA]/80 border border-[#DED8CF] shadow-soft">
              <span className="text-[10px] uppercase font-bold text-[#78786C] block">{stat.label}</span>
              <span className="text-base font-bold font-serif text-[#2C2C24] block mt-0.5">{stat.val}</span>
              <span className="text-[11px] text-[#5D7052] font-medium block">{stat.desc}</span>
            </div>
          ))}
        </div>

      </section>

      {/* 2. CORE CAPABILITIES BENTO GRID */}
      <section id="platform-features" className="space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-bold text-[#5D7052] tracking-wider">Enterprise Agricultural Intelligence</span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-[#2C2C24]">
            Integrated Agronomic Solutions
          </h2>
          <p className="text-xs sm:text-sm text-[#78786C]">
            A complete technology suite built to bridge satellite earth observation with on-ground soil and crop decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: GeoSR-AI Satellite SRM */}
          <div className="p-7 sm:p-8 rounded-[2.5rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#5D7052]/10 text-[#5D7052] flex items-center justify-center">
                <Satellite className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#2C2C24]">
                GeoSR-AI Satellite SRM
              </h3>
              <p className="text-xs text-[#78786C] leading-relaxed">
                Reconstructs 10-meter Sentinel &amp; Landsat imagery into 2.5-meter super-resolution tiles. Computes NDVI, NDRE, and EVI vegetation health indices with sub-plot precision.
              </p>
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-[#2C2C24] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#5D7052] shrink-0" />
                  <span>Sub-meter multispectral reconstruction</span>
                </div>
                <div className="flex items-center gap-2 text-[#2C2C24] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#5D7052] shrink-0" />
                  <span>NDVI stress &amp; crop vigor detection</span>
                </div>
                <div className="flex items-center gap-2 text-[#2C2C24] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#5D7052] shrink-0" />
                  <span>Interactive resolution comparison slider</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#DED8CF]/60">
              <button
                type="button"
                onClick={onNavigateToAuth}
                className="w-full py-2.5 rounded-full bg-[#F0EBE5] hover:bg-[#E6DCCD] text-[#2C2C24] font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Launch Satellite SRM</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: ICAR Soil Precision Card */}
          <div className="p-7 sm:p-8 rounded-[2.5rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#C18C5D]/10 text-[#C18C5D] flex items-center justify-center">
                <Sprout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#2C2C24]">
                ICAR Soil Precision Engine
              </h3>
              <p className="text-xs text-[#78786C] leading-relaxed">
                Official Ministry Soil Health Card formula integration. Evaluates Nitrogen (N), Phosphorus (P), Potassium (K), pH, and Organic Carbon to generate tailored fertilizer dosages.
              </p>
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-[#2C2C24] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#C18C5D] shrink-0" />
                  <span>Government Soil Health Card (SHC) scoring</span>
                </div>
                <div className="flex items-center gap-2 text-[#2C2C24] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#C18C5D] shrink-0" />
                  <span>Urea, DAP, MOP &amp; Bio-fertilizer dosage</span>
                </div>
                <div className="flex items-center gap-2 text-[#2C2C24] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#C18C5D] shrink-0" />
                  <span>Dynamic yield impact projections</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#DED8CF]/60">
              <button
                type="button"
                onClick={onNavigateToAuth}
                className="w-full py-2.5 rounded-full bg-[#F0EBE5] hover:bg-[#E6DCCD] text-[#2C2C24] font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Diagnose Soil Card</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Krishi Mitra AI Agronomist */}
          <div className="p-7 sm:p-8 rounded-[2.5rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#5D7052]/10 text-[#5D7052] flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-[#2C2C24]">
                Krishi Mitra AI Agronomist
              </h3>
              <p className="text-xs text-[#78786C] leading-relaxed">
                24/7 AI-powered agricultural advisor grounded in ICAR research repositories. Multi-lingual voice input with support for Hindi, Punjabi, Marathi, Telugu, Tamil, and Bengali.
              </p>
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-center gap-2 text-[#2C2C24] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#5D7052] shrink-0" />
                  <span>Pest &amp; disease remedy recommendations</span>
                </div>
                <div className="flex items-center gap-2 text-[#2C2C24] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#5D7052] shrink-0" />
                  <span>PM-Kisan &amp; State agricultural subsidy advice</span>
                </div>
                <div className="flex items-center gap-2 text-[#2C2C24] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#5D7052] shrink-0" />
                  <span>Real-time voice query transcription</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#DED8CF]/60">
              <button
                type="button"
                onClick={onNavigateToAuth}
                className="w-full py-2.5 rounded-full bg-[#F0EBE5] hover:bg-[#E6DCCD] text-[#2C2C24] font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Consult Krishi Mitra</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* 3. INTERACTIVE QUICK SOIL HEALTH SIMULATOR WIDGET */}
      <section className="p-8 sm:p-10 rounded-[2.5rem] bg-[#FEFEFA] border border-[#DED8CF] shadow-soft space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[#5D7052]/10 text-[#5D7052]">
                Interactive Demo Sandbox
              </span>
              <span className="text-xs text-[#78786C]">• No Login Required to Test</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#2C2C24] mt-1">
              Live Soil Health Card Simulator
            </h3>
            <p className="text-xs text-[#78786C]">
              Adjust the NPK sliders below to see the ICAR algorithm compute soil risk level and vigor score in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="text-right">
              <span className="text-[10px] text-[#78786C] uppercase font-bold block">Simulated Score</span>
              <span className="text-2xl sm:text-3xl font-bold font-serif text-[#5D7052]">{simulatedScore}/100</span>
            </div>
            <div className={`px-3 py-1.5 rounded-2xl text-xs font-bold ${
              simulatedScore >= 75 ? 'bg-[#5D7052]/15 text-[#5D7052]' : simulatedScore >= 55 ? 'bg-[#C18C5D]/15 text-[#C18C5D]' : 'bg-[#A85448]/15 text-[#A85448]'
            }`}>
              {simulatedScore >= 75 ? 'Optimal' : simulatedScore >= 55 ? 'Moderate Risk' : 'High Deficiency'}
            </div>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
          
          <div className="p-4 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF]">
            <div className="flex justify-between text-xs font-bold text-[#2C2C24] mb-2">
              <span>Nitrogen (N)</span>
              <span className="text-[#5D7052]">{testNitrogen} kg/ha</span>
            </div>
            <input
              type="range"
              min="80"
              max="350"
              value={testNitrogen}
              onChange={(e) => setTestNitrogen(Number(e.target.value))}
              className="w-full accent-[#5D7052] cursor-pointer"
            />
            <span className="text-[10px] text-[#78786C] mt-1 block">Ideal: 140 - 280 kg/ha</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF]">
            <div className="flex justify-between text-xs font-bold text-[#2C2C24] mb-2">
              <span>Phosphorus (P)</span>
              <span className="text-[#C18C5D]">{testPhosphorus} kg/ha</span>
            </div>
            <input
              type="range"
              min="5"
              max="70"
              value={testPhosphorus}
              onChange={(e) => setTestPhosphorus(Number(e.target.value))}
              className="w-full accent-[#C18C5D] cursor-pointer"
            />
            <span className="text-[10px] text-[#78786C] mt-1 block">Ideal: 15 - 45 kg/ha</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF]">
            <div className="flex justify-between text-xs font-bold text-[#2C2C24] mb-2">
              <span>Potassium (K)</span>
              <span className="text-[#78786C]">{testPotassium} kg/ha</span>
            </div>
            <input
              type="range"
              min="50"
              max="350"
              value={testPotassium}
              onChange={(e) => setTestPotassium(Number(e.target.value))}
              className="w-full accent-[#78786C] cursor-pointer"
            />
            <span className="text-[10px] text-[#78786C] mt-1 block">Ideal: 100 - 250 kg/ha</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF]">
            <div className="flex justify-between text-xs font-bold text-[#2C2C24] mb-2">
              <span>Soil pH</span>
              <span className="text-[#5D7052]">{testPh}</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="9.0"
              step="0.1"
              value={testPh}
              onChange={(e) => setTestPh(Number(e.target.value))}
              className="w-full accent-[#5D7052] cursor-pointer"
            />
            <span className="text-[10px] text-[#78786C] mt-1 block">Ideal: 6.5 - 7.5 Neutral</span>
          </div>

        </div>

        {/* Action Prompt */}
        <div className="p-4 rounded-2xl bg-[#5D7052]/10 border border-[#5D7052]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-[#5D7052] shrink-0" />
            <span className="text-[#2C2C24] font-medium">
              Want to save real Soil Health Cards for your field plots with custom fertilizer dosage?
            </span>
          </div>
          <button
            type="button"
            onClick={onNavigateToAuth}
            className="px-5 py-2 rounded-full bg-[#5D7052] text-[#FEFEFA] text-xs font-bold shadow-soft hover:bg-[#4D5E44] transition shrink-0 cursor-pointer"
          >
            Create Free Farm Account
          </button>
        </div>

      </section>

      {/* 4. READY TO GET STARTED / LOGIN CALLOUT */}
      <section className="relative overflow-hidden p-8 sm:p-12 rounded-[2.5rem] bg-[#5D7052] text-[#FEFEFA] shadow-soft">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="px-3 py-1 text-[10px] font-bold uppercase rounded-full bg-[#FEFEFA]/20 text-[#FEFEFA] inline-block">
            Smart India Hackathon 2026
          </span>
          <h3 className="text-2xl sm:text-4xl font-bold font-serif leading-tight">
            Ready to empower your agricultural fields with AI intelligence?
          </h3>
          <p className="text-sm text-[#FEFEFA]/90 leading-relaxed font-light">
            Sign in with Google or your email to register your farm parcels, view live Doppler weather radar, and generate sub-meter satellite analytics.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onNavigateToAuth}
              className="px-8 py-3.5 rounded-full bg-[#FEFEFA] text-[#5D7052] font-bold text-xs shadow-soft hover:bg-[#F0EBE5] transition hover:scale-102 cursor-pointer flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Go to Login &amp; Registration Dashboard</span>
            </button>
            <button
              type="button"
              onClick={onQuickDemoLogin}
              className="px-6 py-3.5 rounded-full bg-[#FEFEFA]/15 border border-[#FEFEFA]/30 text-[#FEFEFA] font-bold text-xs hover:bg-[#FEFEFA]/25 transition cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>1-Click Test Credentials</span>
            </button>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <Sprout className="w-96 h-96 text-[#FEFEFA]" />
        </div>
      </section>

    </div>
  );
};
