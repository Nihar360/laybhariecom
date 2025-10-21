package com.laybhariecom.demo.admin.controller;

import com.laybhariecom.demo.admin.dto.AdminAuthResponse;
import com.laybhariecom.demo.admin.dto.AdminLoginRequest;
import com.laybhariecom.demo.admin.dto.RefreshTokenRequest;
import com.laybhariecom.demo.admin.service.AdminAuthService;
import com.laybhariecom.demo.model.User;
import com.laybhariecom.demo.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AdminAuthController {
    
    private final AdminAuthService adminAuthService;
    private final UserRepository userRepository;
    
    @PostMapping("/login")
    public ResponseEntity<AdminAuthResponse> adminLogin(@Valid @RequestBody AdminLoginRequest request) {
        log.info("Admin login attempt for: {}", request.getEmail());
        AdminAuthResponse response = adminAuthService.adminLogin(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<AdminAuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Admin token refresh requested");
        AdminAuthResponse response = adminAuthService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(
        Authentication authentication,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            log.warn("Token verification failed: No authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"valid\": false, \"message\": \"Not authenticated\"}");
        }
        
        if (userDetails == null) {
            log.warn("Token verification failed: No user details");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"valid\": false, \"message\": \"User details not found\"}");
        }
        
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElse(null);
        
        if (user == null) {
            log.warn("Token verification failed: User not found - {}", email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("{\"valid\": false, \"message\": \"User not found\"}");
        }
        
        if (!user.getActive()) {
            log.warn("Token verification failed: Inactive user - {}", email);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("{\"valid\": false, \"message\": \"Account is inactive\"}");
        }
        
        boolean isAdmin = user.getRole().name().equals("SUPER_ADMIN") || 
                         user.getRole().name().equals("ADMIN") || 
                         user.getRole().name().equals("STAFF");
        
        if (!isAdmin) {
            log.warn("Token verification failed: Not an admin user - {}", email);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("{\"valid\": false, \"message\": \"Access denied: Admin privileges required\"}");
        }
        
        log.info("Token verified successfully for admin: {}", email);
        return ResponseEntity.ok()
            .body("{\"valid\": true, \"email\": \"" + email + "\", \"role\": \"" + user.getRole().name() + "\"}");
    }
}
