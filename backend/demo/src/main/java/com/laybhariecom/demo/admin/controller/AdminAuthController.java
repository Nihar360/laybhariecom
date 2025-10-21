package com.laybhariecom.demo.admin.controller;

import com.laybhariecom.demo.admin.dto.AdminAuthResponse;
import com.laybhariecom.demo.admin.dto.AdminLoginRequest;
import com.laybhariecom.demo.admin.dto.RefreshTokenRequest;
import com.laybhariecom.demo.admin.service.AdminAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AdminAuthController {
    
    private final AdminAuthService adminAuthService;
    
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
    public ResponseEntity<?> verifyToken() {
        return ResponseEntity.ok().body("{\"valid\": true}");
    }
}
