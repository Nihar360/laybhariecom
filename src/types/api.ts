export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stockCount: number;
  sizes: string[];
  colors?: string[];
  features: string[];
  createdAt?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  subtotal: number;
}

export interface CartItemRequest {
  productId: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ShippingAddress {
  id?: number;
  fullName: string;
  mobile: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: string;
  orderDate: string;
  deliveredDate?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
}

export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  notes?: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  mobile: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
