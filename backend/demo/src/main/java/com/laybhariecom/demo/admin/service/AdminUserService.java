package com.laybhariecom.demo.admin.service;

import com.laybhariecom.demo.admin.dto.request.UpdateUserRequest;
import com.laybhariecom.demo.admin.dto.response.UserDetailResponse;
import com.laybhariecom.demo.exception.ResourceNotFoundException;
import com.laybhariecom.demo.model.User;
import com.laybhariecom.demo.repository.OrderRepository;
import com.laybhariecom.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminUserService {
    
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    
    public Page<UserDetailResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToUserDetailResponse);
    }
    
    public List<UserDetailResponse> searchUsers(String searchTerm) {
        return userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(searchTerm, searchTerm)
            .stream()
            .map(this::mapToUserDetailResponse)
            .collect(Collectors.toList());
    }
    
    public UserDetailResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        return mapToUserDetailResponse(user);
    }
    
    @Transactional
    public UserDetailResponse updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);
        
        log.info("User updated - ID: {}, Email: {}", userId, updatedUser.getEmail());
        return mapToUserDetailResponse(updatedUser);
    }
    
    @Transactional
    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        user.setActive(true);
        userRepository.save(user);
        log.info("User activated - ID: {}, Email: {}", userId, user.getEmail());
    }
    
    @Transactional
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        user.setActive(false);
        userRepository.save(user);
        log.info("User deactivated - ID: {}, Email: {}", userId, user.getEmail());
    }
    
    public long getTotalUserCount() {
        return userRepository.count();
    }
    
    public long getActiveUserCount() {
        return userRepository.findByActiveTrue().size();
    }
    
    private UserDetailResponse mapToUserDetailResponse(User user) {
        // Get user statistics - all methods can return null, so we handle it
        Long totalOrders = orderRepository.countByUserId(user.getId());
        BigDecimal totalSpent = orderRepository.sumTotalAmountByUserId(user.getId());
        LocalDateTime lastOrderDate = orderRepository.findLatestOrderDateByUserId(user.getId());
        
        // Build response with null-safe defaults
        return UserDetailResponse.builder()
            .id(user.getId())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .role(user.getRole())
            .active(user.getActive())
            .totalOrders(totalOrders != null ? totalOrders : 0L)
            .totalSpent(totalSpent != null ? totalSpent : BigDecimal.ZERO)
            .lastOrderDate(lastOrderDate)  // Can be null - that's fine
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .build();
    }
}