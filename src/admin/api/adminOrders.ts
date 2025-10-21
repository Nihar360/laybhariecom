import api from '../../api/config';

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface AddressResponse {
  id: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  items: OrderItemResponse[];
  shippingAddress: AddressResponse;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: string;
  orderDate: string;
  deliveredDate?: string;
}

export interface OrderStatusUpdateRequest {
  status: string;
  notes?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const adminOrdersService = {
  async getAllOrders(
    page: number = 0,
    size: number = 20,
    sortBy: string = 'orderDate',
    sortDirection: string = 'DESC',
    status?: string
  ): Promise<PageResponse<OrderResponse>> {
    const params: any = { page, size, sortBy, sortDirection };
    if (status && status !== 'ALL') {
      params.status = status;
    }
    const response = await api.get<PageResponse<OrderResponse>>('/api/admin/orders', { params });
    return response.data;
  },

  async getOrderById(id: number): Promise<{ data: OrderResponse }> {
    const response = await api.get<{ data: OrderResponse }>(`/api/admin/orders/${id}`);
    return response.data;
  },

  async updateOrderStatus(id: number, data: OrderStatusUpdateRequest): Promise<{ data: OrderResponse }> {
    const response = await api.post<{ data: OrderResponse }>(`/api/admin/orders/${id}/status`, data);
    return response.data;
  },

  async cancelOrder(id: number, reason?: string): Promise<{ data: OrderResponse }> {
    const params = reason ? { reason } : undefined;
    const response = await api.post<{ data: OrderResponse }>(`/api/admin/orders/${id}/cancel`, null, { params });
    return response.data;
  }
};
