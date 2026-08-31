const BASE_URL = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : 'http://localhost:8000';

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
      throw new Error(errorData.detail || `HTTP Error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
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
  updateFarm: (id, data) => request(`/api/farms/${id}`, {
    method: 'PUT',
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
};
