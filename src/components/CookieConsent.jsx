import React, { useState, useEffect } from 'react';
import { 
  Cookie, 
  ShieldCheck, 
  Settings, 
  X, 
  Trash2, 
  Layers, 
  MapPin, 
  Cpu, 
  BarChart3
} from 'lucide-react';
import { 
  getSavedPreferences, 
  savePreferences, 
  getAllCookies, 
  deleteCookie, 
  setCookie, 
  COOKIE_KEYS 
} from '../utils/cookies';

export const CookieConsent = () => {
  const [preferences, setPreferences] = useState(getSavedPreferences());
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeCookiesList, setActiveCookiesList] = useState([]);

  useEffect(() => {
    const saved = getSavedPreferences();
    if (!saved.consentGiven) {
      // Delay showing banner slightly for smooth aesthetic entry
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      refreshCookiesList();
      setShowModal(true);
    };
    window.addEventListener('openCookieModal', handleOpen);
    return () => window.removeEventListener('openCookieModal', handleOpen);
  }, []);

  const refreshCookiesList = () => {
    setActiveCookiesList(getAllCookies());
  };

  const handleOpenModal = () => {
    refreshCookiesList();
    setShowModal(true);
  };

  const handleAcceptAll = () => {
    const updated = savePreferences({
      essential: true,
      agronomy_ai: true,
      live_geo: true,
      satellite_cache: true,
      analytics: true
    });
    setPreferences(updated);
    setShowBanner(false);
    setShowModal(false);
  };

  const handleRejectNonEssential = () => {
    const updated = savePreferences({
      essential: true,
      agronomy_ai: false,
      live_geo: false,
      satellite_cache: false,
      analytics: false
    });
    setPreferences(updated);
    setShowBanner(false);
    setShowModal(false);
  };

  const handleSaveCustom = () => {
    const updated = savePreferences(preferences);
    setPreferences(updated);
    setShowBanner(false);
    setShowModal(false);
  };

  const handleClearAllCookies = () => {
    const all = getAllCookies();
    all.forEach(c => deleteCookie(c.name));
    refreshCookiesList();
    // Re-save essential minimal
    setCookie(COOKIE_KEYS.CONSENT, { essential: true, consentGiven: true }, 30);
  };

  return (
    <>
      {/* Floating Bottom-Right Cookie Consent Banner (Only if not yet consented) */}
      {showBanner && (
        <aside 
          aria-label="Cookie and storage preferences"
          className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] p-6 rounded-[2.25rem] bg-[#FEFEFA]/95 backdrop-blur-xl border border-[#DED8CF] shadow-float text-[#2C2C24] font-sans animate-in fade-in slide-in-from-bottom-6 duration-300"
        >
          <div className="flex items-start gap-3.5 mb-3.5">
            <div className="p-3 rounded-2xl bg-[#5D7052]/10 text-[#5D7052] shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#2C2C24] font-serif flex items-center gap-2">
                Krishi Cookie & Storage Consent
                <span className="w-2 h-2 rounded-full bg-[#5D7052] inline-block animate-ping" />
              </h4>
              <p className="text-xs text-[#78786C] mt-1 leading-relaxed">
                AgriSphere AI uses local storage & cookies for live field GPS caching, neural satellite rendering, and ICAR advisory personalization.
              </p>
            </div>
          </div>

          {/* Quick Badges */}
          <div className="flex flex-wrap gap-1.5 mb-4 text-[10px] font-bold text-[#5D7052]">
            <span className="px-2.5 py-0.5 rounded-full bg-[#5D7052]/10 border border-[#5D7052]/20">🌾 Live GPS Coordinates</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#C18C5D]/10 border border-[#C18C5D]/20 text-[#C18C5D]">🛰️ Satellite Tile Cache</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F0EBE5] text-[#2C2C24]">🤖 Krishi Mitra Memory</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#DED8CF]/60">
            <button
              onClick={handleAcceptAll}
              className="flex-1 py-2.5 px-4 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#F3F4F1] text-xs font-bold shadow-soft transition-all hover:scale-102 active:scale-98"
            >
              Accept All
            </button>
            <button
              onClick={handleRejectNonEssential}
              className="py-2.5 px-3.5 rounded-full bg-[#F0EBE5] hover:bg-[#E6DCCD] text-[#78786C] hover:text-[#2C2C24] text-xs font-bold transition"
            >
              Essential Only
            </button>
            <button
              onClick={handleOpenModal}
              className="p-2.5 rounded-full text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5] transition"
              title="Customize Preferences"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Full Granular Cookie Settings & Inspect Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2C24]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FEFEFA] border border-[#DED8CF] shadow-float rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col font-sans">
            
            {/* Header */}
            <div className="p-6 sm:p-7 border-b border-[#DED8CF]/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#5D7052]/10 text-[#5D7052]">
                  <Cookie className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2C2C24] font-serif">
                    Cookie & Offline Storage Settings
                  </h3>
                  <p className="text-xs text-[#78786C] mt-0.5">
                    Configure your data privacy & on-device caching preferences
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 sm:p-7 overflow-y-auto space-y-5 divide-y divide-[#DED8CF]/60 scrollbar-thin">
              
              {/* Category 1: Essential */}
              <div className="pt-3 first:pt-0 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#5D7052] mt-0.5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#2C2C24]">Essential Agronomy Session</h4>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#5D7052]/10 text-[#5D7052]">
                        Always Required
                      </span>
                    </div>
                    <p className="text-xs text-[#78786C] mt-1 leading-relaxed">
                      Maintains secure session state, language preferences, and foundational platform routing tokens.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled={true}
                  className="w-5 h-5 accent-[#5D7052] cursor-not-allowed opacity-70 mt-1"
                />
              </div>

              {/* Category 2: Live Geolocation Tracking */}
              <div className="pt-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C18C5D] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-[#2C2C24]">Live Field GPS & Coordinates Cache</h4>
                    <p className="text-xs text-[#78786C] mt-1 leading-relaxed">
                      Saves your active field GPS location locally to provide real-time weather radar sync, precision NPK guidance, and agro-climatic zone recognition.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={preferences.live_geo}
                    onChange={(e) => setPreferences({ ...preferences, live_geo: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#DED8CF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D7052]"></div>
                </label>
              </div>

              {/* Category 3: Krishi AI Personalization */}
              <div className="pt-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-[#5D7052] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-[#2C2C24]">Krishi Mitra AI Context Memory</h4>
                    <p className="text-xs text-[#78786C] mt-1 leading-relaxed">
                      Remembers past conversations and selected crop types to deliver faster, context-aware RAG agronomy answers in your chosen regional language.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={preferences.agronomy_ai}
                    onChange={(e) => setPreferences({ ...preferences, agronomy_ai: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#DED8CF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D7052]"></div>
                </label>
              </div>

              {/* Category 4: Satellite SRM Cache */}
              <div className="pt-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Layers className="w-5 h-5 text-[#C18C5D] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-[#2C2C24]">Satellite Tile Super-Resolution Cache</h4>
                    <p className="text-xs text-[#78786C] mt-1 leading-relaxed">
                      Caches super-resolved 2.5m Sentinel-2 multi-spectral image tiles in IndexedDB and memory for smooth slider rendering.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={preferences.satellite_cache}
                    onChange={(e) => setPreferences({ ...preferences, satellite_cache: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#DED8CF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D7052]"></div>
                </label>
              </div>

              {/* Category 5: National Analytics */}
              <div className="pt-4 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-[#78786C] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-[#2C2C24]">Anonymous Performance Analytics</h4>
                    <p className="text-xs text-[#78786C] mt-1 leading-relaxed">
                      Helps optimize UI responsiveness and Power BI dataset load times anonymously.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#DED8CF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5D7052]"></div>
                </label>
              </div>

              {/* Active Cookies Inspector */}
              <div className="pt-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#78786C]">
                    Active Stored Cookies ({activeCookiesList.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleClearAllCookies}
                    className="text-xs font-bold text-[#A85448] hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Wipe All Local Cookies</span>
                  </button>
                </div>

                <div className="bg-[#F0EBE5]/60 border border-[#DED8CF] rounded-2xl p-3 max-h-36 overflow-y-auto space-y-1.5 text-xs font-mono">
                  {activeCookiesList.length === 0 ? (
                    <p className="text-[#78786C] italic font-sans text-xs">No active cookies stored.</p>
                  ) : (
                    activeCookiesList.map((c, i) => (
                      <div key={i} className="flex items-center justify-between py-1 border-b border-[#DED8CF]/40 last:border-0">
                        <div className="truncate max-w-[280px]">
                          <span className="font-bold text-[#5D7052]">{c.name}</span>
                          <span className="text-[#78786C] text-[10px] ml-2">({c.category})</span>
                        </div>
                        <button
                          onClick={() => {
                            deleteCookie(c.name);
                            refreshCookiesList();
                          }}
                          className="text-[#A85448] hover:text-[#2C2C24] p-1"
                          title="Delete this cookie"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Footer Controls */}
            <div className="p-6 border-t border-[#DED8CF]/60 bg-[#F0EBE5]/30 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="px-5 py-2.5 rounded-full bg-[#F0EBE5] hover:bg-[#E6DCCD] text-xs font-bold text-[#78786C] hover:text-[#2C2C24] transition"
              >
                Reject All Non-Essential
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="px-5 py-2.5 rounded-full bg-[#FEFEFA] hover:bg-[#F0EBE5] border-2 border-[#5D7052] text-xs font-bold text-[#5D7052] transition"
                >
                  Save Selected
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-6 py-2.5 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#F3F4F1] text-xs font-bold shadow-soft transition hover:scale-102"
                >
                  Accept All
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
