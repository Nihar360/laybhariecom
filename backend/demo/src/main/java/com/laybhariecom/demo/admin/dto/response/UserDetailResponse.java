package com.laybhariecom.demo.admin.dto.response;

import com.laybhariecom.demo.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private Role role;
    private Boolean active;
    private Long totalOrders;
    private BigDecimal totalSpent;
    private LocalDateTime lastOrderDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}