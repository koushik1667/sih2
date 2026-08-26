import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ML_BASE_URL = import.meta.env.VITE_ML_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || (error.response.status === 400 && error.response.data?.error === 'Invalid token'))) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const farmsAPI = {
  getAll: () => api.get('/farms'),
  getOne: (id) => api.get(`/farms/${id}`),
  create: (data) => api.post('/farms', data),
  update: (id, data) => api.put(`/farms/${id}`, data),
  delete: (id) => api.delete(`/farms/${id}`),
};

export const predictionsAPI = {
  analyze: (farmData) => axios.post(`${ML_BASE_URL}/predict/nutrient-depletion`, farmData),
  getRotation: (farmData) => axios.post(`${ML_BASE_URL}/recommend/rotation`, farmData),
};

export const cropsAPI = {
  getAll: () => api.get('/crops'),
  getByRegion: (region) => api.get(`/crops/region/${region}`),
};

export default api;
