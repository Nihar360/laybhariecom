package com.laybhariecom.demo.admin.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.laybhariecom.demo.admin.dto.AdminAuthResponse;
import com.laybhariecom.demo.admin.dto.AdminLoginRequest;
import com.laybhariecom.demo.admin.repository.AdminRolePermissionRepository;
import com.laybhariecom.demo.model.Role;
import com.laybhariecom.demo.model.User;
import com.laybhariecom.demo.repository.UserRepository;
import com.laybhariecom.demo.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminAuthService {
    
    private final UserRepository userRepository;
    private final AdminRolePermissionRepository rolePermissionRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final ObjectMapper objectMapper;
    
    public AdminAuthResponse adminLogin(AdminLoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception e) {
            log.error("Authentication failed for admin: {}", request.getEmail());
            throw new BadCredentialsException("Invalid email or password");
        }
        
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        if (!isAdminRole(user.getRole())) {
            log.warn("Non-admin user attempted to access admin panel: {}", request.getEmail());
            throw new BadCredentialsException("Access denied: Admin privileges required");
        }
        
        if (!user.getActive()) {
            log.warn("Inactive admin user attempted to login: {}", request.getEmail());
            throw new BadCredentialsException("Account is inactive");
        }
        
        List<String> permissions = getPermissionsForRole(user.getRole());
        
        String token = jwtService.generateToken(createUserDetails(user));
        String refreshToken = jwtService.generateToken(createUserDetails(user));
        
        log.info("Admin login successful: {} ({})", user.getEmail(), user.getRole());
        
        return AdminAuthResponse.builder()
            .token(token)
            .refreshToken(refreshToken)
            .type("Bearer")
            .userId(user.getId())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .role(user.getRole())
            .permissions(permissions)
            .build();
    }
    
    public AdminAuthResponse refreshToken(String refreshToken) {
        String userEmail = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        UserDetails userDetails = createUserDetails(user);
        
        if (!jwtService.validateToken(refreshToken, userDetails)) {
            throw new BadCredentialsException("Invalid refresh token");
        }
        
        if (!isAdminRole(user.getRole()) || !user.getActive()) {
            throw new BadCredentialsException("Access denied");
        }
        
        List<String> permissions = getPermissionsForRole(user.getRole());
        String newToken = jwtService.generateToken(userDetails);
        String newRefreshToken = jwtService.generateToken(userDetails);
        
        return AdminAuthResponse.builder()
            .token(newToken)
            .refreshToken(newRefreshToken)
            .type("Bearer")
            .userId(user.getId())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .role(user.getRole())
            .permissions(permissions)
            .build();
    }
    
    private boolean isAdminRole(Role role) {
        return role == Role.SUPER_ADMIN || role == Role.ADMIN || role == Role.STAFF;
    }
    
    private List<String> getPermissionsForRole(Role role) {
        try {
            return rolePermissionRepository.findByRoleName(role.name())
                .map(rolePermission -> {
                    try {
                        return objectMapper.readValue(
                            rolePermission.getPermissions(), 
                            new TypeReference<List<String>>() {}
                        );
                    } catch (Exception e) {
                        log.error("Failed to parse permissions for role: {}", role.name(), e);
                        return new ArrayList<String>();
                    }
                })
                .orElse(new ArrayList<>());
        } catch (Exception e) {
            log.error("Failed to get permissions for role: {}", role.name(), e);
            return new ArrayList<>();
        }
    }
    
    private UserDetails createUserDetails(User user) {
        return org.springframework.security.core.userdetails.User.builder()
            .username(user.getEmail())
            .password(user.getPassword())
            .roles(user.getRole().name())
            .build();
    }
}
