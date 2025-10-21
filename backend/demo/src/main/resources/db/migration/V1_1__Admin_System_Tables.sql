-- =========================================================================
-- ADMIN PANEL - PHASE 1: Foundation & Authentication
-- Migration Version: 1.1
-- Created: October 21, 2025
-- =========================================================================

-- =========================================================================
-- 1. Admin Roles & Permissions Table
-- =========================================================================
CREATE TABLE IF NOT EXISTS admin_roles_permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    permissions JSON NOT NULL,
    description VARCHAR(500),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_role_name (role_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 2. Admin Audit Logs Table
-- =========================================================================
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_user_id BIGINT NOT NULL,
    entity VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    action VARCHAR(50) NOT NULL,
    metadata JSON,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    FOREIGN KEY (admin_user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_admin_user (admin_user_id),
    INDEX idx_entity (entity, entity_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- 3. Insert Default Admin Roles & Permissions
-- =========================================================================
INSERT INTO admin_roles_permissions (role_name, permissions, description) VALUES
('SUPER_ADMIN', 
 '{"dashboard": ["view"], "products": ["view", "create", "edit", "delete"], "orders": ["view", "edit", "refund", "cancel"], "inventory": ["view", "adjust"], "coupons": ["view", "create", "edit", "delete"], "users": ["view", "edit", "delete"], "settings": ["view", "edit"], "audit": ["view"]}',
 'Full system access with all permissions'),
('ADMIN',
 '{"dashboard": ["view"], "products": ["view", "create", "edit"], "orders": ["view", "edit"], "inventory": ["view", "adjust"], "coupons": ["view", "create", "edit"], "users": ["view", "edit"], "settings": ["view"]}',
 'Standard admin with most permissions except critical operations'),
('STAFF',
 '{"dashboard": ["view"], "products": ["view"], "orders": ["view", "edit"], "inventory": ["view"], "users": ["view"]}',
 'Limited access for support staff')
ON DUPLICATE KEY UPDATE permissions = VALUES(permissions), description = VALUES(description);

-- =========================================================================
-- 4. Seed Super Admin Account (Password: Admin@123)
-- Note: Password hash is bcrypt($2a$10$) for "Admin@123"
-- Change password after first login!
-- =========================================================================
INSERT INTO users (full_name, email, password, role, active, created_at, updated_at)
VALUES (
    'Super Admin',
    'admin@spicehouse.com',
    '$2a$10$ZKPvvGXPJZjD8x8YhGqJ7e0K5RJXQJCqBqLH5kXNqI4kYWE5KGqVK',
    'SUPER_ADMIN',
    true,
    NOW(6),
    NOW(6)
)
ON DUPLICATE KEY UPDATE role = 'SUPER_ADMIN', active = true;

-- =========================================================================
-- 5. Add indexes to existing tables for admin queries
-- =========================================================================
-- Add index on orders status for fast filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Add index on orders order_date for date range queries
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);

-- Add index on users role for admin filtering  
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- =========================================================================
-- Migration Complete
-- =========================================================================
