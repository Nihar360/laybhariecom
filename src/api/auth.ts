import api from './config';
import type { ApiResponse, AuthResponse, RegisterRequest, LoginRequest } from '../types/api';

export const authService = {
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/register', data);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.data.id,
        fullName: response.data.data.fullName,
        email: response.data.data.email,
        role: response.data.data.role,
      }));
    }
    return response.data;
  },

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', data);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.data.id,
        fullName: response.data.data.fullName,
        email: response.data.data.email,
        role: response.data.data.role,
      }));
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  getUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
