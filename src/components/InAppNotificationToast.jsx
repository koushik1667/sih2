import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CloudSun, 
  CheckCircle2, 
  Info, 
  X, 
  ExternalLink, 
  Radio, 
  Sprout 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InAppNotificationToast = () => {
  const [activeAlert, setActiveAlert] = useState(null);
  const [progress, setProgress] = useState(100);
  const { setActiveTab } = useApp();

  useEffect(() => {
    const handlePushAlert = (event) => {
      const alert = event.detail;
      if (!alert) return;

      setActiveAlert(alert);
      setProgress(100);
    };

    window.addEventListener('agrisphere_push_alert', handlePushAlert);
    return () => {
      window.removeEventListener('agrisphere_push_alert', handlePushAlert);
    };
  }, []);

  useEffect(() => {
    if (!activeAlert) return;

    const duration = 6000; // 6 seconds
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          setActiveAlert(null);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeAlert]);

  if (!activeAlert) return null;

  const isCritical = activeAlert.severity === 'critical';
  const isWarning = activeAlert.severity === 'warning';

  const getBorderColor = () => {
    if (isCritical) return 'border-red-500/60 shadow-red-500/10';
    if (isWarning) return 'border-amber-500/60 shadow-amber-500/10';
    return 'border-[#5D7052]/50 shadow-[#5D7052]/10';
  };

  const getIcon = () => {
    if (isCritical) return <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />;
    if (isWarning) return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    if (activeAlert.category === 'weather') return <CloudSun className="w-5 h-5 text-[#5D7052]" />;
    return <Bell className="w-5 h-5 text-[#5D7052]" />;
  };

  const handleAction = () => {
    if (activeAlert.category === 'weather' || activeAlert.actionUrl === '/weather') {
      setActiveTab('soil_weather');
    } else {
      setActiveTab('command_center');
    }
    setActiveAlert(null);
  };

  return (
    <aside 
      aria-label="AgriSphere Push Notification"
      className="fixed top-4 right-3 sm:right-6 z-50 max-w-md w-[calc(100vw-1.5rem)] sm:w-full animate-slideInDown transition-all duration-300"
    >
      <div className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#FEFEFA] border ${getBorderColor()} shadow-2xl p-4 sm:p-5 backdrop-blur-md`}>
        {/* Top Mini Tag & Header */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#DED8CF]/60">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isCritical ? 'bg-red-400' : isWarning ? 'bg-amber-400' : 'bg-[#5D7052]'
              }`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isCritical ? 'bg-red-600' : isWarning ? 'bg-amber-500' : 'bg-[#5D7052]'
              }`} />
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#78786C]">
              Real-Time Push Advisory • FCM HTTP v1
            </span>
          </div>

          <button
            onClick={() => setActiveAlert(null)}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#78786C] hover:text-[#2C2C24] hover:bg-[#F0EBE5] transition"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-2xl shrink-0 ${
            isCritical ? 'bg-red-50' : isWarning ? 'bg-amber-50' : 'bg-[#5D7052]/10'
          }`}>
            {getIcon()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-[#2C2C24] font-serif truncate">
                {activeAlert.title}
              </h4>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold shrink-0 uppercase ${
                isCritical ? 'bg-red-100 text-red-700 border border-red-200' :
                isWarning ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                'bg-[#5D7052]/15 text-[#5D7052] border border-[#5D7052]/30'
              }`}>
                {activeAlert.severity || 'Advisory'}
              </span>
            </div>

            <p className="text-xs text-[#525248] mt-1 line-clamp-2 leading-relaxed">
              {activeAlert.body}
            </p>

            <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-[#DED8CF]/40">
              <span className="text-[10px] text-[#78786C] font-mono">
                Just now • Agro-Device Push
              </span>

              <button
                onClick={handleAction}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#5D7052] hover:bg-[#4D5E44] text-[#FEFEFA] text-[11px] font-bold shadow-xs transition"
              >
                <span>View Advisory</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar (Auto-Dismiss Timer) */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#DED8CF]/40">
          <div 
            className={`h-full transition-all ease-linear ${
              isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-[#5D7052]'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </aside>
  );
};
