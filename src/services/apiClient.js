import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT Bearer token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('clario_token') || localStorage.getItem('certifypro_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const activeOrgId = localStorage.getItem('clario_active_org_id') || localStorage.getItem('certifypro_active_org_id');
  if (activeOrgId) {
    config.headers['X-Organization-Id'] = activeOrgId;
  }
  return config;
});

// Response interceptor for auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/verify')) {
      localStorage.removeItem('clario_token');
      localStorage.removeItem('clario_active_org_id');
      localStorage.removeItem('certifypro_token');
      localStorage.removeItem('certifypro_active_org_id');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
