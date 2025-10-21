package com.laybhariecom.demo.admin.model;

import com.laybhariecom.demo.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String code;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private CouponType type;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal value;
    
    @Column(name = "min_order_amount", precision = 10, scale = 2)
    private BigDecimal minOrderAmount;
    
    @Column(name = "max_discount_amount", precision = 10, scale = 2)
    private BigDecimal maxDiscountAmount;
    
    @Column(name = "usage_limit")
    private Integer usageLimit;
    
    @Column(name = "usage_count")
    private Integer usageCount = 0;
    
    @Column(name = "valid_from", nullable = false)
    private LocalDateTime validFrom;
    
    @Column(name = "valid_to", nullable = false)
    private LocalDateTime validTo;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CouponStatus status = CouponStatus.ACTIVE;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum CouponType {
        PERCENTAGE,
        FIXED_AMOUNT,
        FREE_SHIPPING,
        BUY_X_GET_Y
    }
    
    public enum CouponStatus {
        ACTIVE,
        INACTIVE,
        EXPIRED
    }
    
    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();
        return status == CouponStatus.ACTIVE 
            && now.isAfter(validFrom) 
            && now.isBefore(validTo)
            && (usageLimit == null || usageCount < usageLimit);
    }
}
