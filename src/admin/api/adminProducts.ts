import api from '../../api/config';

export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  badge?: string;
  category: string;
  description: string;
  features?: string[];
  sizes?: string[];
  inStock: boolean;
  stockCount: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[];
  features?: string[];
  sizes?: string[];
  stockCount: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  category?: string;
  image?: string;
  images?: string[];
  features?: string[];
  sizes?: string[];
}

export interface StockAdjustmentRequest {
  quantity: number;
  reason: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const adminProductsService = {
  async getAllProducts(
    page: number = 0,
    size: number = 20,
    sortBy: string = 'id',
    sortDirection: string = 'DESC'
  ): Promise<PageResponse<ProductResponse>> {
    const response = await api.get<PageResponse<ProductResponse>>('/api/admin/products', {
      params: { page, size, sortBy, sortDirection }
    });
    return response.data;
  },

  async getProductById(id: number): Promise<{ data: ProductResponse }> {
    const response = await api.get<{ data: ProductResponse }>(`/api/admin/products/${id}`);
    return response.data;
  },

  async createProduct(data: CreateProductRequest): Promise<{ data: ProductResponse }> {
    const response = await api.post<{ data: ProductResponse }>('/api/admin/products', data);
    return response.data;
  },

  async updateProduct(id: number, data: UpdateProductRequest): Promise<{ data: ProductResponse }> {
    const response = await api.put<{ data: ProductResponse }>(`/api/admin/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/api/admin/products/${id}`);
    return response.data;
  },

  async adjustStock(id: number, data: StockAdjustmentRequest): Promise<{ data: ProductResponse }> {
    const response = await api.post<{ data: ProductResponse }>(`/api/admin/products/${id}/inventory`, data);
    return response.data;
  },

  async getLowStockProducts(): Promise<ProductResponse[]> {
    const response = await api.get<ProductResponse[]>('/api/admin/products/low-stock');
    return response.data;
  }
};
