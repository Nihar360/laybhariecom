package com.laybhariecom.demo.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String image;
    private List<String> images;
    private Double rating;
    private Integer reviews;
    private String badge;
    private String category;
    private String description;
    private List<String> features;
    private List<String> sizes;
    private Boolean inStock;
    private Integer stockCount;
}