package com.laybhariecom.demo.admin.repository;

import com.laybhariecom.demo.admin.model.AdminAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface AdminAuditLogRepository extends JpaRepository<AdminAuditLog, Long> {
    
    Page<AdminAuditLog> findByAdminUserIdOrderByCreatedAtDesc(Long adminUserId, Pageable pageable);
    
    Page<AdminAuditLog> findByEntityOrderByCreatedAtDesc(String entity, Pageable pageable);
    
    Page<AdminAuditLog> findByCreatedAtBetweenOrderByCreatedAtDesc(
        LocalDateTime start, 
        LocalDateTime end, 
        Pageable pageable
    );
    
    Page<AdminAuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
