import api from './config';
import type { ApiResponse, CartItem, CartItemRequest } from '../types/api';

export const cartService = {
  async addToCart(item: CartItemRequest): Promise<ApiResponse<CartItem>> {
    const response = await api.post<ApiResponse<CartItem>>('/api/cart', item);
    return response.data;
  },

  async getCartItems(): Promise<ApiResponse<CartItem[]>> {
    const response = await api.get<ApiResponse<CartItem[]>>('/api/cart');
    return response.data;
  },

  async updateCartItem(cartItemId: number, quantity: number): Promise<ApiResponse<CartItem>> {
    const response = await api.put<ApiResponse<CartItem>>(`/api/cart/${cartItemId}`, null, {
      params: { quantity },
    });
    return response.data;
  },

  async removeCartItem(cartItemId: number): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>(`/api/cart/${cartItemId}`);
    return response.data;
  },

  async clearCart(): Promise<ApiResponse<void>> {
    const response = await api.delete<ApiResponse<void>>('/api/cart/clear');
    return response.data;
  },
};
