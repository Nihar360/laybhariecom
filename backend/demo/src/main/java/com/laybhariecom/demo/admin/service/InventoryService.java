package com.laybhariecom.demo.admin.service;

import com.laybhariecom.demo.admin.dto.request.CreateProductRequest;
import com.laybhariecom.demo.admin.dto.request.StockAdjustmentRequest;
import com.laybhariecom.demo.admin.dto.request.UpdateProductRequest;
import com.laybhariecom.demo.admin.model.InventoryMovement;
import com.laybhariecom.demo.admin.repository.InventoryMovementRepository;
import com.laybhariecom.demo.dto.response.ProductResponse;
import com.laybhariecom.demo.exception.BadRequestException;
import com.laybhariecom.demo.exception.ResourceNotFoundException;
import com.laybhariecom.demo.model.Category;
import com.laybhariecom.demo.model.Product;
import com.laybhariecom.demo.model.User;
import com.laybhariecom.demo.repository.CategoryRepository;
import com.laybhariecom.demo.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryMovementRepository inventoryMovementRepository;
    
    private static final int LOW_STOCK_THRESHOLD = 10;
    
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable).map(this::mapToProductResponse);
    }
    
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return mapToProductResponse(product);
    }
    
    @Transactional
    public ProductResponse createProduct(CreateProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));
        
        Product product = new Product();
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setImage(request.getImage());
        product.setImages(request.getImages());
        product.setCategory(category);
        product.setDescription(request.getDescription());
        product.setFeatures(request.getFeatures());
        product.setSizes(request.getSizes());
        product.setBadge(request.getBadge());
        product.setStockCount(request.getStockCount());
        product.setInStock(request.getStockCount() > 0);
        product.setRating(0.0);
        product.setReviews(0);
        
        Product savedProduct = productRepository.save(product);
        log.info("Product created - ID: {}, Name: {}", savedProduct.getId(), savedProduct.getName());
        
        return mapToProductResponse(savedProduct);
    }
    
    @Transactional
    public ProductResponse updateProduct(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        
        if (request.getName() != null) {
            product.setName(request.getName());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getOriginalPrice() != null) {
            product.setOriginalPrice(request.getOriginalPrice());
        }
        if (request.getImage() != null) {
            product.setImage(request.getImage());
        }
        if (request.getImages() != null) {
            product.setImages(request.getImages());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));
            product.setCategory(category);
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getFeatures() != null) {
            product.setFeatures(request.getFeatures());
        }
        if (request.getSizes() != null) {
            product.setSizes(request.getSizes());
        }
        if (request.getBadge() != null) {
            product.setBadge(request.getBadge());
        }
        if (request.getStockCount() != null) {
            product.setStockCount(request.getStockCount());
            product.setInStock(request.getStockCount() > 0);
        }
        if (request.getInStock() != null) {
            product.setInStock(request.getInStock());
        }
        
        Product updatedProduct = productRepository.save(product);
        log.info("Product updated - ID: {}, Name: {}", id, updatedProduct.getName());
        
        return mapToProductResponse(updatedProduct);
    }
    
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        
        productRepository.delete(product);
        log.info("Product deleted - ID: {}, Name: {}", id, product.getName());
    }
    
    @Transactional
    public ProductResponse adjustStock(Long productId, StockAdjustmentRequest request, User adminUser) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));
        
        int newStockCount = product.getStockCount() + request.getDelta();
        
        if (newStockCount < 0) {
            throw new BadRequestException("Insufficient stock. Current stock: " + product.getStockCount() + ", Requested delta: " + request.getDelta());
        }
        
        product.setStockCount(newStockCount);
        product.setInStock(newStockCount > 0);
        Product updatedProduct = productRepository.save(product);
        
        InventoryMovement movement = InventoryMovement.builder()
            .product(product)
            .delta(request.getDelta())
            .reason(request.getReason())
            .referenceType(request.getReferenceType())
            .referenceId(request.getReferenceId())
            .notes(request.getNotes())
            .adminUser(adminUser)
            .build();
        
        inventoryMovementRepository.save(movement);
        
        log.info("Stock adjusted for product ID: {}, Delta: {}, New stock: {}", productId, request.getDelta(), newStockCount);
        
        return mapToProductResponse(updatedProduct);
    }
    
    public List<ProductResponse> getLowStockProducts() {
        List<Product> allProducts = productRepository.findAll();
        return allProducts.stream()
            .filter(p -> p.getStockCount() <= LOW_STOCK_THRESHOLD)
            .map(this::mapToProductResponse)
            .collect(Collectors.toList());
    }
    
    public List<InventoryMovement> getInventoryMovements(Long productId) {
        return inventoryMovementRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }
    
    private ProductResponse mapToProductResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setPrice(product.getPrice());
        response.setOriginalPrice(product.getOriginalPrice());
        response.setImage(product.getImage());
        response.setImages(product.getImages());
        response.setRating(product.getRating());
        response.setReviews(product.getReviews());
        response.setBadge(product.getBadge());
        response.setCategory(product.getCategory() != null ? product.getCategory().getName() : null);
        response.setDescription(product.getDescription());
        response.setFeatures(product.getFeatures());
        response.setSizes(product.getSizes());
        response.setInStock(product.getInStock());
        response.setStockCount(product.getStockCount());
        return response;
    }
}
