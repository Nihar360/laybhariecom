package com.laybhariecom.demo.admin.dto;

import com.laybhariecom.demo.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAuthResponse {
    
    private String token;
    private String refreshToken;
    private String type = "Bearer";
    private Long userId;
    private String email;
    private String fullName;
    private Role role;
    private List<String> permissions;
}
