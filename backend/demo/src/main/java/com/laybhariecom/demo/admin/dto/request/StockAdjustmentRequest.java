package com.laybhariecom.demo.admin.dto.request;

import com.laybhariecom.demo.admin.model.InventoryMovement;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockAdjustmentRequest {
    
    @NotNull(message = "Delta is required")
    private Integer delta;
    
    @NotNull(message = "Reason is required")
    private InventoryMovement.MovementReason reason;
    
    private String referenceType;
    
    private Long referenceId;
    
    private String notes;
}
