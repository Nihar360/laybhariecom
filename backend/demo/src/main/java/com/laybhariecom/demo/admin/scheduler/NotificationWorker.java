package com.laybhariecom.demo.admin.scheduler;

import com.laybhariecom.demo.admin.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Background worker to process notification outbox queue
 * Runs every minute to send pending notifications
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationWorker {
    
    private final NotificationService notificationService;
    
    /**
     * Process pending notifications every minute
     */
    @Scheduled(fixedDelayString = "${notifications.worker.interval:60000}") // 60 seconds
    public void processNotifications() {
        try {
            log.debug("Starting notification worker...");
            notificationService.processPendingNotifications();
            log.debug("Notification worker completed");
        } catch (Exception e) {
            log.error("Error in notification worker", e);
        }
    }
}
