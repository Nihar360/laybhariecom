import api from '../../api/config';

export interface CouponResponse {
  id: number;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  validFrom: string;
  validTo: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  createdByEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponRequest {
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  validFrom: string;
  validTo: string;
}

export interface UpdateCouponRequest {
  code?: string;
  type?: 'PERCENTAGE' | 'FIXED';
  value?: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  validFrom?: string;
  validTo?: string;
}

export const adminCouponsService = {
  async getAllCoupons(): Promise<{ data: CouponResponse[] }> {
    const response = await api.get<{ data: CouponResponse[] }>('/api/admin/coupons');
    return response.data;
  },

  async getCouponById(id: number): Promise<{ data: CouponResponse }> {
    const response = await api.get<{ data: CouponResponse }>(`/api/admin/coupons/${id}`);
    return response.data;
  },

  async createCoupon(data: CreateCouponRequest): Promise<{ data: CouponResponse }> {
    const response = await api.post<{ data: CouponResponse }>('/api/admin/coupons', data);
    return response.data;
  },

  async updateCoupon(id: number, data: UpdateCouponRequest): Promise<{ data: CouponResponse }> {
    const response = await api.put<{ data: CouponResponse }>(`/api/admin/coupons/${id}`, data);
    return response.data;
  },

  async deleteCoupon(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/api/admin/coupons/${id}`);
    return response.data;
  },

  async activateCoupon(id: number): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/api/admin/coupons/${id}/activate`);
    return response.data;
  },

  async deactivateCoupon(id: number): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/api/admin/coupons/${id}/deactivate`);
    return response.data;
  }
};
