package com.laybhariecom.demo.repository;

import com.laybhariecom.demo.model.Order;
import com.laybhariecom.demo.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // Basic queries
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByUserOrderByOrderDateDesc(User user);
    List<Order> findByUser(User user);
    
    // User-related dashboard queries
    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT SUM(o.total) FROM Order o WHERE o.user.id = :userId")
    BigDecimal sumTotalAmountByUserId(@Param("userId") Long userId);
    
    @Query("SELECT MAX(o.orderDate) FROM Order o WHERE o.user.id = :userId")
    LocalDateTime findLatestOrderDateByUserId(@Param("userId") Long userId);
    
    // Date range queries for dashboard
    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate ORDER BY o.orderDate DESC")
    List<Order> findByOrderDateBetween(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    Long countByOrderDateBetween(@Param("startDate") LocalDateTime startDate, 
                                 @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT SUM(o.total) FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    BigDecimal sumTotalByOrderDateBetween(@Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);
    
    // Status-based queries
    List<Order> findByStatus(Order.OrderStatus status);
    
    Page<Order> findByStatus(Order.OrderStatus status, Pageable pageable);
}