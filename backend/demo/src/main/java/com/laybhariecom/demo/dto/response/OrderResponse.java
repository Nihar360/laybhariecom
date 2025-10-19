package com.laybhariecom.demo.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.laybhariecom.demo.model.Order;

@Data
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private List<OrderItemResponse> items;
    private AddressResponse shippingAddress;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal shipping;
    private BigDecimal total;
    private Order.PaymentMethod paymentMethod;
    private Order.OrderStatus status;
    private LocalDateTime orderDate;
    private LocalDateTime deliveredDate;
}