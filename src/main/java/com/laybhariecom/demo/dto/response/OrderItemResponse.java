package com.laybhariecom.demo.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private String size;
    private String color;
    private BigDecimal price;
    private BigDecimal subtotal;
}
