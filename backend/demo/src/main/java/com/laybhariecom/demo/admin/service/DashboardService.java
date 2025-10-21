package com.laybhariecom.demo.admin.service;

import com.laybhariecom.demo.admin.dto.response.DashboardStatsResponse;
import com.laybhariecom.demo.model.Order;
import com.laybhariecom.demo.repository.OrderRepository;
import com.laybhariecom.demo.repository.ProductRepository;
import com.laybhariecom.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {
    
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    
    public DashboardStatsResponse getDashboardStats(Integer days) {
        if (days == null) days = 30;
        
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        LocalDateTime endDate = LocalDateTime.now();
        
        BigDecimal totalRevenue = orderRepository.sumTotalByOrderDateBetween(startDate, endDate);
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;
        
        Long totalOrders = orderRepository.countByOrderDateBetween(startDate, endDate);
        if (totalOrders == null) totalOrders = 0L;
        
        BigDecimal averageOrderValue = totalOrders > 0 
            ? totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;
        
        Long totalUsers = userRepository.count();
        Long totalProducts = productRepository.count();
        
        Long pendingOrders = orderRepository.findByStatus(Order.OrderStatus.PENDING).size();
        Long shippedOrders = orderRepository.findByStatus(Order.OrderStatus.SHIPPED).size();
        Long deliveredOrders = orderRepository.findByStatus(Order.OrderStatus.DELIVERED).size();
        
        Long lowStockProducts = productRepository.findByStockCountLessThanAndInStockTrue(10).size();
        
        List<DashboardStatsResponse.RevenueByPeriod> revenueByDay = getRevenueByDay(days);
        List<DashboardStatsResponse.OrdersByStatus> ordersByStatus = getOrdersByStatus();
        List<DashboardStatsResponse.RecentOrder> recentOrders = getRecentOrders();
        
        return DashboardStatsResponse.builder()
            .totalRevenue(totalRevenue)
            .totalOrders(totalOrders)
            .totalUsers(totalUsers)
            .totalProducts(totalProducts)
            .averageOrderValue(averageOrderValue)
            .pendingOrders(pendingOrders != null ? pendingOrders : 0L)
            .shippedOrders(shippedOrders != null ? shippedOrders : 0L)
            .deliveredOrders(deliveredOrders != null ? deliveredOrders : 0L)
            .lowStockProductsCount(lowStockProducts != null ? lowStockProducts : 0L)
            .revenueByDay(revenueByDay)
            .ordersByStatus(ordersByStatus)
            .recentOrders(recentOrders)
            .build();
    }
    
    private List<DashboardStatsResponse.RevenueByPeriod> getRevenueByDay(int days) {
        List<DashboardStatsResponse.RevenueByPeriod> result = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        for (int i = days - 1; i >= 0; i--) {
            LocalDateTime dayStart = LocalDateTime.now().minusDays(i).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime dayEnd = dayStart.withHour(23).withMinute(59).withSecond(59);
            
            List<Order> dayOrders = orderRepository.findByOrderDateBetween(dayStart, dayEnd);
            BigDecimal dayRevenue = dayOrders.stream()
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            result.add(DashboardStatsResponse.RevenueByPeriod.builder()
                .date(dayStart.format(formatter))
                .revenue(dayRevenue)
                .orders((long) dayOrders.size())
                .build());
        }
        
        return result;
    }
    
    private List<DashboardStatsResponse.OrdersByStatus> getOrdersByStatus() {
        return Arrays.stream(Order.OrderStatus.values())
            .map(status -> {
                Long count = (long) orderRepository.findByStatus(status).size();
                return DashboardStatsResponse.OrdersByStatus.builder()
                    .status(status.name())
                    .count(count)
                    .build();
            })
            .collect(Collectors.toList());
    }
    
    private List<DashboardStatsResponse.RecentOrder> getRecentOrders() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        
        return orderRepository.findAll(PageRequest.of(0, 10, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "orderDate")))
            .getContent()
            .stream()
            .map(order -> DashboardStatsResponse.RecentOrder.builder()
                .orderId(order.getId())
                .orderNumber(order.getOrderNumber())
                .customerName(order.getUser().getFullName())
                .total(order.getTotal())
                .status(order.getStatus().name())
                .orderDate(order.getOrderDate().format(formatter))
                .build())
            .collect(Collectors.toList());
    }
}
