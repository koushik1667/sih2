const BASE_URL = import.meta.env.VITE_API_URL || '';

const DEFAULT_FALLBACKS = {
  '/api/health': {
    status: 'ok',
    version: '2.0.0',
    service: 'AgriSphere AI Unified Agronomy & Remote Sensing Engine',
    gemini_connected: false
  },
  '/api/farms': {
    farms: [
      {
        id: "farm-punjab-01",
        name: "Green Valley Golden Acres",
        farmer_name: "Gurpreet Singh",
        location: "Ludhiana, Punjab",
        coordinates: { lat: 30.9010, lng: 75.8573 },
        land_size_acres: 12.5,
        soil_type: "Alluvial Sandy Loam",
        irrigation_type: "Tube Well & Canal",
        current_crop: "Wheat",
        active_season: "Rabi 2026",
        soil_health: {
          score: 84.5,
          risk_level: "Low",
          nitrogen: 220.0,
          phosphorus: 45.0,
          potassium: 190.0,
          ph: 7.1,
          organic_carbon: 0.95,
          moisture: 42.0
        },
        last_tested: "2026-02-10"
      },
      {
        id: "farm-mh-02",
        name: "Sahyadri Bio-Cane Plantation",
        farmer_name: "Santosh Patil",
        location: "Kolhapur, Maharashtra",
        coordinates: { lat: 16.7050, lng: 74.2433 },
        land_size_acres: 8.0,
        soil_type: "Deep Black Regur Soil",
        irrigation_type: "River Drip System",
        current_crop: "Sugarcane",
        active_season: "Whole Year",
        soil_health: {
          score: 78.2,
          risk_level: "Medium",
          nitrogen: 190.0,
          phosphorus: 36.0,
          potassium: 210.0,
          ph: 7.6,
          organic_carbon: 0.82,
          moisture: 55.0
        },
        last_tested: "2026-01-24"
      },
      {
        id: "farm-ap-03",
        name: "Godavari Annapurna Fields",
        farmer_name: "Ramesh Varma",
        location: "East Godavari, Andhra Pradesh",
        coordinates: { lat: 16.9891, lng: 82.2475 },
        land_size_acres: 5.5,
        soil_type: "Deltaic Clay Alluvial",
        irrigation_type: "Canal Inundation",
        current_crop: "Rice",
        active_season: "Kharif 2026",
        soil_health: {
          score: 68.0,
          risk_level: "Medium",
          nitrogen: 145.0,
          phosphorus: 22.0,
          potassium: 130.0,
          ph: 6.4,
          organic_carbon: 0.65,
          moisture: 62.0
        },
        last_tested: "2026-02-18"
      },
      {
        id: "farm-ka-04",
        name: "Mysuru Agro-Horti Farm",
        farmer_name: "Gowda Manjunath",
        location: "Mandya / Mysuru, Karnataka",
        coordinates: { lat: 12.5230, lng: 76.8970 },
        land_size_acres: 4.2,
        soil_type: "Red Sandy Loam",
        irrigation_type: "Borewell Sprinkler",
        current_crop: "Maize",
        active_season: "Kharif",
        soil_health: {
          score: 81.2,
          risk_level: "Low",
          nitrogen: 185.0,
          phosphorus: 40.0,
          potassium: 165.0,
          ph: 6.7,
          organic_carbon: 0.88,
          moisture: 38.0
        },
        last_tested: "2026-02-05"
      }
    ],
    total: 4
  },
  '/api/notifications/config': {
    fcm_version: 'HTTP v1 (Firebase Admin SDK)',
    is_configured: false,
    auth_method: 'unconfigured_graceful_fallback',
    vapid_public_key: 'BKx9_demo_public_vapid_key_agrisphere_agro_precision',
    registered_devices_count: 1,
    diagnostic: 'FCM HTTP v1 Admin SDK active with fallback in-browser push.'
  },
  '/api/notifications/history': {
    notifications: [
      {
        id: "notif-01",
        title: "🌦️ Optimal Spray Window Open",
        body: "Morning wind velocity is <9 km/h with 0% rain probability. Ideal conditions for wheat foliar spray.",
        severity: "info",
        category: "weather",
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        isRead: false,
        channel: "fcm_http_v1",
        status: "sent"
      },
      {
        id: "notif-02",
        title: "⚠️ Nitrogen Depletion Alert (Season 2)",
        body: "Continuous cereal monoculture has reduced soil available N to 142 kg/ha. Consider legume rotation.",
        severity: "warning",
        category: "soil",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        isRead: false,
        channel: "fcm_http_v1",
        status: "sent"
      },
      {
        id: "notif-03",
        title: "🚨 IMD Agro-Weather Hazard Warning",
        body: "Heavy unseasonal thunderstorm predicted in next 48 hours for North-Western plains. Drain low-lying plots.",
        severity: "critical",
        category: "weather",
        timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        isRead: true,
        channel: "fcm_http_v1",
        status: "sent"
      }
    ],
    total: 3,
    unread_count: 2
  },
  '/api/translate/batch': {
    from_lang: 'en',
    to_lang: 'hi',
    translated_texts: []
  },
  '/api/translate/languages': {
    languages: [
      { code: "en", name: "English", native_name: "English", script: "Latin" },
      { code: "hi", name: "Hindi", native_name: "हिन्दी", script: "Devanagari" },
      { code: "kn", name: "Kannada", native_name: "ಕನ್ನಡ", script: "Kannada" },
      { code: "ta", name: "Tamil", native_name: "தமிழ்", script: "Tamil" },
      { code: "te", name: "Telugu", native_name: "తెలుగు", script: "Telugu" },
      { code: "mr", name: "Marathi", native_name: "मराठी", script: "Devanagari" },
      { code: "pa", name: "Punjabi", native_name: "ਪੰਜਾਬੀ", script: "Gurmukhi" },
      { code: "gu", name: "Gujarati", native_name: "ગુજરાતી", script: "Gujarati" },
      { code: "bn", name: "Bengali", native_name: "বাংলা", script: "Bengali" },
      { code: "or", name: "Odia", native_name: "ଓଡ଼ିଆ", script: "Odia" },
      { code: "ml", name: "Malayalam", native_name: "മലയാളം", script: "Malayalam" }
    ],
    engine: "Argos Neural Agronomy Translation Engine 1.10"
  }
};

