package com.laybhariecom.demo.admin.controller;

import com.laybhariecom.demo.admin.dto.request.UpdateUserRequest;
import com.laybhariecom.demo.admin.dto.response.UserDetailResponse;
import com.laybhariecom.demo.admin.service.AdminAuditLogService;
import com.laybhariecom.demo.admin.service.AdminUserService;
import com.laybhariecom.demo.dto.response.ApiResponse;
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

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AdminUserController {
    
    private final AdminUserService adminUserService;
    private final AdminAuditLogService auditLogService;
    private final UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<Page<UserDetailResponse>> getAllUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(defaultValue = "createdAt") String sortBy,
        @RequestParam(defaultValue = "DESC") String sortDirection
    ) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<UserDetailResponse> users = adminUserService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<UserDetailResponse>> searchUsers(@RequestParam String q) {
        List<UserDetailResponse> users = adminUserService.searchUsers(q);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDetailResponse> getUserById(@PathVariable Long id) {
        UserDetailResponse user = adminUserService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDetailResponse>> updateUser(
        @PathVariable Long id,
        @Valid @RequestBody UpdateUserRequest request,
        @AuthenticationPrincipal UserDetails userDetails,
        HttpServletRequest httpRequest
    ) {
        UserDetailResponse updatedUser = adminUserService.updateUser(id, request);
        
        User admin = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (admin != null) {
            auditLogService.logAction(
                admin,
                "USER",
                id,
                "UPDATE",
                Map.of("updates", request),
                httpRequest
            );
        }
        
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updatedUser));
    }
    
    @PostMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<String>> activateUser(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails,
        HttpServletRequest httpRequest
    ) {
        adminUserService.activateUser(id);
        
        User admin = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (admin != null) {
            auditLogService.logAction(
                admin,
                "USER",
                id,
                "ACTIVATE",
                null,
                httpRequest
            );
        }
        
        return ResponseEntity.ok(ApiResponse.success("User activated successfully", "User is now active"));
    }
    
    @PostMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<String>> deactivateUser(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails,
        HttpServletRequest httpRequest
    ) {
        adminUserService.deactivateUser(id);
        
        User admin = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (admin != null) {
            auditLogService.logAction(
                admin,
                "USER",
                id,
                "DEACTIVATE",
                null,
                httpRequest
            );
        }
        
        return ResponseEntity.ok(ApiResponse.success("User deactivated successfully", "User is now inactive"));
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        long totalUsers = adminUserService.getTotalUserCount();
        long activeUsers = adminUserService.getActiveUserCount();
        
        return ResponseEntity.ok(Map.of(
            "totalUsers", totalUsers,
            "activeUsers", activeUsers,
            "inactiveUsers", totalUsers - activeUsers
        ));
    }
}
