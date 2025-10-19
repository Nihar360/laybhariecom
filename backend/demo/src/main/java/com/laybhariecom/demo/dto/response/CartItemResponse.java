package com.laybhariecom.demo.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private BigDecimal price;
    private String image;
    private Integer quantity;
    private String size;
    private String color;
    private BigDecimal subtotal;
}
