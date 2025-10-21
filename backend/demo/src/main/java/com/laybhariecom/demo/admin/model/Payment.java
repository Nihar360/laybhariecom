package com.laybhariecom.demo.admin.model;

import com.laybhariecom.demo.model.Order;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @Column(length = 50)
    private String provider = "RAZORPAY";
    
    @Column(name = "razorpay_order_id", length = 100)
    private String razorpayOrderId;
    
    @Column(name = "razorpay_payment_id", length = 100)
    private String razorpayPaymentId;
    
    @Column(name = "razorpay_signature", length = 255)
    private String razorpaySignature;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(length = 10)
    private String currency = "INR";
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private PaymentStatus status = PaymentStatus.PENDING;
    
    @Column(name = "payment_method", length = 50)
    private String paymentMethod;
    
    @Column(name = "captured_at")
    private LocalDateTime capturedAt;
    
    @Column(name = "refunded_amount", precision = 10, scale = 2)
    private BigDecimal refundedAmount = BigDecimal.ZERO;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum PaymentStatus {
        PENDING,
        AUTHORIZED,
        CAPTURED,
        FAILED,
        REFUNDED
    }
}
