package com.laybhariecom.demo.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalUsers;
    private Long totalProducts;
    private BigDecimal averageOrderValue;
    private Long pendingOrders;
    private Long shippedOrders;
    private Long deliveredOrders;
    private Long lowStockProductsCount;
    private List<RevenueByPeriod> revenueByDay;
    private List<OrdersByStatus> ordersByStatus;
    private List<TopProduct> topProducts;
    private List<RecentOrder> recentOrders;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RevenueByPeriod {
        private String date;
        private BigDecimal revenue;
        private Long orders;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrdersByStatus {
        private String status;
        private Long count;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopProduct {
        private Long productId;
        private String productName;
        private Long totalOrders;
        private BigDecimal revenue;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentOrder {
        private Long orderId;
        private String orderNumber;
        private String customerName;
        private BigDecimal total;
        private String status;
        private String orderDate;
    }
}
