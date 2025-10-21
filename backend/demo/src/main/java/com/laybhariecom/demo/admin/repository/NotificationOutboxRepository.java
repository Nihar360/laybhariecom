package com.laybhariecom.demo.admin.repository;

import com.laybhariecom.demo.admin.model.NotificationOutbox;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationOutboxRepository extends JpaRepository<NotificationOutbox, Long> {
    
    List<NotificationOutbox> findByStatus(NotificationOutbox.NotificationStatus status);
    
    @Query("SELECT n FROM NotificationOutbox n WHERE n.status = 'PENDING' AND n.attempts < 3 ORDER BY n.createdAt ASC")
    List<NotificationOutbox> findPendingNotifications();
    
    @Query("SELECT n FROM NotificationOutbox n WHERE n.status = 'FAILED' AND n.attempts >= 3")
    List<NotificationOutbox> findFailedNotifications();
    
    Page<NotificationOutbox> findByTypeOrderByCreatedAtDesc(NotificationOutbox.NotificationType type, Pageable pageable);
    
    Page<NotificationOutbox> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    @Query("SELECT n FROM NotificationOutbox n WHERE n.createdAt BETWEEN :startDate AND :endDate ORDER BY n.createdAt DESC")
    List<NotificationOutbox> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(n) FROM NotificationOutbox n WHERE n.status = 'SENT' AND n.sentAt BETWEEN :startDate AND :endDate")
    long countSentNotificationsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    List<NotificationOutbox> findByStatusOrderByCreatedAtAsc(NotificationOutbox.NotificationStatus status);
}
