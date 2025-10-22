-- =========================================================================
-- ADMIN PANEL PHASE 2 - Database Schema Additions
-- =========================================================================

-- Add active column to users if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;

-- =========================================================================
-- Admin Roles & Permissions
-- =========================================================================
CREATE TABLE IF NOT EXISTS admin_roles_permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    permissions TEXT NOT NULL,
    description VARCHAR(500),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
);

-- =========================================================================
-- Admin Audit Logs
-- =========================================================================
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_user_id BIGINT NOT NULL,
    entity VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    action VARCHAR(50) NOT NULL,
    metadata TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_admin_user (admin_user_id),
    INDEX idx_entity (entity, entity_id),
    INDEX idx_created_at (created_at)
);

-- =========================================================================
-- Coupons
-- =========================================================================
CREATE TABLE IF NOT EXISTS coupons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_amount DECIMAL(10, 2),
    usage_limit INT DEFAULT NULL,
    usage_count INT DEFAULT 0,
    valid_from DATETIME(6) NOT NULL,
    valid_to DATETIME(6) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_by BIGINT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_code (code),
    INDEX idx_valid_dates (valid_from, valid_to),
    INDEX idx_status (status)
);

-- =========================================================================
-- Coupon Usage
-- =========================================================================
CREATE TABLE IF NOT EXISTS coupon_usage (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    coupon_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    discount_amount DECIMAL(10, 2) NOT NULL,
    used_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_coupon_user (coupon_id, user_id)
);

-- =========================================================================
-- Inventory Movements
-- =========================================================================
CREATE TABLE IF NOT EXISTS inventory_movements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    delta INT NOT NULL,
    reason VARCHAR(50) NOT NULL,
    reference_type VARCHAR(50),
    reference_id BIGINT,
    notes TEXT,
    admin_user_id BIGINT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_product (product_id),
    INDEX idx_created_at (created_at)
);

-- =========================================================================
-- Stock Alerts
-- =========================================================================
CREATE TABLE IF NOT EXISTS stock_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    threshold INT NOT NULL DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    last_alerted_at DATETIME(6),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_alert (product_id)
);

-- =========================================================================
-- Payments
-- =========================================================================
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    provider VARCHAR(50) DEFAULT 'RAZORPAY',
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    captured_at DATETIME(6),
    refunded_amount DECIMAL(10, 2) DEFAULT 0,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_razorpay_payment (razorpay_payment_id),
    INDEX idx_status (status)
);

-- =========================================================================
-- Refunds
-- =========================================================================
CREATE TABLE IF NOT EXISTS refunds (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT NOT NULL,
    razorpay_refund_id VARCHAR(100),
    amount DECIMAL(10, 2) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    initiated_by BIGINT NOT NULL,
    initiated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    completed_at DATETIME(6),
    provider_response TEXT,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    FOREIGN KEY (initiated_by) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_payment (payment_id),
    INDEX idx_status (status)
);

-- =========================================================================
-- Notification Outbox
-- =========================================================================
CREATE TABLE IF NOT EXISTS notifications_outbox (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    template_id VARCHAR(100) NOT NULL,
    payload TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    attempts INT DEFAULT 0,
    last_error TEXT,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    sent_at DATETIME(6),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- =========================================================================
-- Notification Templates
-- =========================================================================
CREATE TABLE IF NOT EXISTS notification_templates (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL,
    subject VARCHAR(255),
    body_template TEXT NOT NULL,
    variables TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_type (type)
);

-- =========================================================================
-- Seed Admin Role Permissions
-- =========================================================================
INSERT INTO admin_roles_permissions (role_name, permissions, description) VALUES
('ADMIN', '["MANAGE_PRODUCTS", "MANAGE_ORDERS", "MANAGE_COUPONS", "VIEW_ANALYTICS", "MANAGE_INVENTORY"]', 'Standard admin with full product and order management'),
('SUPER_ADMIN', '["ALL"]', 'Super administrator with all permissions including user management'),
('STAFF', '["VIEW_PRODUCTS", "VIEW_ORDERS", "VIEW_ANALYTICS"]', 'Staff with view-only access')
ON DUPLICATE KEY UPDATE permissions=VALUES(permissions), description=VALUES(description);

-- =========================================================================
-- Seed Notification Templates
-- =========================================================================
INSERT INTO notification_templates (id, name, type, subject, body_template, variables) VALUES
('ORDER_PLACED_EMAIL', 'Order Placed - Email', 'EMAIL', 'Order #{orderNumber} Confirmed', 
'<h1>Thank you for your order!</h1><p>Dear {customerName},</p><p>Your order #{orderNumber} for ₹{amount} has been confirmed.</p><p>Expected delivery: {deliveryDate}</p>', 
'{"customerName":"string","orderNumber":"string","amount":"decimal","deliveryDate":"date"}'),

('ORDER_PLACED_SMS', 'Order Placed - SMS', 'SMS', NULL, 
'Hi {customerName}, your order #{orderNumber} for ₹{amount} is confirmed! Expected delivery: {deliveryDate}. Track: {trackingLink}', 
'{"customerName":"string","orderNumber":"string","amount":"decimal","deliveryDate":"date","trackingLink":"url"}'),

('ORDER_SHIPPED_EMAIL', 'Order Shipped - Email', 'EMAIL', 'Your Order #{orderNumber} Has Shipped!', 
'<h1>Your order is on its way!</h1><p>Dear {customerName},</p><p>Your order #{orderNumber} has been shipped.</p><p>Tracking: {trackingNumber}</p>', 
'{"customerName":"string","orderNumber":"string","trackingNumber":"string"}'),

('ORDER_SHIPPED_SMS', 'Order Shipped - SMS', 'SMS', NULL, 
'Your order #{orderNumber} has shipped! Track: {trackingLink}', 
'{"orderNumber":"string","trackingLink":"url"}'),

('LOW_STOCK_ALERT', 'Low Stock Alert - Email', 'EMAIL', 'Low Stock Alert: {productName}', 
'<h1>Low Stock Alert</h1><p>Product: {productName}</p><p>Current stock: {stockCount} units</p><p>Threshold: {threshold} units</p>', 
'{"productName":"string","stockCount":"number","threshold":"number"}'),

('NEW_ORDER_ADMIN', 'New Order Alert - Admin', 'EMAIL', 'New Order #{orderNumber}', 
'<h1>New Order Received</h1><p>Order: #{orderNumber}</p><p>Customer: {customerName}</p><p>Amount: ₹{amount}</p>', 
'{"orderNumber":"string","customerName":"string","amount":"decimal"}')

ON DUPLICATE KEY UPDATE name=VALUES(name), subject=VALUES(subject), body_template=VALUES(body_template), variables=VALUES(variables);
