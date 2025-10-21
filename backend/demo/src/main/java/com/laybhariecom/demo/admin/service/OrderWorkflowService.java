package com.laybhariecom.demo.admin.service;

import com.laybhariecom.demo.dto.response.OrderResponse;
import com.laybhariecom.demo.dto.response.OrderItemResponse;
import com.laybhariecom.demo.dto.response.AddressResponse;
import com.laybhariecom.demo.exception.BadRequestException;
import com.laybhariecom.demo.exception.ResourceNotFoundException;
import com.laybhariecom.demo.model.Order;
import com.laybhariecom.demo.model.OrderItem;
import com.laybhariecom.demo.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderWorkflowService {
    
    private final OrderRepository orderRepository;
    
    private static final List<Order.OrderStatus> VALID_STATUS_TRANSITIONS = Arrays.asList(
        Order.OrderStatus.PENDING,
        Order.OrderStatus.CONFIRMED,
        Order.OrderStatus.PROCESSING,
        Order.OrderStatus.PACKED,
        Order.OrderStatus.SHIPPED,
        Order.OrderStatus.DELIVERED
    );
    
    public Page<OrderResponse> getAllOrders(Pageable pageable, Order.OrderStatus status) {
        Page<Order> orders;
        if (status != null) {
            orders = orderRepository.findByStatus(status, pageable);
        } else {
            orders = orderRepository.findAll(pageable);
        }
        return orders.map(this::mapToOrderResponse);
    }
    
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        return mapToOrderResponse(order);
    }
    
    @Transactional
    public OrderResponse updateOrderStatus(Long id, Order.OrderStatus newStatus, String notes) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        
        if (order.getStatus() == Order.OrderStatus.CANCELLED || order.getStatus() == Order.OrderStatus.REFUNDED) {
            throw new BadRequestException("Cannot update status of cancelled or refunded order");
        }
        
        validateStatusTransition(order.getStatus(), newStatus);
        
        order.setStatus(newStatus);
        if (notes != null && !notes.isEmpty()) {
            String existingNotes = order.getNotes() != null ? order.getNotes() : "";
            order.setNotes(existingNotes + "\n[" + LocalDateTime.now() + "] " + notes);
        }
        
        if (newStatus == Order.OrderStatus.DELIVERED) {
            order.setDeliveredDate(LocalDateTime.now());
        }
        
        Order updatedOrder = orderRepository.save(order);
        log.info("Order status updated - ID: {}, OrderNumber: {}, OldStatus: {}, NewStatus: {}", 
            id, order.getOrderNumber(), order.getStatus(), newStatus);
        
        return mapToOrderResponse(updatedOrder);
    }
    
    @Transactional
    public OrderResponse cancelOrder(Long id, String reason) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        
        if (order.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new BadRequestException("Cannot cancel a delivered order. Please process a refund instead.");
        }
        
        if (order.getStatus() == Order.OrderStatus.CANCELLED || order.getStatus() == Order.OrderStatus.REFUNDED) {
            throw new BadRequestException("Order is already cancelled or refunded");
        }
        
        order.setStatus(Order.OrderStatus.CANCELLED);
        String existingNotes = order.getNotes() != null ? order.getNotes() : "";
        order.setNotes(existingNotes + "\n[CANCELLED - " + LocalDateTime.now() + "] " + (reason != null ? reason : "No reason provided"));
        
        Order cancelledOrder = orderRepository.save(order);
        log.info("Order cancelled - ID: {}, OrderNumber: {}, Reason: {}", id, order.getOrderNumber(), reason);
        
        return mapToOrderResponse(cancelledOrder);
    }
    
    public List<OrderResponse> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status)
            .stream()
            .map(this::mapToOrderResponse)
            .collect(Collectors.toList());
    }
    
    private void validateStatusTransition(Order.OrderStatus currentStatus, Order.OrderStatus newStatus) {
        int currentIndex = VALID_STATUS_TRANSITIONS.indexOf(currentStatus);
        int newIndex = VALID_STATUS_TRANSITIONS.indexOf(newStatus);
        
        if (currentIndex == -1 || newIndex == -1) {
            throw new BadRequestException("Invalid status transition");
        }
        
        if (newIndex <= currentIndex && newStatus != currentStatus) {
            throw new BadRequestException(
                "Cannot move order backwards from " + currentStatus + " to " + newStatus
            );
        }
        
        if (newIndex - currentIndex > 1) {
            throw new BadRequestException(
                "Cannot skip status. Current: " + currentStatus + ", Next allowed: " + 
                VALID_STATUS_TRANSITIONS.get(currentIndex + 1)
            );
        }
    }
    
    private OrderResponse mapToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setSubtotal(order.getSubtotal());
        response.setDiscount(order.getDiscount());
        response.setShipping(order.getShipping());
        response.setTotal(order.getTotal());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setStatus(order.getStatus());
        response.setOrderDate(order.getOrderDate());
        response.setDeliveredDate(order.getDeliveredDate());
        
        if (order.getShippingAddress() != null) {
            AddressResponse addressResponse = new AddressResponse();
            addressResponse.setId(order.getShippingAddress().getId());
            addressResponse.setFullName(order.getShippingAddress().getFullName());
            addressResponse.setPhone(order.getShippingAddress().getPhone());
            addressResponse.setStreetAddress(order.getShippingAddress().getStreetAddress());
            addressResponse.setCity(order.getShippingAddress().getCity());
            addressResponse.setState(order.getShippingAddress().getState());
            addressResponse.setZipCode(order.getShippingAddress().getZipCode());
            addressResponse.setCountry(order.getShippingAddress().getCountry());
            response.setShippingAddress(addressResponse);
        }
        
        List<OrderItemResponse> items = order.getOrderItems().stream()
            .map(this::mapToOrderItemResponse)
            .collect(Collectors.toList());
        response.setItems(items);
        
        return response;
    }
    
    private OrderItemResponse mapToOrderItemResponse(OrderItem item) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId(item.getId());
        response.setProductId(item.getProduct().getId());
        response.setProductName(item.getProduct().getName());
        response.setProductImage(item.getProduct().getImage());
        response.setQuantity(item.getQuantity());
        response.setPrice(item.getPrice());
        response.setSize(item.getSize());
        return response;
    }
}
