import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://moldcrm-backend-moldcrm-backend.up.railway.app/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data: { username?: string; email?: string; password: string }) => 
    api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/users/profile/'),
};

export const leadsAPI = {
  getAll: () => api.get('/leads/'),
  getById: (id: number) => api.get(`/leads/${id}/`),
  create: (data: any) => api.post('/leads/', data),
  update: (id: number, data: any) => api.patch(`/leads/${id}/`, data),
  delete: (id: number) => api.delete(`/leads/${id}/`),
};

export const contactsAPI = {
  getAll: () => api.get('/contacts/'),
  getById: (id: number) => api.get(`/contacts/${id}/`),
  create: (data: any) => api.post('/contacts/', data),
  update: (id: number, data: any) => api.patch(`/contacts/${id}/`, data),
  delete: (id: number) => api.delete(`/contacts/${id}/`),
};

export const dealsAPI = {
  getAll: () => api.get('/deals/'),
  getById: (id: number) => api.get(`/deals/${id}/`),
  create: (data: any) => api.post('/deals/', data),
  update: (id: number, data: any) => api.patch(`/deals/${id}/`, data),
  delete: (id: number) => api.delete(`/deals/${id}/`),
};

export const dashboardAPI = {
  getData: () => api.get('/dashboard/'),
};