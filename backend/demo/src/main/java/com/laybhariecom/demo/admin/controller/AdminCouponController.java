package com.laybhariecom.demo.admin.controller;

import com.laybhariecom.demo.admin.dto.request.CreateCouponRequest;
import com.laybhariecom.demo.admin.dto.request.UpdateCouponRequest;
import com.laybhariecom.demo.admin.dto.response.CouponResponse;
import com.laybhariecom.demo.admin.service.AdminAuditLogService;
import com.laybhariecom.demo.admin.service.CouponService;
import com.laybhariecom.demo.dto.response.ApiResponse;
import com.laybhariecom.demo.model.User;
import com.laybhariecom.demo.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/coupons")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AdminCouponController {
    
    private final CouponService couponService;
    private final AdminAuditLogService auditLogService;
    private final UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getAllCoupons() {
        List<CouponResponse> coupons = couponService.getAllCoupons();
        return ResponseEntity.ok(ApiResponse.success("Coupons retrieved successfully", coupons));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CouponResponse>> getCouponById(@PathVariable Long id) {
        CouponResponse coupon = couponService.getCouponById(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon retrieved successfully", coupon));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<CouponResponse>> createCoupon(
        @Valid @RequestBody CreateCouponRequest request,
        @AuthenticationPrincipal UserDetails userDetails,
        HttpServletRequest httpRequest
    ) {
        User admin = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Admin user not found"));
        
        CouponResponse coupon = couponService.createCoupon(request, admin);
        
        auditLogService.logAction(
            admin,
            "COUPON",
            coupon.getId(),
            "CREATE",
            Map.of("code", coupon.getCode(), "type", coupon.getType(), "value", coupon.getValue()),
            httpRequest
        );
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Coupon created successfully", coupon));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CouponResponse>> updateCoupon(
        @PathVariable Long id,
        @Valid @RequestBody UpdateCouponRequest request,
        @AuthenticationPrincipal UserDetails userDetails,
        HttpServletRequest httpRequest
    ) {
        CouponResponse coupon = couponService.updateCoupon(id, request);
        
        User admin = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (admin != null) {
            auditLogService.logAction(
                admin,
                "COUPON",
                id,
                "UPDATE",
                Map.of("updates", request),
                httpRequest
            );
        }
        
        return ResponseEntity.ok(ApiResponse.success("Coupon updated successfully", coupon));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCoupon(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails,
        HttpServletRequest httpRequest
    ) {
        couponService.deleteCoupon(id);
        
        User admin = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (admin != null) {
            auditLogService.logAction(
                admin,
                "COUPON",
                id,
                "DELETE",
                null,
                httpRequest
            );
        }
        
        return ResponseEntity.ok(ApiResponse.success("Coupon deleted successfully", "Coupon has been removed"));
    }
    
    @PostMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<CouponResponse>> activateCoupon(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails,
        HttpServletRequest httpRequest
    ) {
        CouponResponse coupon = couponService.activateCoupon(id);
        
        User admin = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (admin != null) {
            auditLogService.logAction(
                admin,
                "COUPON",
                id,
                "ACTIVATE",
                Map.of("code", coupon.getCode()),
                httpRequest
            );
        }
        
        return ResponseEntity.ok(ApiResponse.success("Coupon activated successfully", coupon));
    }
    
    @PostMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<CouponResponse>> deactivateCoupon(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetails userDetails,
        HttpServletRequest httpRequest
    ) {
        CouponResponse coupon = couponService.deactivateCoupon(id);
        
        User admin = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        if (admin != null) {
            auditLogService.logAction(
                admin,
                "COUPON",
                id,
                "DEACTIVATE",
                Map.of("code", coupon.getCode()),
                httpRequest
            );
        }
        
        return ResponseEntity.ok(ApiResponse.success("Coupon deactivated successfully", coupon));
    }
}
