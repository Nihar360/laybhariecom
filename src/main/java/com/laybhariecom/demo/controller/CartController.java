package com.laybhariecom.demo.controller;

import com.laybhariecom.demo.dto.request.CartItemRequest;
import com.laybhariecom.demo.dto.response.ApiResponse;
import com.laybhariecom.demo.dto.response.CartItemResponse;
import com.laybhariecom.demo.model.User;
import com.laybhariecom.demo.service.CartService;
import com.laybhariecom.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    
    private final CartService cartService;
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<ApiResponse> getCart(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        List<CartItemResponse> cartItems = cartService.getCartItems(user);
        return ResponseEntity.ok(new ApiResponse(true, "Cart retrieved successfully", cartItems));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse> addToCart(
            @Valid @RequestBody CartItemRequest request,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        CartItemResponse cartItem = cartService.addToCart(user, request);
        return new ResponseEntity<>(
                new ApiResponse(true, "Item added to cart successfully", cartItem),
                HttpStatus.CREATED
        );
    }
    
    @PutMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse> updateCartItem(
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        CartItemResponse cartItem = cartService.updateQuantity(user, cartItemId, quantity);
        return ResponseEntity.ok(new ApiResponse(true, "Cart item updated successfully", cartItem));
    }
    
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse> removeFromCart(
            @PathVariable Long cartItemId,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        cartService.removeFromCart(user, cartItemId);
        return ResponseEntity.ok(new ApiResponse(true, "Item removed from cart successfully"));
    }
    
    @DeleteMapping
    public ResponseEntity<ApiResponse> clearCart(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        cartService.clearCart(user);
        return ResponseEntity.ok(new ApiResponse(true, "Cart cleared successfully"));
    }
}
