package com.laybhariecom.demo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.laybhariecom.demo.dto.request.CartItemRequest;
import com.laybhariecom.demo.dto.response.ApiResponse;
import com.laybhariecom.demo.dto.response.CartItemResponse;
import com.laybhariecom.demo.model.User;
import com.laybhariecom.demo.service.CartService;
import com.laybhariecom.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {
    
    private final CartService cartService;
    private final UserService userService;
    
    @PostMapping
    public ResponseEntity<ApiResponse> addToCart(
            Authentication authentication,
            @Valid @RequestBody CartItemRequest request) {
        User user = userService.getUserByEmail(authentication.getName());
        CartItemResponse cartItem = cartService.addToCart(user, request);
        return ResponseEntity.ok(new ApiResponse(true, "Item added to cart", cartItem));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse> getCartItems(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        List<CartItemResponse> cartItems = cartService.getCartItems(user);
        return ResponseEntity.ok(new ApiResponse(true, "Cart items fetched successfully", cartItems));
    }
    
    @PutMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse> updateQuantity(
            Authentication authentication,
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        User user = userService.getUserByEmail(authentication.getName());
        CartItemResponse cartItem = cartService.updateQuantity(user, cartItemId, quantity);
        return ResponseEntity.ok(new ApiResponse(true, "Cart updated successfully", cartItem));
    }
    
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse> removeFromCart(
            Authentication authentication,
            @PathVariable Long cartItemId) {
        User user = userService.getUserByEmail(authentication.getName());
        cartService.removeFromCart(user, cartItemId);
        return ResponseEntity.ok(new ApiResponse(true, "Item removed from cart", null));
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse> clearCart(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        cartService.clearCart(user);
        return ResponseEntity.ok(new ApiResponse(true, "Cart cleared successfully", null));
    }
}
