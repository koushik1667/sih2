import React from 'react';
import { Sprout, LogIn, Globe, Home, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const VisitorHeader = ({ activeTab, onSelectTab, onQuickDemo }) => {
  const { lang, setLang, supportedLanguages } = useLanguage();

  return (
    <header className="sticky top-3 z-50 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      <div className="bg-[#FEFEFA]/95 backdrop-blur-md border border-[#DED8CF]/90 shadow-soft rounded-[2.25rem] p-2.5 sm:p-3 transition-all duration-300">
        <div className="flex items-center justify-between gap-3 px-2 sm:px-3">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onSelectTab('home')}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#5D7052] text-[#F3F4F1] shadow-soft group-hover:scale-105 group-hover:bg-[#4D5E44] transition-all">
              <Sprout className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-[#2C2C24] font-serif">
                  AgriSphere <span className="text-[#5D7052] italic font-normal">AI</span>
                </span>
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-[#78786C] hidden md:block">
                Unified Agricultural Intelligence &amp; Cloud SRM
              </p>
            </div>
          </div>

          {/* Center Navigation Pills */}
          <div className="flex items-center p-1 bg-[#F0EBE5]/70 rounded-full border border-[#DED8CF]">
            <button
              type="button"
              onClick={() => onSelectTab('home')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft'
                  : 'text-[#78786C] hover:text-[#2C2C24]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home Overview</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('login')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'login' || activeTab === 'auth'
                  ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft'
                  : 'text-[#78786C] hover:text-[#2C2C24]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login Dashboard</span>
            </button>
          </div>

          {/* Right Controls: Language & Quick Demo / Sign In */}
          <div className="flex items-center gap-2">
            
            {/* Language Switcher */}
            <div className="flex items-center rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] px-2 py-0.5 hover:bg-[#F0EBE5] transition">
              <Globe className="w-3.5 h-3.5 text-[#5D7052] mr-1.5" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label="Select Language"
                className="bg-transparent text-xs text-[#2C2C24] font-semibold py-1 pr-1 outline-none cursor-pointer"
              >
                {supportedLanguages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#FEFEFA] text-[#2C2C24]">
                    {l.native}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Login Action Button */}
            {activeTab !== 'login' && activeTab !== 'auth' && (
              <button
                type="button"
                onClick={() => onSelectTab('login')}
                className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#FEFEFA] text-xs font-bold shadow-soft transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
