package com.laybhariecom.demo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.laybhariecom.demo.dto.request.OrderRequest;
import com.laybhariecom.demo.dto.response.ApiResponse;
import com.laybhariecom.demo.dto.response.OrderResponse;
import com.laybhariecom.demo.model.User;
import com.laybhariecom.demo.service.OrderService;
import com.laybhariecom.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    
    private final OrderService orderService;
    private final UserService userService;
    
    @PostMapping
    public ResponseEntity<ApiResponse> createOrder(
            Authentication authentication,
            @Valid @RequestBody OrderRequest request) {
        User user = userService.getUserByEmail(authentication.getName());
        OrderResponse order = orderService.createOrder(user, request);
        return ResponseEntity.ok(new ApiResponse(true, "Order created successfully", order));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse> getUserOrders(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        List<OrderResponse> orders = orderService.getUserOrders(user);
        return ResponseEntity.ok(new ApiResponse(true, "Orders fetched successfully", orders));
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse> getOrderById(
            Authentication authentication,
            @PathVariable Long orderId) {
        User user = userService.getUserByEmail(authentication.getName());
        OrderResponse order = orderService.getOrderById(user, orderId);
        return ResponseEntity.ok(new ApiResponse(true, "Order fetched successfully", order));
    }
    
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse> getOrderByNumber(
            Authentication authentication,
            @PathVariable String orderNumber) {
        User user = userService.getUserByEmail(authentication.getName());
        OrderResponse order = orderService.getOrderByNumber(user, orderNumber);
        return ResponseEntity.ok(new ApiResponse(true, "Order fetched successfully", order));
    }
}
