import api from './config';
import type { ApiResponse, Order, CreateOrderRequest } from '../types/api';

export const ordersService = {
  async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<Order>> {
    const response = await api.post<ApiResponse<Order>>('/api/orders', orderData);
    return response.data;
  },

  async getOrders(): Promise<ApiResponse<Order[]>> {
    const response = await api.get<ApiResponse<Order[]>>('/api/orders');
    return response.data;
  },

  async getOrderById(orderId: number): Promise<ApiResponse<Order>> {
    const response = await api.get<ApiResponse<Order>>(`/api/orders/${orderId}`);
    return response.data;
  },

  async getOrderByNumber(orderNumber: string): Promise<ApiResponse<Order>> {
    const response = await api.get<ApiResponse<Order>>(`/api/orders/number/${orderNumber}`);
    return response.data;
  },
};
