package com.laybhariecom.demo.admin.repository;

import com.laybhariecom.demo.admin.model.Refund;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {
    
    List<Refund> findByPaymentId(Long paymentId);
    
    Optional<Refund> findByRazorpayRefundId(String razorpayRefundId);
    
    List<Refund> findByStatus(Refund.RefundStatus status);
    
    Page<Refund> findAllByOrderByInitiatedAtDesc(Pageable pageable);
    
    @Query("SELECT r FROM Refund r WHERE r.initiatedBy.id = :adminId ORDER BY r.initiatedAt DESC")
    Page<Refund> findByInitiatedByUserId(@Param("adminId") Long adminId, Pageable pageable);
    
    @Query("SELECT r FROM Refund r WHERE r.status = :status AND r.initiatedAt BETWEEN :startDate AND :endDate")
    List<Refund> findByStatusAndDateRange(
        @Param("status") Refund.RefundStatus status,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT SUM(r.amount) FROM Refund r WHERE r.status = 'COMPLETED' AND r.completedAt BETWEEN :startDate AND :endDate")
    java.math.BigDecimal calculateTotalRefunds(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
