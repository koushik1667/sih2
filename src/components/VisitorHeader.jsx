import React from 'react';
import { Sprout, LogIn, Globe, Home, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const VisitorHeader = ({ activeTab, onSelectTab, onQuickDemo }) => {
  const { lang, setLang, supportedLanguages } = useLanguage();

  return (
    <header className="sticky top-2 sm:top-3 z-50 max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8">
      <div className="bg-[#FEFEFA]/95 backdrop-blur-md border border-[#DED8CF]/90 shadow-soft rounded-[1.75rem] sm:rounded-[2.25rem] p-2 sm:p-3 transition-all duration-300">
        <div className="flex items-center justify-between gap-2 sm:gap-3 px-1 sm:px-3">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group notranslate"
            translate="no"
            onClick={() => onSelectTab('home')}
          >
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#5D7052] text-[#F3F4F1] shadow-soft group-hover:scale-105 group-hover:bg-[#4D5E44] transition-all shrink-0">
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-xl font-bold tracking-tight text-[#2C2C24] font-serif leading-none notranslate" translate="no">
                  Sufala <span className="text-[#5D7052] italic font-normal">AI</span>
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 text-[8px] sm:text-[9px] font-bold uppercase rounded-full bg-[#5D7052]/10 text-[#5D7052] border border-[#5D7052]/20">
                  SIH 2026
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#78786C] hidden md:block">
                Unified Agricultural Intelligence &amp; Cloud SRM
              </p>
            </div>
          </div>

          {/* Center Navigation Pills */}
          <div className="flex items-center p-0.5 sm:p-1 bg-[#F0EBE5]/70 rounded-full border border-[#DED8CF]">
            <button
              type="button"
              onClick={() => onSelectTab('home')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft'
                  : 'text-[#78786C] hover:text-[#2C2C24]'
              }`}
            >
              <Home className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Overview</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectTab('login')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'login' || activeTab === 'auth'
                  ? 'bg-[#5D7052] text-[#FEFEFA] shadow-soft'
                  : 'text-[#78786C] hover:text-[#2C2C24]'
              }`}
            >
              <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Login</span>
            </button>
          </div>

          {/* Right Controls: Language & Quick Demo / Sign In */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Language Switcher */}
            <div className="flex items-center rounded-full bg-[#F0EBE5]/60 border border-[#DED8CF] px-1.5 sm:px-2 py-0.5 hover:bg-[#F0EBE5] transition notranslate" translate="no">
              <Globe className="w-3.5 h-3.5 text-[#5D7052] mr-1" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label="Select Language"
                className="bg-transparent text-[11px] sm:text-xs text-[#2C2C24] font-semibold py-1 outline-none cursor-pointer notranslate"
                translate="no"
              >
                {supportedLanguages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#FEFEFA] text-[#2C2C24] notranslate">
                    {l.code.toUpperCase()} ({l.native})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Login Action Button */}
            {activeTab !== 'login' && activeTab !== 'auth' && (
              <button
                type="button"
                onClick={() => onSelectTab('login')}
                className="hidden sm:flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#FEFEFA] text-xs font-bold shadow-soft transition cursor-pointer"
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

