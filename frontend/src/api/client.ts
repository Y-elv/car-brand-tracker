import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  register: (data: { email: string; password: string; name: string; role?: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
};

export const brandsApi = {
  list: () => api.get('/api/brands'),
  get: (id: string) => api.get(`/api/brands/${id}`),
  create: (name: string) => api.post('/api/brands', { name }),
  delete: (id: string) => api.delete(`/api/brands/${id}`),
};

export const kilometersApi = {
  add: (brandId: string, kilometers: number) =>
    api.post('/api/kilometers', { brandId, kilometers }),
  myEntries: () => api.get('/api/kilometers'),
  totals: () => api.get('/api/kilometers/totals'),
};
