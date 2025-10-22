package com.laybhariecom.demo.repository;

import com.laybhariecom.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Existing methods
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);  // Changed from findByMobile
    Boolean existsByEmail(String email);
    Boolean existsByPhone(String phone);  // Changed from existsByMobile
    
    // Search methods
    List<User> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String fullName, String email);
    
    // Active/Inactive user queries
    List<User> findByActiveTrue();
    List<User> findByActiveFalse();
    
    // Admin dashboard methods - for user statistics
    @Query("SELECT COUNT(o) FROM Order o WHERE o.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);
    
    @Query("SELECT SUM(o.total) FROM Order o WHERE o.user.id = :userId AND o.status IN ('DELIVERED', 'REFUNDED')")
    BigDecimal sumTotalAmountByUserId(@Param("userId") Long userId);
    
    @Query("SELECT MAX(o.orderDate) FROM Order o WHERE o.user.id = :userId")
    LocalDateTime findLatestOrderDateByUserId(@Param("userId") Long userId);
}