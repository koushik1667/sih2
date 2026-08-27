import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Trash2, 
  Send, 
  Check, 
  Radio, 
  ShieldCheck, 
  X, 
  RefreshCw, 
  Sparkles, 
  CloudRain, 
  Sprout, 
  Wind,
  Layers,
  Terminal
} from 'lucide-react';
import { api } from '../services/api';
import { NotificationManager } from '../services/notificationManager';
import { useLanguage } from '../context/LanguageContext';

export const NotificationCenter = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [permission, setPermission] = useState(NotificationManager.getPermission());
  const [testResult, setTestResult] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Test form state
  const [testPreset, setTestPreset] = useState('weather');
  const [customTitle, setCustomTitle] = useState('🌱 AgriSphere Live Push Test (FCM HTTP v1)');
  const [customBody, setCustomBody] = useState('Real-time agro-climate synchronization verified via Firebase Admin SDK.');
  const [customSeverity, setCustomSeverity] = useState('info');

  const presets = [
    {
      id: 'weather',
      label: '🌦️ IMD Weather Hazard',
      title: '🚨 IMD Flash Storm & Wind Warning',
      body: 'Severe thunderstorm gusting up to 45 km/h predicted in next 6 hours. Secure irrigation pipes.',
      severity: 'critical',
      category: 'weather'
    },
    {
      id: 'spray',
      label: '🚜 Optimal Spray Window',
      title: '🌦️ Optimal Foliar Spray Window Open',
      body: 'Calm winds (4.2 km/h), 0% precipitation risk, and 62% humidity. Optimal time for micronutrient spray.',
      severity: 'info',
      category: 'weather'
    },
    {
      id: 'soil',
      label: '🧪 NPK Depletion Alert',
      title: '⚠️ Critical Soil Nitrogen Drawdown',
      body: 'Monoculture cereal cycle depleted available N to 138 kg/ha. Moong legume rotation recommended.',
      severity: 'warning',
      category: 'soil'
    },
    {
      id: 'pest',
      label: '🐛 Yellow Rust Advisory',
      title: '🌾 ICAR Yellow Rust Alert (Micro-Climate)',
      body: 'High morning humidity (>85%) detected. Inspect wheat canopy undersides for yellow pustules.',
      severity: 'warning',
      category: 'pest'
    }
  ];

  const fetchConfigAndHistory = async () => {
    try {
      setLoading(true);
      const localFeed = NotificationManager.getLocalNotificationHistory();
      const [cfg, hist] = await Promise.all([
        api.getNotificationConfig().catch(() => ({
          fcm_version: 'HTTP v1 (Firebase Admin SDK)',
          is_configured: false,
          auth_method: 'unconfigured_graceful_fallback',
          vapid_public_key: 'BKx9_demo_public_vapid_key_agrisphere_agro_precision',
          registered_devices_count: 1
        })),
        api.getNotificationHistory().catch(() => ({
          notifications: [],
          total: 0,
          unread_count: 0
        }))
      ]);

      const serverNotifs = hist.notifications || [];
      const combined = [...localFeed];
      serverNotifs.forEach(sn => {
        if (!combined.some(c => c.id === sn.id)) {
          combined.push(sn);
        }
      });

      setConfig(cfg);
      setNotifications(combined);
      setUnreadCount(combined.filter(n => !n.isRead).length);
      setPermission(NotificationManager.getPermission());
    } catch (err) {
      console.warn('Failed to load notification center data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigAndHistory();
  }, [isOpen]);

  const handleApplyPreset = (p) => {
    setTestPreset(p.id);
    setCustomTitle(p.title);
    setCustomBody(p.body);
    setCustomSeverity(p.severity);
  };

  const handleRequestPermission = async () => {
    const res = await NotificationManager.requestPermission();
    setPermission(NotificationManager.getPermission());
    fetchConfigAndHistory();
  };

  const handleSendTest = async () => {
    try {
      setTesting(true);
      setTestResult(null);

      const result = await NotificationManager.sendTestPush({
        title: customTitle,
        body: customBody,
        severity: customSeverity,
        category: testPreset
      });

      setTestResult(result);
      await fetchConfigAndHistory();
    } catch (err) {
      setTestResult({
        status: 'error',
        diagnostic: err.message,
        protocol: 'FCM HTTP v1 (Firebase Admin SDK)'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleMarkRead = async (id) => {
    await api.markNotificationRead(id).catch(() => {});
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
      try {
        localStorage.setItem('agrisphere_notifications_feed', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead().catch(() => {});
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, isRead: true }));
      try {
        localStorage.setItem('agrisphere_notifications_feed', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    setUnreadCount(0);
  };

  const handleDelete = async (id) => {
    await api.deleteNotification(id).catch(() => {});
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      try {
        localStorage.setItem('agrisphere_notifications_feed', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const handleClearAll = async () => {
    await api.clearAllNotifications().catch(() => {});
    try {
      localStorage.removeItem('agrisphere_notifications_feed');
    } catch (_) {}
    setNotifications([]);
    setUnreadCount(0);
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !n.isRead;
    return n.category === activeFilter;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2C2C24]/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FEFEFA] border border-[#DED8CF] shadow-2xl rounded-[2rem] max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DED8CF]/80 bg-[#F7F5F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5D7052] text-[#F3F4F1] flex items-center justify-center shadow-soft">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#2C2C24] font-serif">
                  Field Alerts & FCM HTTP v1 Hub
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[#5D7052]/15 text-[#5D7052] border border-[#5D7052]/30">
                  Firebase Admin SDK
                </span>
              </div>
              <p className="text-xs text-[#78786C]">
                Push notification dispatch engine authenticated via Google Application Credentials
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#78786C] hover:text-[#2C2C24] hover:bg-[#DED8CF]/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Status & Protocol Diagnostics Banner */}
          <div className="bg-[#F0EBE5]/50 border border-[#DED8CF] rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#5D7052]" />
                <span className="text-xs font-bold text-[#2C2C24] uppercase tracking-wider">
                  Authentication & Engine Architecture
                </span>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#FEFEFA] border border-[#DED8CF] text-[#5D7052] font-semibold">
                Protocol: FCM HTTP v1 (OAuth2 / Service Account)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-[#FEFEFA] rounded-xl border border-[#DED8CF]/80">
                <div className="text-[10px] uppercase font-bold text-[#78786C]">Backend SDK Model</div>
                <div className="text-xs font-bold text-[#2C2C24] mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5D7052]" />
                  Firebase Admin SDK
                </div>
                <div className="text-[10px] text-[#78786C] mt-1">
                  Auth: {config?.auth_method || 'ADC / Service Account'}
                </div>
              </div>

              <div className="p-3 bg-[#FEFEFA] rounded-xl border border-[#DED8CF]/80">
                <div className="text-[10px] uppercase font-bold text-[#78786C]">Web VAPID Key</div>
                <div className="text-xs font-bold text-[#2C2C24] mt-0.5 truncate" title={config?.vapid_public_key}>
                  {config?.vapid_public_key ? `${config.vapid_public_key.slice(0, 14)}...` : 'Active'}
                </div>
                <div className="text-[10px] text-[#5D7052] font-medium mt-1">
                  Browser Push Ready
                </div>
              </div>

              <div className="p-3 bg-[#FEFEFA] rounded-xl border border-[#DED8CF]/80 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#78786C]">Browser Permission</div>
                  <div className="text-xs font-bold text-[#2C2C24] mt-0.5 flex items-center gap-1.5 capitalize">
                    <span className={`w-2 h-2 rounded-full ${permission === 'granted' ? 'bg-[#5D7052]' : 'bg-[#C18C5D]'}`} />
                    {permission}
                  </div>
                </div>
                {permission !== 'granted' && (
                  <button
                    onClick={handleRequestPermission}
                    className="mt-2 text-[10px] font-bold px-2 py-1 rounded-md bg-[#5D7052] text-[#F3F4F1] hover:bg-[#4D5E44] transition"
                  >
                    Enable Push
                  </button>
                )}
              </div>
            </div>

            {config?.diagnostic && (
              <div className="text-[11px] text-[#78786C] bg-[#FEFEFA] p-2.5 rounded-lg border border-[#DED8CF]/60 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-[#5D7052] shrink-0 mt-0.5" />
                <span>{config.diagnostic}</span>
              </div>
            )}
          </div>

          {/* Test Trigger Section */}
          <div className="bg-[#FEFEFA] border border-[#5D7052]/30 rounded-2xl p-5 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5D7052]" />
                <h3 className="text-sm font-bold text-[#2C2C24]">
                  Test Live Notification Dispatch (Backend → Web Client)
                </h3>
              </div>
              <span className="text-[10px] text-[#78786C] font-semibold">
                FCM HTTP v1 Standard
              </span>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#78786C] uppercase tracking-wider">
                Select Agricultural Test Preset
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {presets.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleApplyPreset(p)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition ${
                      testPreset === p.id 
                        ? 'bg-[#5D7052]/10 border-[#5D7052] text-[#5D7052]' 
                        : 'bg-[#F7F5F0] border-[#DED8CF] text-[#2C2C24] hover:border-[#5D7052]/40'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Body Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#78786C]">Alert Headline</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DED8CF] text-xs text-[#2C2C24] bg-[#F7F5F0] focus:border-[#5D7052] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#78786C]">Severity</label>
                <select
                  value={customSeverity}
                  onChange={(e) => setCustomSeverity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DED8CF] text-xs text-[#2C2C24] bg-[#F7F5F0] focus:border-[#5D7052] outline-none cursor-pointer"
                >
                  <option value="info">Info / Advisory</option>
                  <option value="warning">Warning / Risk</option>
                  <option value="critical">Critical Emergency</option>
                  <option value="success">Success Confirmation</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#78786C]">Payload Body Message</label>
              <textarea
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-[#DED8CF] text-xs text-[#2C2C24] bg-[#F7F5F0] focus:border-[#5D7052] outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-[#78786C]">
                Dispatches a live message payload using Firebase Admin SDK with graceful in-browser push delivery.
              </p>
              <button
                onClick={handleSendTest}
                disabled={testing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5D7052] text-[#F3F4F1] text-xs font-bold shadow-soft hover:bg-[#4D5E44] transition disabled:opacity-50"
              >
                {testing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Test Push</span>
                  </>
                )}
              </button>
            </div>

            {/* Test Result Diagnostic Log */}
            {testResult && (
              <div className="p-3.5 bg-[#2C2C24] text-[#F3F4F1] rounded-xl font-mono text-[11px] space-y-2 border border-[#4D5E44]/40">
                <div className="flex items-center justify-between text-[#8DA082] text-[10px] uppercase tracking-wider pb-1 border-b border-[#4D5E44]/40">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3 h-3" />
                    FCM HTTP v1 Dispatch Receipt
                  </span>
                  <span className="text-[#F3F4F1]">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="space-y-1">
                  <div><span className="text-[#8DA082]">Protocol:</span> {testResult.protocol || 'FCM HTTP v1'}</div>
                  <div><span className="text-[#8DA082]">Status:</span> <span className="text-emerald-400 font-bold">{testResult.delivery_status || testResult.status}</span></div>
                  <div><span className="text-[#8DA082]">Message ID:</span> {testResult.message_id || 'sim-fcm-v1-broadcast'}</div>
                  <div><span className="text-[#8DA082]">Diagnostic:</span> {testResult.diagnostic}</div>
                </div>
              </div>
            )}
          </div>

          {/* Notification History Feed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#2C2C24]">
                  Recent Field Advisories & History
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#5D7052]/10 text-[#5D7052]">
                  {notifications.length} Total ({unreadCount} Unread)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-[#5D7052] font-semibold hover:underline"
                  >
                    Mark All Read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-[#C18C5D] font-semibold hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All Alerts' },
                { id: 'unread', label: 'Unread Only' },
                { id: 'weather', label: 'Weather & Spray' },
                { id: 'soil', label: 'Soil & NPK' },
                { id: 'pest', label: 'Pest & Crop' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    activeFilter === f.id
                      ? 'bg-[#2C2C24] text-[#F3F4F1]'
                      : 'bg-[#F0EBE5] text-[#78786C] hover:text-[#2C2C24]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#78786C] bg-[#F7F5F0] rounded-2xl border border-dashed border-[#DED8CF]">
                  No field notifications recorded for this filter.
                </div>
              ) : (
                filteredNotifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-3.5 rounded-xl border transition flex items-start justify-between gap-3 ${
                      !n.isRead 
                        ? 'bg-[#FEFEFA] border-[#5D7052]/40 shadow-sm' 
                        : 'bg-[#F7F5F0]/60 border-[#DED8CF]/60 opacity-80'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
                        n.severity === 'critical' ? 'bg-red-100 text-red-700' :
                        n.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {n.severity === 'critical' ? <AlertTriangle className="w-4 h-4" /> :
                         n.severity === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                         <Info className="w-4 h-4" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[#2C2C24]">{n.title}</h4>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-[#5D7052]" />
                          )}
                        </div>
                        <p className="text-xs text-[#78786C] leading-relaxed">{n.body}</p>
                        <div className="flex items-center gap-3 pt-1 text-[10px] text-[#78786C]">
                          <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>•</span>
                          <span className="uppercase font-bold text-[#5D7052]">{n.category}</span>
                          <span>•</span>
                          <span className="font-mono">FCM v1: {n.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {!n.isRead && (
                        <button
                          onClick={() => handleMarkRead(n.id)}
                          className="p-1 rounded-md text-[#78786C] hover:text-[#5D7052] hover:bg-[#F0EBE5]"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="p-1 rounded-md text-[#78786C] hover:text-red-600 hover:bg-red-50"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#DED8CF]/80 bg-[#F7F5F0] flex items-center justify-between">
          <div className="text-[11px] text-[#78786C]">
            AgriSphere Cloud Messaging (FCM HTTP v1 Standard)
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#2C2C24] text-[#F3F4F1] text-xs font-bold hover:bg-[#4D5E44] transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
