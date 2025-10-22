package com.laybhariecom.demo.controller;

import com.laybhariecom.demo.dto.response.ApiResponse;
import com.laybhariecom.demo.model.User;
import com.laybhariecom.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse> getProfile(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        
        Map<String, Object> userProfile = new HashMap<>();
        userProfile.put("id", user.getId());
        userProfile.put("fullName", user.getFullName());
        userProfile.put("email", user.getEmail());
        userProfile.put("mobile", user.getPhone());
        userProfile.put("role", user.getRole());
        userProfile.put("active", user.getActive());
        userProfile.put("createdAt", user.getCreatedAt());
        
        return ResponseEntity.ok(new ApiResponse(true, "Profile retrieved successfully", userProfile));
    }
}
