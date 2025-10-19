import api from './config';
import type { ApiResponse, Product, Category } from '../types/api';

export const productsService = {
  async getAllProducts(): Promise<ApiResponse<Product[]>> {
    const response = await api.get<ApiResponse<Product[]>>('/api/products');
    return response.data;
  },

  async getProductById(id: number): Promise<ApiResponse<Product>> {
    const response = await api.get<ApiResponse<Product>>(`/api/products/${id}`);
    return response.data;
  },

  async getProductsByCategory(categoryName: string): Promise<ApiResponse<Product[]>> {
    const response = await api.get<ApiResponse<Product[]>>(`/api/products/category/${categoryName}`);
    return response.data;
  },

  async searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    const response = await api.get<ApiResponse<Product[]>>('/api/products/search', {
      params: { query },
    });
    return response.data;
  },

  async getAllCategories(): Promise<ApiResponse<Category[]>> {
    const response = await api.get<ApiResponse<Category[]>>('/api/categories');
    return response.data;
  },
};
