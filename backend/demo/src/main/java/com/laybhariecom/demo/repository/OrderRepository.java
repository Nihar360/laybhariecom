package com.laybhariecom.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.laybhariecom.demo.model.Order;
import com.laybhariecom.demo.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Existing methods
    List<Order> findByUser(User user);
    List<Order> findByUserId(Long userId);
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByStatus(Order.OrderStatus status);
    List<Order> findByUserOrderByOrderDateDesc(User user);
    
    // New methods for admin dashboard and services
    Page<Order> findByStatus(Order.OrderStatus status, Pageable pageable);
    
    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    Long countByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT SUM(o.total) FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    BigDecimal sumTotalByOrderDateBetween(@Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT o FROM Order o ORDER BY o.orderDate DESC LIMIT 10")
    List<Order> findRecentOrders();
    
    List<Order> findByStatusOrderByOrderDateDesc(Order.OrderStatus status);
}