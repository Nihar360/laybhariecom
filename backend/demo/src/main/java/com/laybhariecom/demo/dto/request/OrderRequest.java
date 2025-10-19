package com.laybhariecom.demo.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

import com.laybhariecom.demo.model.Order;

@Data
public class OrderRequest {
    @NotNull(message = "Payment method is required")
    private Order.PaymentMethod paymentMethod;
    
    @NotNull(message = "Shipping address is required")
    private AddressRequest shippingAddress;
    
    private String couponCode;
    private String notes;
    private BigDecimal discount;
}
