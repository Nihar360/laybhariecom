package com.laybhariecom.demo.admin.controller;

import com.laybhariecom.demo.admin.dto.request.CreateProductRequest;
import com.laybhariecom.demo.admin.dto.request.StockAdjustmentRequest;
import com.laybhariecom.demo.admin.dto.request.UpdateProductRequest;
import com.laybhariecom.demo.admin.model.InventoryMovement;
import com.laybhariecom.demo.admin.service.AdminAuditLogService;
import com.laybhariecom.demo.admin.service.InventoryService;
import com.laybhariecom.demo.dto.response.ApiResponse;
import com.laybhariecom.demo.dto.response.ProductResponse;
import com.laybhariecom.demo.model.User;
import com.laybhariecom.demo.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AdminProductController {
    
    private final InventoryService inventoryService;
    private final AdminAuditLogService auditLogService;
    private final UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "id") String sortBy,
        @RequestParam(defaultValue = "DESC") String sortDirection
    ) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<ProductResponse> products = inventoryService.getAllProducts(pageable);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        ProductResponse product = inventoryService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Product retrieved successfully", product));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
        @Valid @RequestBody CreateProductRequest request,
        @AuthenticationPrincipal UserDetails userDetails,
        HttpServletRequest httpRequest
    ) {
        ProductResponse product = inventoryService.createProduct(request);
        
        User admin = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (admin != null) {
            auditLogService.logAction(
                admin,
                "PRODUCT",
                product.getId(),
                "CREATE",
                Map.of("name", product.getName(), "price", product.getPrice(), "stockCount", product.getStockCount()),
                httpRequest
            );
        }
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Product created successfully", product));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
        @PathVariable Long id,
        @Valid @RequestBody UpdateProductRequest request,
        @AuthenticationPrincipal UserDetails userDetails,
        HttpServletRequest httpRequest
    ) {
        ProductResponse product = inventoryService.updateProduct(id, request);
        
        User admin = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (admin != null) {
            auditLogService.logAction(
                admin,
                "PRODUCT",
                id,
                "UPDATE",
                Map.of("updates", request),
                httpRequest
            );
        }
        
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", product));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails,
        HttpServletRequest httpRequest
    ) {
        inventoryService.deleteProduct(id);
        
        User admin = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (admin != null) {
            auditLogService.logAction(
                admin,
                "PRODUCT",
                id,
                "DELETE",
                null,
                httpRequest
            );
        }
        
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", "Product has been removed"));
    }
    
    @PostMapping("/{id}/inventory")
    public ResponseEntity<ApiResponse<ProductResponse>> adjustStock(
        @PathVariable Long id,
        @Valid @RequestBody StockAdjustmentRequest request,
        @AuthenticationPrincipal UserDetails userDetails,
        HttpServletRequest httpRequest
    ) {
        User admin = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Admin user not found"));
        
        ProductResponse product = inventoryService.adjustStock(id, request, admin);
        
        auditLogService.logAction(
            admin,
            "PRODUCT",
            id,
            "STOCK_ADJUSTMENT",
            Map.of("delta", request.getDelta(), "reason", request.getReason(), "newStockCount", product.getStockCount()),
            httpRequest
        );
        
        return ResponseEntity.ok(ApiResponse.success("Stock adjusted successfully", product));
    }
    
    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getLowStockProducts() {
        List<ProductResponse> products = inventoryService.getLowStockProducts();
        return ResponseEntity.ok(ApiResponse.success("Low stock products retrieved successfully", products));
    }
    
    @GetMapping("/{id}/inventory-movements")
    public ResponseEntity<ApiResponse<List<InventoryMovement>>> getInventoryMovements(@PathVariable Long id) {
        List<InventoryMovement> movements = inventoryService.getInventoryMovements(id);
        return ResponseEntity.ok(ApiResponse.success("Inventory movements retrieved successfully", movements));
    }
}
