package com.laybhariecom.demo.admin.dto.request;

import com.laybhariecom.demo.admin.model.Coupon;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCouponRequest {
    
    private Coupon.CouponType type;
    
    private BigDecimal value;
    
    private BigDecimal minOrderAmount;
    
    private BigDecimal maxDiscountAmount;
    
    private Integer usageLimit;
    
    private LocalDateTime validFrom;
    
    private LocalDateTime validTo;
}
