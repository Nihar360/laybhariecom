package com.laybhariecom.demo.admin.repository;

import com.laybhariecom.demo.admin.model.NotificationTemplate;
import com.laybhariecom.demo.admin.model.NotificationOutbox;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationTemplateRepository extends JpaRepository<NotificationTemplate, String> {
    
    List<NotificationTemplate> findByType(NotificationOutbox.NotificationType type);
    
    List<NotificationTemplate> findByIsActiveTrue();
    
    @Query("SELECT nt FROM NotificationTemplate nt WHERE nt.type = :type AND nt.isActive = true")
    List<NotificationTemplate> findActiveByType(NotificationOutbox.NotificationType type);
    
    Optional<NotificationTemplate> findByIdAndIsActiveTrue(String id);
}
