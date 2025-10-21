package com.laybhariecom.demo.admin.controller;

import com.laybhariecom.demo.admin.dto.request.OrderStatusUpdateRequest;
import com.laybhariecom.demo.admin.service.AdminAuditLogService;
import com.laybhariecom.demo.admin.service.OrderWorkflowService;
import com.laybhariecom.demo.dto.response.ApiResponse;
import com.laybhariecom.demo.dto.response.OrderResponse;
import com.laybhariecom.demo.model.Order;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AdminOrderController {
    
    private final OrderWorkflowService orderWorkflowService;
    private final AdminAuditLogService auditLogService;
    private final UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "orderDate") String sortBy,
        @RequestParam(defaultValue = "DESC") String sortDirection,
        @RequestParam(required = false) Order.OrderStatus status
    ) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<OrderResponse> orders = orderWorkflowService.getAllOrders(pageable, status);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        OrderResponse order = orderWorkflowService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success("Order retrieved successfully", order));
    }
    
    @PostMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
        @PathVariable Long id,
        @Valid @RequestBody OrderStatusUpdateRequest request,
        @AuthenticationPrincipal UserDetails userDetails,
        HttpServletRequest httpRequest
    ) {
        OrderResponse order = orderWorkflowService.updateOrderStatus(id, request.getStatus(), request.getNotes());
        
        User admin = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (admin != null) {
            auditLogService.logAction(
                admin,
                "ORDER",
                id,
                "STATUS_UPDATE",
                Map.of("newStatus", request.getStatus(), "orderNumber", order.getOrderNumber()),
                httpRequest
            );
        }
        
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", order));
    }
    
    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
        @PathVariable Long id,
        @RequestParam(required = false) String reason,
        @AuthenticationPrincipal UserDetails userDetails,
        HttpServletRequest httpRequest
    ) {
        OrderResponse order = orderWorkflowService.cancelOrder(id, reason);
        
        User admin = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (admin != null) {
            auditLogService.logAction(
                admin,
                "ORDER",
                id,
                "CANCEL",
                Map.of("reason", reason != null ? reason : "No reason provided", "orderNumber", order.getOrderNumber()),
                httpRequest
            );
        }
        
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", order));
    }
}
