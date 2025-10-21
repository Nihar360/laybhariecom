package com.laybhariecom.demo.admin.service;

import com.laybhariecom.demo.admin.dto.request.CreateCouponRequest;
import com.laybhariecom.demo.admin.dto.request.UpdateCouponRequest;
import com.laybhariecom.demo.admin.dto.response.CouponResponse;
import com.laybhariecom.demo.admin.model.Coupon;
import com.laybhariecom.demo.admin.repository.CouponRepository;
import com.laybhariecom.demo.exception.BadRequestException;
import com.laybhariecom.demo.exception.ResourceNotFoundException;
import com.laybhariecom.demo.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CouponService {
    
    private final CouponRepository couponRepository;
    
    public List<CouponResponse> getAllCoupons() {
        return couponRepository.findAll()
            .stream()
            .map(this::mapToCouponResponse)
            .collect(Collectors.toList());
    }
    
    public CouponResponse getCouponById(Long id) {
        Coupon coupon = couponRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with ID: " + id));
        return mapToCouponResponse(coupon);
    }
    
    @Transactional
    public CouponResponse createCoupon(CreateCouponRequest request, User createdBy) {
        if (couponRepository.existsByCodeIgnoreCase(request.getCode())) {
            throw new BadRequestException("Coupon code already exists: " + request.getCode());
        }
        
        if (request.getValidTo().isBefore(request.getValidFrom())) {
            throw new BadRequestException("Valid to date must be after valid from date");
        }
        
        Coupon coupon = Coupon.builder()
            .code(request.getCode().toUpperCase())
            .type(request.getType())
            .value(request.getValue())
            .minOrderAmount(request.getMinOrderAmount())
            .maxDiscountAmount(request.getMaxDiscountAmount())
            .usageLimit(request.getUsageLimit())
            .usageCount(0)
            .validFrom(request.getValidFrom())
            .validTo(request.getValidTo())
            .status(Coupon.CouponStatus.ACTIVE)
            .createdBy(createdBy)
            .build();
        
        Coupon savedCoupon = couponRepository.save(coupon);
        log.info("Coupon created - Code: {}, Type: {}", savedCoupon.getCode(), savedCoupon.getType());
        
        return mapToCouponResponse(savedCoupon);
    }
    
    @Transactional
    public CouponResponse updateCoupon(Long id, UpdateCouponRequest request) {
        Coupon coupon = couponRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with ID: " + id));
        
        if (request.getType() != null) {
            coupon.setType(request.getType());
        }
        if (request.getValue() != null) {
            coupon.setValue(request.getValue());
        }
        if (request.getMinOrderAmount() != null) {
            coupon.setMinOrderAmount(request.getMinOrderAmount());
        }
        if (request.getMaxDiscountAmount() != null) {
            coupon.setMaxDiscountAmount(request.getMaxDiscountAmount());
        }
        if (request.getUsageLimit() != null) {
            coupon.setUsageLimit(request.getUsageLimit());
        }
        if (request.getValidFrom() != null) {
            coupon.setValidFrom(request.getValidFrom());
        }
        if (request.getValidTo() != null) {
            if (coupon.getValidFrom() != null && request.getValidTo().isBefore(coupon.getValidFrom())) {
                throw new BadRequestException("Valid to date must be after valid from date");
            }
            coupon.setValidTo(request.getValidTo());
        }
        
        Coupon updatedCoupon = couponRepository.save(coupon);
        log.info("Coupon updated - ID: {}, Code: {}", id, updatedCoupon.getCode());
        
        return mapToCouponResponse(updatedCoupon);
    }
    
    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with ID: " + id));
        
        couponRepository.delete(coupon);
        log.info("Coupon deleted - ID: {}, Code: {}", id, coupon.getCode());
    }
    
    @Transactional
    public CouponResponse activateCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with ID: " + id));
        
        coupon.setStatus(Coupon.CouponStatus.ACTIVE);
        Coupon updatedCoupon = couponRepository.save(coupon);
        
        log.info("Coupon activated - ID: {}, Code: {}", id, updatedCoupon.getCode());
        return mapToCouponResponse(updatedCoupon);
    }
    
    @Transactional
    public CouponResponse deactivateCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with ID: " + id));
        
        coupon.setStatus(Coupon.CouponStatus.INACTIVE);
        Coupon updatedCoupon = couponRepository.save(coupon);
        
        log.info("Coupon deactivated - ID: {}, Code: {}", id, updatedCoupon.getCode());
        return mapToCouponResponse(updatedCoupon);
    }
    
    private CouponResponse mapToCouponResponse(Coupon coupon) {
        return CouponResponse.builder()
            .id(coupon.getId())
            .code(coupon.getCode())
            .type(coupon.getType())
            .value(coupon.getValue())
            .minOrderAmount(coupon.getMinOrderAmount())
            .maxDiscountAmount(coupon.getMaxDiscountAmount())
            .usageLimit(coupon.getUsageLimit())
            .usageCount(coupon.getUsageCount())
            .validFrom(coupon.getValidFrom())
            .validTo(coupon.getValidTo())
            .status(coupon.getStatus())
            .createdByEmail(coupon.getCreatedBy() != null ? coupon.getCreatedBy().getEmail() : null)
            .createdAt(coupon.getCreatedAt())
            .updatedAt(coupon.getUpdatedAt())
            .build();
    }
}
