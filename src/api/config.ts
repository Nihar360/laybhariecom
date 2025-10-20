import axios from 'axios';

// Get the backend URL - use the same hostname but port 8080
const getBackendUrl = () => {
  // Check if VITE_API_URL is set via .env
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // In Replit environment (replit.dev domain), don't use port numbers
  // Replit proxies ports through the main domain
  if (hostname.includes('replit.dev') || hostname.includes('repl.co')) {
    // On Replit, the backend runs on the same domain without port specification
    // Just use /api directly - Vite will proxy it to port 8080
    return '';  // Empty string means same origin, handled by Vite proxy
  }
  
  // For local development, use localhost:8080
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `${protocol}//${hostname}:8080`;
  }
  
  // Default fallback
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
