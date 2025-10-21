package com.laybhariecom.demo.admin.dto.request;

import com.laybhariecom.demo.model.Role;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String fullName;
    
    @Email(message = "Email must be valid")
    private String email;
    
    private String phone;
    
    private Role role;
    
    private Boolean active;
}
