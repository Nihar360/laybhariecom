import api from '../../api/config';

export interface UserDetailResponse {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  active: boolean;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const adminUsersService = {
  async getAllUsers(
    page: number = 0,
    size: number = 20,
    sortBy: string = 'createdAt',
    sortDirection: string = 'DESC'
  ): Promise<PageResponse<UserDetailResponse>> {
    const response = await api.get<PageResponse<UserDetailResponse>>('/api/admin/users', {
      params: { page, size, sortBy, sortDirection }
    });
    return response.data;
  },

  async searchUsers(query: string): Promise<UserDetailResponse[]> {
    const response = await api.get<UserDetailResponse[]>('/api/admin/users/search', {
      params: { q: query }
    });
    return response.data;
  },

  async getUserById(id: number): Promise<UserDetailResponse> {
    const response = await api.get<UserDetailResponse>(`/api/admin/users/${id}`);
    return response.data;
  },

  async updateUser(id: number, data: UpdateUserRequest): Promise<{ data: UserDetailResponse }> {
    const response = await api.put<{ data: UserDetailResponse }>(`/api/admin/users/${id}`, data);
    return response.data;
  },

  async activateUser(id: number): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/api/admin/users/${id}/activate`);
    return response.data;
  },

  async deactivateUser(id: number): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/api/admin/users/${id}/deactivate`);
    return response.data;
  }
};
