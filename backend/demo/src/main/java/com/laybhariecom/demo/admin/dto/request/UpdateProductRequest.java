package com.laybhariecom.demo.admin.dto.request;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProductRequest {
    
    private String name;
    
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    private BigDecimal originalPrice;
    
    private String image;
    
    private List<String> images;
    
    private Long categoryId;
    
    private String description;
    
    private List<String> features;
    
    private List<String> sizes;
    
    private String badge;
    
    @PositiveOrZero(message = "Stock count must be zero or positive")
    private Integer stockCount;
    
    private Boolean inStock;
}
