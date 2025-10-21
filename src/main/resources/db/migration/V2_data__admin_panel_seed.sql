-- =========================================================================
-- ADMIN PANEL PHASE 2 - Seed Data
-- =========================================================================

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

('ORDER_DELIVERED_EMAIL', 'Order Delivered - Email', 'EMAIL', 'Your Order #{orderNumber} Has Been Delivered!', 
'<h1>Order Delivered!</h1><p>Dear {customerName},</p><p>Your order #{orderNumber} has been delivered.</p><p>Thank you for shopping with us!</p>', 
'{"customerName":"string","orderNumber":"string"}'),

('LOW_STOCK_ALERT', 'Low Stock Alert - Email', 'EMAIL', 'Low Stock Alert: {productName}', 
'<h1>Low Stock Alert</h1><p>Product: {productName}</p><p>Current stock: {stockCount} units</p><p>Threshold: {threshold} units</p><p>Please restock immediately.</p>', 
'{"productName":"string","stockCount":"number","threshold":"number"}'),

('NEW_ORDER_ADMIN', 'New Order Alert - Admin', 'EMAIL', 'New Order #{orderNumber}', 
'<h1>New Order Received</h1><p>Order: #{orderNumber}</p><p>Customer: {customerName}</p><p>Amount: ₹{amount}</p><p>Payment: {paymentMethod}</p>', 
'{"orderNumber":"string","customerName":"string","amount":"decimal","paymentMethod":"string"}'),

('REFUND_PROCESSED_EMAIL', 'Refund Processed - Email', 'EMAIL', 'Refund Processed for Order #{orderNumber}', 
'<h1>Refund Processed</h1><p>Dear {customerName},</p><p>Your refund of ₹{refundAmount} for order #{orderNumber} has been processed.</p><p>Please allow 5-7 business days for the amount to reflect in your account.</p>', 
'{"customerName":"string","orderNumber":"string","refundAmount":"decimal"}')

ON DUPLICATE KEY UPDATE name=VALUES(name), subject=VALUES(subject), body_template=VALUES(body_template), variables=VALUES(variables);

-- =========================================================================
-- Update Existing Users to be Active
-- =========================================================================
UPDATE users SET active = TRUE WHERE active IS NULL;
