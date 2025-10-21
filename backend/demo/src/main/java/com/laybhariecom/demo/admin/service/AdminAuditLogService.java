package com.laybhariecom.demo.admin.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.laybhariecom.demo.admin.model.AdminAuditLog;
import com.laybhariecom.demo.admin.repository.AdminAuditLogRepository;
import com.laybhariecom.demo.model.User;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminAuditLogService {
    
    private final AdminAuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;
    
    @Async
    @Transactional
    public void logAction(
        User adminUser, 
        String entity, 
        Long entityId, 
        String action, 
        Map<String, Object> metadata,
        HttpServletRequest request
    ) {
        try {
            String metadataJson = metadata != null ? objectMapper.writeValueAsString(metadata) : null;
            
            AdminAuditLog auditLog = AdminAuditLog.builder()
                .adminUser(adminUser)
                .entity(entity)
                .entityId(entityId)
                .action(action)
                .metadata(metadataJson)
                .ipAddress(getClientIp(request))
                .userAgent(request.getHeader("User-Agent"))
                .build();
            
            auditLogRepository.save(auditLog);
            
            log.info("Audit log created: {} performed {} on {} (ID: {})", 
                adminUser.getEmail(), action, entity, entityId);
                
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize audit log metadata", e);
        } catch (Exception e) {
            log.error("Failed to create audit log", e);
        }
    }
    
    public Page<AdminAuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
    
    public Page<AdminAuditLog> getAuditLogsByUser(Long userId, Pageable pageable) {
        return auditLogRepository.findByAdminUserIdOrderByCreatedAtDesc(userId, pageable);
    }
    
    public Page<AdminAuditLog> getAuditLogsByEntity(String entity, Pageable pageable) {
        return auditLogRepository.findByEntityOrderByCreatedAtDesc(entity, pageable);
    }
    
    public Page<AdminAuditLog> getAuditLogsByDateRange(
        LocalDateTime start, 
        LocalDateTime end, 
        Pageable pageable
    ) {
        return auditLogRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end, pageable);
    }
    
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip != null && ip.contains(",") ? ip.split(",")[0].trim() : ip;
    }
}
