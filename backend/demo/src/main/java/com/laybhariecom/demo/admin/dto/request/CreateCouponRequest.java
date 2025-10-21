package com.laybhariecom.demo.admin.dto.request;

import com.laybhariecom.demo.admin.model.Coupon;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class CreateCouponRequest {
    
    @NotBlank(message = "Coupon code is required")
    private String code;
    
    @NotNull(message = "Coupon type is required")
    private Coupon.CouponType type;
    
    @NotNull(message = "Value is required")
    @Positive(message = "Value must be positive")
    private BigDecimal value;
    
    private BigDecimal minOrderAmount;
    
    private BigDecimal maxDiscountAmount;
    
    private Integer usageLimit;
    
    @NotNull(message = "Valid from date is required")
    private LocalDateTime validFrom;
    
    @NotNull(message = "Valid to date is required")
    private LocalDateTime validTo;
}
