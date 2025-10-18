package com.laybhariecom.demo.controller;

import com.laybhariecom.demo.dto.request.OrderRequest;
import com.laybhariecom.demo.dto.response.ApiResponse;
import com.laybhariecom.demo.dto.response.OrderResponse;
import com.laybhariecom.demo.model.User;
import com.laybhariecom.demo.service.OrderService;
import com.laybhariecom.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    private final UserService userService;
    
    @PostMapping
    public ResponseEntity<ApiResponse> createOrder(
            @Valid @RequestBody OrderRequest request,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        OrderResponse order = orderService.createOrder(user, request);
        return new ResponseEntity<>(
                new ApiResponse(true, "Order created successfully", order),
                HttpStatus.CREATED
        );
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse> getUserOrders(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        List<OrderResponse> orders = orderService.getUserOrders(user);
        return ResponseEntity.ok(new ApiResponse(true, "Orders retrieved successfully", orders));
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse> getOrderById(
            @PathVariable Long orderId,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        OrderResponse order = orderService.getOrderById(user, orderId);
        return ResponseEntity.ok(new ApiResponse(true, "Order retrieved successfully", order));
    }
    
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse> getOrderByNumber(
            @PathVariable String orderNumber,
            Authentication authentication
    ) {
        User user = userService.getUserByEmail(authentication.getName());
        OrderResponse order = orderService.getOrderByNumber(user, orderNumber);
        return ResponseEntity.ok(new ApiResponse(true, "Order retrieved successfully", order));
    }
}
