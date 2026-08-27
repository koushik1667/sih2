import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Radio, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  Zap, 
  Cpu
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { setLiveStatsListener } from '../services/liveTranslator';

export const LiveTranslationHUD = () => {
  const { lang, setLang, supportedLanguages, isLiveActive, setIsLiveActive } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [stats, setStats] = useState({ nodeCount: 0, cacheSize: 0 });

  useEffect(() => {
    setLiveStatsListener((newStats) => {
      setStats(newStats);
    });
  }, []);

  const currentLangObj = supportedLanguages.find(l => l.code === lang) || supportedLanguages[0];

  return (
    <aside aria-label="Live translation controls" className="hidden md:flex fixed bottom-5 left-5 z-50 flex-col items-start font-sans notranslate" translate="no">
      {/* Expanded Panel */}
      {isExpanded && (
        <div className="mb-2.5 p-5 rounded-[2rem] bg-[#FEFEFA]/95 backdrop-blur-xl border border-[#DED8CF] shadow-float text-[#2C2C24] w-80 sm:w-96 animate-in fade-in slide-in-from-bottom-4 duration-200 notranslate" translate="no">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#DED8CF]/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-[#5D7052]/10 text-[#5D7052]">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2C2C24] font-serif flex items-center gap-1.5 notranslate" translate="no">
                  Argos Neural Live Translation
                  <span className="inline-block w-2 h-2 rounded-full bg-[#5D7052] animate-ping" />
                </h4>
                <p className="text-[10px] text-[#78786C]">Real-time DOM &amp; Dynamic AI Content Sync</p>
              </div>
            </div>
            <button 
              onClick={() => setIsExpanded(false)}
              className="text-[#78786C] hover:text-[#2C2C24] p-1.5 rounded-full hover:bg-[#F0EBE5] transition-colors cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Live Translation Engine Status */}
          <div className="mt-3 p-3 rounded-2xl bg-[#F0EBE5]/60 border border-[#DED8CF] flex items-center justify-between notranslate" translate="no">
            <div className="flex items-center gap-2">
              <Radio className={`w-3.5 h-3.5 ${isLiveActive ? 'text-[#5D7052] animate-pulse' : 'text-[#78786C]'}`} />
              <span className="text-xs font-bold text-[#2C2C24] notranslate" translate="no">
                {isLiveActive ? 'Auto-Translating New Content' : 'Live Interception Paused'}
              </span>
            </div>
            <button
              onClick={() => setIsLiveActive(!isLiveActive)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide transition-all notranslate cursor-pointer ${
                isLiveActive 
                  ? 'bg-[#5D7052] text-[#F3F4F1] shadow-soft hover:bg-[#4D5E44]' 
                  : 'bg-[#DED8CF] text-[#78786C] hover:text-[#2C2C24]'
              }`}
              translate="no"
            >
              {isLiveActive ? 'ACTIVE' : 'ENABLE'}
            </button>
          </div>

          {/* Quick Language Selector Grid */}
          <div className="mt-3.5 notranslate" translate="no">
            <label className="text-[10px] font-bold text-[#78786C] uppercase tracking-wider block mb-2 notranslate" translate="no">
              Select Language ({supportedLanguages.length} Indian &amp; Global)
            </label>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin notranslate" translate="no">
              {supportedLanguages.map((l) => {
                const isSelected = lang === l.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all notranslate cursor-pointer ${
                      isSelected
                        ? 'bg-[#5D7052] text-[#F3F4F1] shadow-soft'
                        : 'bg-[#F0EBE5]/60 text-[#2C2C24] hover:bg-[#F0EBE5] border border-[#DED8CF]/40'
                    }`}
                    translate="no"
                  >
                    <div className="flex items-center gap-1.5 truncate notranslate" translate="no">
                      <span className="font-bold notranslate" translate="no">{l.native}</span>
                      <span className={`text-[10px] truncate notranslate ${isSelected ? 'text-[#F3F4F1]/80' : 'text-[#78786C]'}`} translate="no">({l.name})</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#F3F4F1] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Telemetry Footer */}
          <div className="mt-3 pt-2.5 border-t border-[#DED8CF]/60 flex items-center justify-between text-[10px] text-[#78786C] font-semibold notranslate" translate="no">
            <div className="flex items-center gap-1.5 text-[#C18C5D]">
              <Zap className="w-3.5 h-3.5" />
              <span>⚡ {stats.nodeCount} Live Nodes Synced</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#5D7052]">
              <Cpu className="w-3.5 h-3.5" />
              <span>Argos 1.10 Offline Neural</span>
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Floating Pill */}
      <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#FEFEFA]/90 backdrop-blur-md border border-[#DED8CF] shadow-soft hover:border-[#5D7052]/50 transition-all notranslate" translate="no">
        {/* Globe / Expand trigger */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5D7052] text-[#F3F4F1] hover:bg-[#4D5E44] shadow-soft transition-all text-xs font-bold notranslate cursor-pointer"
          translate="no"
        >
          <Globe className="w-3.5 h-3.5 text-[#F3F4F1]" />
          <span className="notranslate" translate="no">{currentLangObj.native}</span>
          <span className="text-[10px] text-[#F3F4F1]/80 hidden sm:inline notranslate" translate="no">({currentLangObj.name})</span>
          {isLiveActive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F3F4F1] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F3F4F1]"></span>
            </span>
          )}
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5 ml-1" /> : <ChevronUp className="w-3.5 h-3.5 ml-1" />}
        </button>

        {/* Quick Language Cycle Buttons */}
        <div className="hidden sm:flex items-center gap-1 pr-1 text-[11px] font-bold text-[#78786C] notranslate" translate="no">
          <button 
            onClick={() => setLang('en')} 
            className={`px-2.5 py-1 rounded-full transition-colors notranslate cursor-pointer ${lang === 'en' ? 'bg-[#2C2C24] text-white font-bold' : 'hover:text-[#2C2C24] hover:bg-[#F0EBE5]'}`}
            translate="no"
          >
            EN
          </button>
          <button 
            onClick={() => setLang('hi')} 
            className={`px-2.5 py-1 rounded-full transition-colors notranslate cursor-pointer ${lang === 'hi' ? 'bg-[#5D7052]/20 text-[#5D7052] font-bold' : 'hover:text-[#2C2C24] hover:bg-[#F0EBE5]'}`}
            translate="no"
          >
            हिन्दी
          </button>
          <button 
            onClick={() => setLang('te')} 
            className={`px-2.5 py-1 rounded-full transition-colors notranslate cursor-pointer ${lang === 'te' ? 'bg-[#5D7052]/20 text-[#5D7052] font-bold' : 'hover:text-[#2C2C24] hover:bg-[#F0EBE5]'}`}
            translate="no"
          >
            తెలుగు
          </button>
          <button 
            onClick={() => setLang('ta')} 
            className={`px-2.5 py-1 rounded-full transition-colors notranslate cursor-pointer ${lang === 'ta' ? 'bg-[#5D7052]/20 text-[#5D7052] font-bold' : 'hover:text-[#2C2C24] hover:bg-[#F0EBE5]'}`}
            translate="no"
          >
            தமிழ்
          </button>
          <button 
            onClick={() => setLang('kn')} 
            className={`px-2.5 py-1 rounded-full transition-colors notranslate cursor-pointer ${lang === 'kn' ? 'bg-[#5D7052]/20 text-[#5D7052] font-bold' : 'hover:text-[#2C2C24] hover:bg-[#F0EBE5]'}`}
            translate="no"
          >
            ಕನ್ನಡ
          </button>
        </div>
      </div>
    </aside>
  );
};
