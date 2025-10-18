package com.laybhariecom.demo.controller;

import com.laybhariecom.demo.dto.response.ApiResponse;
import com.laybhariecom.demo.dto.response.ProductResponse;
import com.laybhariecom.demo.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;
    
    @GetMapping
    public ResponseEntity<ApiResponse> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(new ApiResponse(true, "Products retrieved successfully", products));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getProductById(@PathVariable Long id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Product retrieved successfully", product));
    }
    
    @GetMapping("/category/{categoryName}")
    public ResponseEntity<ApiResponse> getProductsByCategory(@PathVariable String categoryName) {
        List<ProductResponse> products = productService.getProductsByCategory(categoryName);
        return ResponseEntity.ok(new ApiResponse(true, "Products retrieved successfully", products));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchProducts(@RequestParam String query) {
        List<ProductResponse> products = productService.searchProducts(query);
        return ResponseEntity.ok(new ApiResponse(true, "Search results retrieved successfully", products));
    }
    
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse> getFeaturedProducts() {
        List<ProductResponse> products = productService.getFeaturedProducts();
        return ResponseEntity.ok(new ApiResponse(true, "Featured products retrieved successfully", products));
    }
    
    @GetMapping("/available")
    public ResponseEntity<ApiResponse> getAvailableProducts() {
        List<ProductResponse> products = productService.getAvailableProducts();
        return ResponseEntity.ok(new ApiResponse(true, "Available products retrieved successfully", products));
    }
}
