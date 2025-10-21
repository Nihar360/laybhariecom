package com.laybhariecom.demo.admin.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateProductRequest {
    
    @NotBlank(message = "Product name is required")
    private String name;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    private BigDecimal originalPrice;
    
    @NotBlank(message = "Image is required")
    private String image;
    
    private List<String> images;
    
    @NotNull(message = "Category ID is required")
    private Long categoryId;
    
    private String description;
    
    private List<String> features;
    
    private List<String> sizes;
    
    private String badge;
    
    @NotNull(message = "Stock count is required")
    @PositiveOrZero(message = "Stock count must be zero or positive")
    private Integer stockCount;
}