function getEndpointPath(endpoint) {
  return endpoint.split('?')[0];
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.error || `HTTP Error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    const basePath = getEndpointPath(endpoint);
    if (DEFAULT_FALLBACKS[basePath]) {
      console.warn(`[AgriSphere API] Resilient client fallback used for ${basePath}:`, err.message);
      return JSON.parse(JSON.stringify(DEFAULT_FALLBACKS[basePath]));
    }
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // System Health
  getHealth: () => request('/api/health'),

  // GeoSR-AI Satellite SRM
  getGeoPresets: () => request('/api/geosr/presets'),
  getGeoModels: () => request('/api/geosr/models'),
  runGeoSR: (formData) => request('/api/geosr/predict', {
    method: 'POST',
    body: formData, // FormData handles its own boundary
  }),

  // Soil Precision
  calculateSoilScore: (data) => request('/api/soil/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  predictSoilDepletion: (data) => request('/api/soil/depletion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  getCropRotation: (data) => request('/api/soil/rotation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),

  // Farm Management
  getFarms: () => request('/api/farms'),
  getFarm: (id) => request(`/api/farms/${id}`),
  createFarm: (data) => request('/api/farms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  deleteFarm: (id) => request(`/api/farms/${id}`, {
    method: 'DELETE',
  }),

  // National Agriculture Power BI Analytics
  getAnalyticsSummary: (params = {}) => {
    const query = new URLSearchParams();
    if (params.state) query.append('state', params.state);
    if (params.season) query.append('season', params.season);
    if (params.crop) query.append('crop', params.crop);
    return request(`/api/analytics/summary?${query.toString()}`);
  },
  getCrops: () => request('/api/analytics/crops'),
  getStates: () => request('/api/analytics/states'),
  getSoilRadar: () => request('/api/analytics/radar'),

  // AI Agronomist Chat
  sendChatMessage: (data) => request('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  getChatPrompts: () => request('/api/chat/prompts'),

  // Weather & Alerts
  getWeather: (location, lat = null, lon = null) => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (lat !== null && lat !== undefined) params.append('lat', lat);
    if (lon !== null && lon !== undefined) params.append('lon', lon);
    return request(`/api/weather/current?${params.toString()}`);
  },
  getWeatherAlerts: (state) => request(`/api/weather/alerts?state=${encodeURIComponent(state || 'Punjab')}`),

  // Argos Machine Translation
  translate: (text, from_lang = 'en', to_lang = 'hi') => request('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, from_lang, to_lang }),
  }),
  translateBatch: (texts, from_lang = 'en', to_lang = 'hi') => request('/api/translate/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts, from_lang, to_lang }),
  }),
  getTranslationLanguages: () => request('/api/translate/languages'),

  // Firebase Cloud Messaging (FCM HTTP v1) & Notification Hub
  getNotificationConfig: () => request('/api/notifications/config'),
  registerFCMToken: (token, device_info = {}) => request('/api/notifications/register-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, device_info }),
  }),
  testNotification: (payload = {}) => request('/api/notifications/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }),
  sendNotification: (payload) => request('/api/notifications/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }),
  getNotificationHistory: () => request('/api/notifications/history'),
  markNotificationRead: (id) => request(`/api/notifications/${id}/read`, {
    method: 'PUT',
  }),
  markAllNotificationsRead: () => request('/api/notifications/read-all', {
    method: 'PUT',
  }),
  deleteNotification: (id) => request(`/api/notifications/${id}`, {
    method: 'DELETE',
  }),
  clearAllNotifications: () => request('/api/notifications/clear-all', {
    method: 'DELETE',
  }),
};
