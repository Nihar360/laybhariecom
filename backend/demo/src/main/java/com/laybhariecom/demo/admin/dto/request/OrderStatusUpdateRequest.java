package com.laybhariecom.demo.admin.dto.request;

import com.laybhariecom.demo.model.Order;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusUpdateRequest {
    
    @NotNull(message = "Status is required")
    private Order.OrderStatus status;
    
    private String notes;
}
