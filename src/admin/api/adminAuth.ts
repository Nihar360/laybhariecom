import api from '../../api/config';

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  token: string;
  refreshToken: string;
  type: string;
  userId: number;
  email: string;
  fullName: string;
  role: string;
  permissions: string[];
}

export interface AdminUser {
  userId: number;
  email: string;
  fullName: string;
  role: string;
  permissions: string[];
}

export const adminAuthService = {
  async login(data: AdminLoginRequest): Promise<AdminAuthResponse> {
    const response = await api.post<AdminAuthResponse>('/api/admin/auth/login', data);
    
    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_refresh_token', response.data.refreshToken);
      localStorage.setItem('admin_user', JSON.stringify({
        userId: response.data.userId,
        email: response.data.email,
        fullName: response.data.fullName,
        role: response.data.role,
        permissions: response.data.permissions,
      }));
    }
    
    return response.data;
  },

  async refreshToken(): Promise<AdminAuthResponse> {
    const refreshToken = localStorage.getItem('admin_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<AdminAuthResponse>('/api/admin/auth/refresh', {
      refreshToken,
    });

    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_refresh_token', response.data.refreshToken);
      localStorage.setItem('admin_user', JSON.stringify({
        userId: response.data.userId,
        email: response.data.email,
        fullName: response.data.fullName,
        role: response.data.role,
        permissions: response.data.permissions,
      }));
    }

    return response.data;
  },

  async verifyToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) {
        return false;
      }
      
      const response = await api.get('/api/admin/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data?.valid === true;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        this.logout();
      }
      return false;
    }
  },

  logout(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  },

  getToken(): string | null {
    return localStorage.getItem('admin_token');
  },

  getUser(): AdminUser | null {
    const userStr = localStorage.getItem('admin_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  },

  hasPermission(permission: string): boolean {
    const user = this.getUser();
    return user?.permissions?.includes(permission) || user?.role === 'SUPER_ADMIN';
  },

  hasAnyPermission(permissions: string[]): boolean {
    const user = this.getUser();
    if (user?.role === 'SUPER_ADMIN') return true;
    return permissions.some(perm => user?.permissions?.includes(perm));
  },
};
