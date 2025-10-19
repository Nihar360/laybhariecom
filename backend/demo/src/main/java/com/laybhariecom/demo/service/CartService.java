package com.laybhariecom.demo.service;

import com.laybhariecom.demo.dto.request.CartItemRequest;
import com.laybhariecom.demo.dto.response.CartItemResponse;
import com.laybhariecom.demo.exception.BadRequestException;
import com.laybhariecom.demo.exception.ResourceNotFoundException;
import com.laybhariecom.demo.model.CartItem;
import com.laybhariecom.demo.model.Product;
import com.laybhariecom.demo.model.User;
import com.laybhariecom.demo.repository.CartItemRepository;
import com.laybhariecom.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {
    
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    
    @Autowired
    public CartService(CartItemRepository cartItemRepository, ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }
    
    @Transactional
    public CartItemResponse addToCart(User user, CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        if (!product.getInStock()) {
            throw new BadRequestException("Product is out of stock");
        }
        
        if (product.getStockCount() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock available");
        }
        
        Optional<CartItem> existingItemOpt = cartItemRepository.findByUserAndProductAndSizeAndColor(
                user, product, request.getSize(), request.getColor()
        );
        
        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            return convertToResponse(cartItemRepository.save(existingItem));
        }
        
        CartItem cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setProduct(product);
        cartItem.setQuantity(request.getQuantity());
        cartItem.setSize(request.getSize());
        cartItem.setColor(request.getColor());
        
        return convertToResponse(cartItemRepository.save(cartItem));
    }
    
    @Transactional(readOnly = true)
    public List<CartItemResponse> getCartItems(User user) {
        return cartItemRepository.findByUser(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CartItemResponse updateQuantity(User user, Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }
        
        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }
        
        if (cartItem.getProduct().getStockCount() < quantity) {
            throw new BadRequestException("Insufficient stock available");
        }
        
        cartItem.setQuantity(quantity);
        return convertToResponse(cartItemRepository.save(cartItem));
    }
    
    @Transactional
    public void removeFromCart(User user, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }
        
        cartItemRepository.delete(cartItem);
    }
    
    @Transactional
    public void clearCart(User user) {
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
        response.setSubtotal(cartItem.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        return response;
    }
}