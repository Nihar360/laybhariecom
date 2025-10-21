package com.laybhariecom.demo.admin.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications_outbox")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationOutbox {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NotificationType type;
    
    @Column(nullable = false)
    private String recipient;
    
    @Column(name = "template_id", nullable = false, length = 100)
    private String templateId;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String payload;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private NotificationStatus status = NotificationStatus.PENDING;
    
    @Column(nullable = false)
    private Integer attempts = 0;
    
    @Column(name = "last_error", columnDefinition = "TEXT")
    private String lastError;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "sent_at")
    private LocalDateTime sentAt;
    
    public enum NotificationType {
        EMAIL,
        SMS
    }
    
    public enum NotificationStatus {
        PENDING,
        SENT,
        FAILED
    }
}
