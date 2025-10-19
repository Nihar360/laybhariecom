import axios from 'axios';

// Get the backend URL - use the same hostname but port 8080
const getBackendUrl = () => {
  // Check if VITE_API_URL is set via .env
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Use the same hostname as the frontend but port 8080
  // This works in both Replit (127.0.0.1 or replit.dev) and local development
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // In Replit, both frontend (port 5000) and backend (port 8080) are accessible via the same hostname
  return `${protocol}//${hostname}:8080`;
};

const API_BASE_URL = getBackendUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
