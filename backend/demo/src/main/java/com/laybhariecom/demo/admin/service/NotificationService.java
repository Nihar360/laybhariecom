package com.laybhariecom.demo.admin.service;

import com.laybhariecom.demo.admin.model.NotificationOutbox;
import com.laybhariecom.demo.admin.model.NotificationTemplate;
import com.laybhariecom.demo.admin.repository.NotificationOutboxRepository;
import com.laybhariecom.demo.admin.repository.NotificationTemplateRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final NotificationOutboxRepository notificationOutboxRepository;
    private final NotificationTemplateRepository notificationTemplateRepository;
    private final ObjectMapper objectMapper;
    
    @Value("${twilio.enabled:false}")
    private boolean twilioEnabled;
    
    @Value("${sendgrid.enabled:false}")
    private boolean sendgridEnabled;
    
    @Value("${notifications.max-retries:3}")
    private int maxRetries;
    
    /**
     * Queue an email notification for sending
     */
    @Transactional
    public NotificationOutbox queueEmail(String recipient, String templateId, Map<String, Object> payload) {
        try {
            String payloadJson = objectMapper.writeValueAsString(payload);
            
            NotificationOutbox notification = NotificationOutbox.builder()
                .type(NotificationOutbox.NotificationType.EMAIL)
                .recipient(recipient)
                .templateId(templateId)
                .payload(payloadJson)
                .status(NotificationOutbox.NotificationStatus.PENDING)
                .attempts(0)
                .build();
            
            NotificationOutbox saved = notificationOutboxRepository.save(notification);
            log.info("Email notification queued - ID: {}, Recipient: {}, Template: {}", 
                saved.getId(), recipient, templateId);
            
            return saved;
            
        } catch (Exception e) {
            log.error("Failed to queue email notification", e);
            throw new RuntimeException("Failed to queue email notification", e);
        }
    }
    
    /**
     * Queue an SMS notification for sending
     */
    @Transactional
    public NotificationOutbox queueSms(String recipient, String templateId, Map<String, Object> payload) {
        try {
            String payloadJson = objectMapper.writeValueAsString(payload);
            
            NotificationOutbox notification = NotificationOutbox.builder()
                .type(NotificationOutbox.NotificationType.SMS)
                .recipient(recipient)
                .templateId(templateId)
                .payload(payloadJson)
                .status(NotificationOutbox.NotificationStatus.PENDING)
                .attempts(0)
                .build();
            
            NotificationOutbox saved = notificationOutboxRepository.save(notification);
            log.info("SMS notification queued - ID: {}, Recipient: {}, Template: {}", 
                saved.getId(), recipient, templateId);
            
            return saved;
            
        } catch (Exception e) {
            log.error("Failed to queue SMS notification", e);
            throw new RuntimeException("Failed to queue SMS notification", e);
        }
    }
    
    /**
     * Send a notification immediately (used for testing)
     */
    public void sendNow(String recipient, String templateId, Map<String, Object> payload, NotificationOutbox.NotificationType type) {
        NotificationTemplate template = notificationTemplateRepository.findById(templateId)
            .orElseThrow(() -> new RuntimeException("Template not found: " + templateId));
        
        if (!template.getIsActive()) {
            throw new RuntimeException("Template is inactive: " + templateId);
        }
        
        String body = replaceVariables(template.getBodyTemplate(), payload);
        
        if (type == NotificationOutbox.NotificationType.EMAIL) {
            sendEmailNow(recipient, template.getSubject(), body);
        } else if (type == NotificationOutbox.NotificationType.SMS) {
            sendSmsNow(recipient, body);
        }
    }
    
    /**
     * Send email notification using SendGrid
     */
    @Async
    public void sendEmailNow(String to, String subject, String body) {
        try {
            if (!sendgridEnabled) {
                log.warn("SendGrid is not enabled. Email not sent to: {}", to);
                return;
            }
            
            // TODO: Implement SendGrid integration using Replit connector
            // This will be set up through the SendGrid integration
            // Example implementation:
            // SendGrid sg = new SendGrid(sendGridApiKey);
            // Email from = new Email(fromEmail);
            // Email toEmail = new Email(to);
            // Content content = new Content("text/html", body);
            // Mail mail = new Mail(from, subject, toEmail, content);
            // Request request = new Request();
            // request.setMethod(Method.POST);
            // request.setEndpoint("mail/send");
            // request.setBody(mail.build());
            // Response response = sg.api(request);
            
            log.info("Email would be sent to: {} with subject: {}", to, subject);
            
        } catch (Exception e) {
            log.error("Failed to send email to: {}", to, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }
    
    /**
     * Send SMS notification using Twilio
     */
    @Async
    public void sendSmsNow(String to, String message) {
        try {
            if (!twilioEnabled) {
                log.warn("Twilio is not enabled. SMS not sent to: {}", to);
                return;
            }
            
            // TODO: Implement Twilio integration using Replit connector
            // This will be set up through the Twilio integration
            // Example implementation:
            // Twilio.init(twilioAccountSid, twilioAuthToken);
            // Message twilioMessage = Message.creator(
            //     new PhoneNumber(to),
            //     new PhoneNumber(twilioPhoneNumber),
            //     message
            // ).create();
            
            log.info("SMS would be sent to: {} with message: {}", to, message);
            
        } catch (Exception e) {
            log.error("Failed to send SMS to: {}", to, e);
            throw new RuntimeException("Failed to send SMS", e);
        }
    }
    
    /**
     * Process pending notifications in the outbox
     * This should be called by a scheduled task
     */
    @Transactional
    public void processPendingNotifications() {
        var pendingNotifications = notificationOutboxRepository
            .findByStatusOrderByCreatedAtAsc(NotificationOutbox.NotificationStatus.PENDING);
        
        for (NotificationOutbox notification : pendingNotifications) {
            try {
                if (notification.getAttempts() >= maxRetries) {
                    notification.setStatus(NotificationOutbox.NotificationStatus.FAILED);
                    notification.setLastError("Max retries exceeded");
                    notificationOutboxRepository.save(notification);
                    log.error("Notification failed after {} retries: ID {}", maxRetries, notification.getId());
                    continue;
                }
                
                processNotification(notification);
                
            } catch (Exception e) {
                log.error("Error processing notification ID: {}", notification.getId(), e);
                notification.setAttempts(notification.getAttempts() + 1);
                notification.setLastError(e.getMessage());
                notificationOutboxRepository.save(notification);
            }
        }
    }
    
    /**
     * Process a single notification
     */
    @Transactional
    protected void processNotification(NotificationOutbox notification) {
        try {
            NotificationTemplate template = notificationTemplateRepository.findById(notification.getTemplateId())
                .orElseThrow(() -> new RuntimeException("Template not found: " + notification.getTemplateId()));
            
            if (!template.getIsActive()) {
                throw new RuntimeException("Template is inactive: " + notification.getTemplateId());
            }
            
            Map<String, Object> payload = objectMapper.readValue(notification.getPayload(), Map.class);
            String body = replaceVariables(template.getBodyTemplate(), payload);
            
            if (notification.getType() == NotificationOutbox.NotificationType.EMAIL) {
                sendEmailNow(notification.getRecipient(), template.getSubject(), body);
            } else if (notification.getType() == NotificationOutbox.NotificationType.SMS) {
                sendSmsNow(notification.getRecipient(), body);
            }
            
            notification.setStatus(NotificationOutbox.NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            notification.setAttempts(notification.getAttempts() + 1);
            notificationOutboxRepository.save(notification);
            
            log.info("Notification sent successfully: ID {}", notification.getId());
            
        } catch (Exception e) {
            log.error("Failed to process notification: ID {}", notification.getId(), e);
            throw new RuntimeException("Failed to process notification", e);
        }
    }
    
    /**
     * Replace variables in template with actual values
     */
    private String replaceVariables(String template, Map<String, Object> variables) {
        String result = template;
        Pattern pattern = Pattern.compile("\\{([^}]+)\\}");
        Matcher matcher = pattern.matcher(template);
        
        while (matcher.find()) {
            String variableName = matcher.group(1);
            Object value = variables.get(variableName);
            if (value != null) {
                result = result.replace("{" + variableName + "}", value.toString());
            }
        }
        
        return result;
    }
}
