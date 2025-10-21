import axios from 'axios';

const adminApi = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('admin_refresh_token');
        if (refreshToken) {
          const response = await axios.post('/api/admin/auth/refresh', { refreshToken });
          const { token } = response.data;
          
          localStorage.setItem('admin_token', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          return adminApi(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_refresh_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      window.location.href = '/admin/access-denied';
    }

    return Promise.reject(error);
  }
);

export default adminApi;
