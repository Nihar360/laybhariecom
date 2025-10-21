package com.laybhariecom.demo.admin.repository;

import com.laybhariecom.demo.admin.model.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {
    
    Optional<Coupon> findByCodeIgnoreCase(String code);
    
    boolean existsByCodeIgnoreCase(String code);
    
    List<Coupon> findByStatus(Coupon.CouponStatus status);
    
    @Query("SELECT c FROM Coupon c WHERE c.validFrom <= :now AND c.validTo >= :now AND c.status = 'ACTIVE'")
    List<Coupon> findActiveAndValidCoupons(@Param("now") LocalDateTime now);
    
    @Query("SELECT c FROM Coupon c WHERE c.validTo < :now AND c.status = 'ACTIVE'")
    List<Coupon> findExpiredCoupons(@Param("now") LocalDateTime now);
    
    @Query("SELECT c FROM Coupon c WHERE c.createdBy.id = :userId ORDER BY c.createdAt DESC")
    List<Coupon> findByCreatedByUserId(@Param("userId") Long userId);
}
