import api from '../../api/config';

export interface RevenueByPeriod {
  date: string;
  revenue: number;
  orders: number;
}

export interface OrdersByStatus {
  status: string;
  count: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  totalOrders: number;
  revenue: number;
}

export interface RecentOrder {
  orderId: number;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  orderDate: string;
}

export interface DashboardStatsResponse {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  averageOrderValue: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  lowStockProductsCount: number;
  revenueByDay: RevenueByPeriod[];
  ordersByStatus: OrdersByStatus[];
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
}

export const adminDashboardService = {
  async getStats(days: number = 30): Promise<DashboardStatsResponse> {
    const response = await api.get<DashboardStatsResponse>('/api/admin/dashboard/stats', {
      params: { days }
    });
    return response.data;
  }
};
