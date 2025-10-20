package com.laybhariecom.demo.service;

import com.laybhariecom.demo.dto.request.CartItemRequest;
import com.laybhariecom.demo.dto.response.CartItemResponse;
import com.laybhariecom.demo.model.CartItem;
import com.laybhariecom.demo.model.Product;
import com.laybhariecom.demo.model.User;
import com.laybhariecom.demo.exception.BadRequestException;
import com.laybhariecom.demo.exception.ResourceNotFoundException;
import com.laybhariecom.demo.repository.CartItemRepository;
import com.laybhariecom.demo.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {
    
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private static final int MAX_RETRIES = 3;
    
    @Transactional
    public CartItemResponse addToCart(User user, CartItemRequest request) {
        log.info("Adding product {} to cart for user {} with size: {}, color: {}", 
                request.getProductId(), user.getId(), request.getSize(), request.getColor());
        
        // Validate product exists and is in stock
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        if (!product.getInStock()) {
            throw new BadRequestException("Product is out of stock");
        }
        
        if (product.getStockCount() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock available");
        }
        
        // Normalize size and color to handle null/empty values
        String normalizedSize = normalizeString(request.getSize());
        String normalizedColor = normalizeString(request.getColor());
        
        return addToCartWithRetry(user, product, request.getQuantity(), normalizedSize, normalizedColor, 0);
    }
    
    private CartItemResponse addToCartWithRetry(User user, Product product, Integer quantity, 
            String size, String color, int retryCount) {
        try {
            // Try multiple query methods to find existing item
            CartItem existingItem = findExistingCartItem(user, product, size, color);
            
            if (existingItem != null) {
                log.info("Cart item already exists. Updating quantity from {} to {}", 
                        existingItem.getQuantity(), existingItem.getQuantity() + quantity);
                existingItem.setQuantity(existingItem.getQuantity() + quantity);
                return convertToResponse(cartItemRepository.save(existingItem));
            }
            
            // Create new cart item
            CartItem cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setSize(size);
            cartItem.setColor(color);
            
            log.info("Creating new cart item for product {}", product.getId());
            return convertToResponse(cartItemRepository.save(cartItem));
            
        } catch (DataIntegrityViolationException e) {
            log.warn("Duplicate entry detected (attempt {}). Retrying...", retryCount + 1, e);
            
            if (retryCount < MAX_RETRIES) {
                // Wait a bit and retry
                try {
                    Thread.sleep(100 * (retryCount + 1));
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
                return addToCartWithRetry(user, product, quantity, size, color, retryCount + 1);
            }
            
            // Final attempt: force fetch and update
            log.warn("Max retries reached. Forcing fetch and update...");
            CartItem existingItem = findExistingCartItem(user, product, size, color);
            if (existingItem != null) {
                existingItem.setQuantity(existingItem.getQuantity() + quantity);
                return convertToResponse(cartItemRepository.save(existingItem));
            }
            
            throw new BadRequestException("Failed to add item to cart after multiple attempts");
        }
    }
    
    private CartItem findExistingCartItem(User user, Product product, String size, String color) {
        // Method 1: Try with all parameters
        Optional<CartItem> item = cartItemRepository.findByUserAndProductAndSizeAndColor(user, product, size, color);
        if (item.isPresent()) {
            log.debug("Found existing item using method 1");
            return item.orElse(null);
        }
        
        // Method 2: Try just user and product
        item = cartItemRepository.findByUserAndProduct(user, product);
        if (item.isPresent()) {
            log.debug("Found existing item using method 2 (user + product only)");
            return item.orElse(null);
        }
        
        return null;
    }
    
    @Transactional(readOnly = true)
    public List<CartItemResponse> getCartItems(User user) {
        log.info("Fetching cart items for user {}", user.getId());
        return cartItemRepository.findByUser(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CartItemResponse updateQuantity(User user, Long cartItemId, Integer quantity) {
        log.info("Updating cart item {} quantity to {}", cartItemId, quantity);
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }
        
        // If quantity is 0 or less, remove the item
        if (quantity <= 0) {
            log.info("Quantity is {} - removing cart item {}", quantity, cartItemId);
            cartItemRepository.delete(cartItem);
            return null;
        }
        
        // Check stock availability
        if (cartItem.getProduct().getStockCount() < quantity) {
            throw new BadRequestException("Insufficient stock available");
        }
        
        cartItem.setQuantity(quantity);
        return convertToResponse(cartItemRepository.save(cartItem));
    }
    
    @Transactional
    public void removeFromCart(User user, Long cartItemId) {
        log.info("Removing cart item {} for user {}", cartItemId, user.getId());
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }
        
        cartItemRepository.delete(cartItem);
        log.info("Cart item {} removed successfully", cartItemId);
    }
    
    @Transactional
    public void clearCart(User user) {
        log.info("Clearing cart for user {}", user.getId());
        cartItemRepository.deleteByUser(user);
    }
    
    private CartItemResponse convertToResponse(CartItem cartItem) {
        CartItemResponse response = new CartItemResponse();
        response.setId(cartItem.getId());
        response.setProductId(cartItem.getProduct().getId());
        response.setProductName(cartItem.getProduct().getName());
        response.setPrice(cartItem.getProduct().getPrice());
        response.setImage(cartItem.getProduct().getImage());
        response.setQuantity(cartItem.getQuantity());
        response.setSize(cartItem.getSize());
        response.setColor(cartItem.getColor());
        response.setSubtotal(cartItem.getProduct().getPrice()
                .multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        return response;
    }
    
    private String normalizeString(String value) {
        return (value == null || value.trim().isEmpty()) ? "default" : value.trim();
    }
}