package com.laybhariecom.demo.dto.request;

import com.laybhariecom.demo.model.Order;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderRequest {
    private AddressRequest shippingAddress;
    private Order.PaymentMethod paymentMethod;
    private String couponCode;
    private String notes;
    private BigDecimal discount;
}
