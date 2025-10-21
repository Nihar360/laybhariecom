# 🛡️ ADMIN PANEL IMPLEMENTATION PLAN
## E-Commerce Management System

---

## 📋 PROJECT OVERVIEW

This document outlines the complete implementation plan for adding a robust admin panel to the Spring Boot + React e-commerce application with all core management features.

### Current Tech Stack
- **Backend:** Spring Boot 3.2.0 with MySQL (MariaDB 10.11)
- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Database:** MySQL with JWT-based authentication
- **Server Ports:** Backend (8080), Frontend (5000), MySQL (3306)

---

## 🗄️ DATABASE SCHEMA ADDITIONS

### New Tables Required

#### 1. Admin Roles & Permissions
```sql
-- Extend users table
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'CUSTOMER';
-- Possible values: CUSTOMER, ADMIN, SUPER_ADMIN, STAFF

-- Admin roles and permissions
CREATE TABLE admin_roles_permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    permissions JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin audit logs (track all admin actions)
CREATE TABLE admin_audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    admin_user_id BIGINT NOT NULL,
    entity VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    action VARCHAR(50) NOT NULL,
    metadata JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_user_id) REFERENCES users(id),
    INDEX idx_admin_user (admin_user_id),
    INDEX idx_entity (entity, entity_id),
    INDEX idx_created_at (created_at)
);
```

#### 2. Coupon Management
```sql
CREATE TABLE coupons (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING', 'BUY_X_GET_Y') NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_amount DECIMAL(10, 2),
    usage_limit INT DEFAULT NULL,
    usage_count INT DEFAULT 0,
    valid_from TIMESTAMP NOT NULL,
    valid_to TIMESTAMP NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE', 'EXPIRED') DEFAULT 'ACTIVE',
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_code (code),
    INDEX idx_valid_dates (valid_from, valid_to)
);

CREATE TABLE coupon_usage (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    coupon_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    discount_amount DECIMAL(10, 2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    INDEX idx_coupon_user (coupon_id, user_id)
);
```

#### 3. Inventory Management
```sql
CREATE TABLE inventory_movements (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    delta INT NOT NULL,
    reason ENUM('PURCHASE', 'RETURN', 'DAMAGE', 'THEFT', 'ADJUSTMENT', 'RESTOCK') NOT NULL,
    reference_type VARCHAR(50),
    reference_id BIGINT,
    notes TEXT,
    admin_user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (admin_user_id) REFERENCES users(id),
    INDEX idx_product (product_id),
    INDEX idx_created_at (created_at)
);

CREATE TABLE stock_alerts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    threshold INT NOT NULL DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    last_alerted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE KEY unique_product_alert (product_id)
);
```

#### 4. Payment Integration (Razorpay)
```sql
CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    provider VARCHAR(50) DEFAULT 'RAZORPAY',
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status ENUM('PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    captured_at TIMESTAMP,
    refunded_amount DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    INDEX idx_order (order_id),
    INDEX idx_razorpay_payment (razorpay_payment_id),
    INDEX idx_status (status)
);

CREATE TABLE refunds (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    payment_id BIGINT NOT NULL,
    razorpay_refund_id VARCHAR(100),
    amount DECIMAL(10, 2) NOT NULL,
    reason TEXT,
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    initiated_by BIGINT NOT NULL,
    initiated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    provider_response JSON,
    FOREIGN KEY (payment_id) REFERENCES payments(id),
    FOREIGN KEY (initiated_by) REFERENCES users(id),
    INDEX idx_payment (payment_id)
);
```

#### 5. Notification System
```sql
CREATE TABLE notifications_outbox (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('EMAIL', 'SMS') NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    template_id VARCHAR(100) NOT NULL,
    payload JSON NOT NULL,
    status ENUM('PENDING', 'SENT', 'FAILED') DEFAULT 'PENDING',
    attempts INT DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    sent_at TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

CREATE TABLE notification_templates (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('EMAIL', 'SMS') NOT NULL,
    subject VARCHAR(255),
    body_template TEXT NOT NULL,
    variables JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🏗️ BACKEND ARCHITECTURE (Spring Boot)

### Package Structure

```
backend/demo/src/main/java/com/laybhariecom/demo/
├── admin/
│   ├── controller/
│   │   ├── AdminAuthController.java           # Login, refresh token
│   │   ├── AdminDashboardController.java      # Analytics & KPIs
│   │   ├── AdminOrderController.java          # Order management
│   │   ├── AdminProductController.java        # Product CRUD
│   │   ├── AdminInventoryController.java      # Stock management
│   │   ├── AdminCouponController.java         # Coupon CRUD
│   │   ├── AdminUserController.java           # Customer management
│   │   ├── AdminNotificationController.java   # Notification templates
│   │   └── AdminAuditController.java          # View audit logs
│   ├── service/
│   │   ├── AdminAuthService.java
│   │   ├── OrderWorkflowService.java          # Order status transitions
│   │   ├── NotificationService.java           # Email/SMS sender
│   │   ├── PaymentService.java                # Razorpay integration
│   │   ├── FileStorageService.java            # Image uploads
│   │   ├── CouponValidationService.java       # Coupon logic
│   │   ├── InventoryService.java              # Stock tracking
│   │   └── DashboardService.java              # Analytics queries
│   ├── dto/
│   │   ├── request/
│   │   │   ├── AdminLoginRequest.java
│   │   │   ├── ProductCreateRequest.java
│   │   │   ├── OrderActionRequest.java
│   │   │   ├── CouponCreateRequest.java
│   │   │   └── StockAdjustmentRequest.java
│   │   └── response/
│   │       ├── DashboardStatsResponse.java
│   │       ├── OrderDetailResponse.java
│   │       ├── InventoryReportResponse.java
│   │       └── AuditLogResponse.java
│   ├── repository/
│   │   ├── CouponRepository.java
│   │   ├── InventoryMovementRepository.java
│   │   ├── PaymentRepository.java
│   │   ├── RefundRepository.java
│   │   ├── NotificationOutboxRepository.java
│   │   └── AdminAuditLogRepository.java
│   ├── config/
│   │   ├── AdminSecurityConfig.java           # RBAC for /api/admin/**
│   │   └── RazorpayConfig.java                # Razorpay client setup
│   ├── security/
│   │   ├── AdminJwtAuthenticationFilter.java
│   │   └── AdminUserDetailsService.java
│   └── scheduler/
│       ├── NotificationWorker.java            # Process outbox queue
│       └── StockAlertScheduler.java           # Low stock alerts
```

### Key Backend Components

#### AdminSecurityConfig.java
```java
@Configuration
@EnableWebSecurity
public class AdminSecurityConfig {
    // Separate JWT authentication for /api/admin/**
    // Require ROLE_ADMIN or ROLE_SUPER_ADMIN
    // Different token expiry (shorter for security)
}
```

#### OrderWorkflowService.java
```java
// Manages order state transitions
// PENDING → CONFIRMED → PROCESSING → PACKED → SHIPPED → DELIVERED
// Can transition to CANCELLED or RETURNED at certain stages
// Triggers notifications on each status change
```

#### NotificationService.java
```java
// Integrates with Twilio (SMS) and SendGrid (Email)
// Uses transactional outbox pattern
// Async worker processes queue
// Retry logic for failed notifications
```

#### PaymentService.java
```java
// Razorpay SDK integration
// Create payment orders
// Capture payments
// Process refunds
// Webhook handling for payment status updates
```

---

## 🎨 FRONTEND STRUCTURE (React + TypeScript)

### Directory Structure

```
src/
├── pages/admin/
│   ├── AdminLogin.tsx                      # Admin login page
│   ├── AdminDashboard.tsx                  # Main dashboard with KPIs
│   ├── orders/
│   │   ├── OrderList.tsx                   # All orders with filters
│   │   ├── OrderDetails.tsx                # Single order view
│   │   └── OrderActions.tsx                # Action buttons (ship, cancel, etc.)
│   ├── products/
│   │   ├── ProductList.tsx                 # Product table with search
│   │   ├── ProductForm.tsx                 # Add/Edit product
│   │   └── ProductImageUpload.tsx          # Image management
│   ├── inventory/
│   │   ├── StockManagement.tsx             # Current stock levels
│   │   ├── InventoryMovements.tsx          # Movement history
│   │   └── StockAlerts.tsx                 # Low stock warnings
│   ├── coupons/
│   │   ├── CouponList.tsx                  # All coupons
│   │   ├── CouponForm.tsx                  # Create/Edit coupon
│   │   └── CouponStats.tsx                 # Usage statistics
│   ├── users/
│   │   ├── UserList.tsx                    # Customer management
│   │   └── UserDetails.tsx                 # User profile & orders
│   ├── settings/
│   │   ├── NotificationSettings.tsx        # Email/SMS templates
│   │   └── AdminProfile.tsx                # Admin account settings
│   └── reports/
│       ├── AuditLogs.tsx                   # Admin action history
│       └── SalesReport.tsx                 # Sales analytics
├── components/admin/
│   ├── layout/
│   │   ├── AdminLayout.tsx                 # Main layout wrapper
│   │   ├── AdminSidebar.tsx                # Navigation sidebar
│   │   ├── AdminNavbar.tsx                 # Top navbar
│   │   └── AdminAuthGuard.tsx              # Route protection
│   ├── dashboard/
│   │   ├── StatCard.tsx                    # KPI cards
│   │   ├── SalesChart.tsx                  # Revenue charts
│   │   └── RecentOrders.tsx                # Latest orders widget
│   ├── orders/
│   │   ├── OrderStatusBadge.tsx
│   │   ├── OrderTimeline.tsx
│   │   └── RefundModal.tsx
│   ├── products/
│   │   ├── ProductTable.tsx
│   │   ├── ImageGallery.tsx
│   │   └── StockBadge.tsx
│   └── shared/
│       ├── DataTable.tsx                   # Reusable table component
│       ├── FilterPanel.tsx
│       ├── DateRangePicker.tsx
│       └── ConfirmDialog.tsx
├── contexts/
│   └── AdminAuthContext.tsx                # Admin auth state
├── hooks/admin/
│   ├── useAdminAuth.ts
│   ├── useAdminOrders.ts
│   ├── useAdminProducts.ts
│   └── useAdminDashboard.ts
└── api/
    └── adminApi.ts                         # Axios instance for admin APIs
```

### Admin Routes (React Router)

```typescript
// src/App.tsx
<Routes>
  {/* Existing customer routes */}
  <Route path="/" element={<HomePage />} />
  <Route path="/products/:id" element={<ProductDetails />} />
  {/* ... */}

  {/* Admin routes */}
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin" element={<AdminAuthGuard><AdminLayout /></AdminAuthGuard>}>
    <Route index element={<AdminDashboard />} />
    <Route path="orders" element={<OrderList />} />
    <Route path="orders/:id" element={<OrderDetails />} />
    <Route path="products" element={<ProductList />} />
    <Route path="products/new" element={<ProductForm />} />
    <Route path="products/:id/edit" element={<ProductForm />} />
    <Route path="inventory" element={<StockManagement />} />
    <Route path="coupons" element={<CouponList />} />
    <Route path="users" element={<UserList />} />
    <Route path="settings" element={<NotificationSettings />} />
    <Route path="audit-logs" element={<AuditLogs />} />
  </Route>
</Routes>
```

---

## 📱 NOTIFICATION & PAYMENT INTEGRATIONS

### 1. Twilio Integration (SMS)
- **Status:** Available in Replit
- **Integration ID:** `connector:ccfg_twilio_01K69QJTED9YTJFE2SJ7E4SY08`
- **Use Cases:**
  - Order status updates to customers
  - OTP for admin 2FA
  - Low stock alerts to admin
  - New order alerts to admin

### 2. SendGrid Integration (Email)
- **Status:** Available in Replit
- **Integration ID:** `connector:ccfg_sendgrid_01K69QKAPBPJ4SWD8GQHGY03D5`
- **Use Cases:**
  - Order confirmations
  - Shipping notifications
  - Payment receipts
  - Refund confirmations
  - Marketing emails

### 3. Razorpay Integration (Payment Gateway)
- **Status:** Manual setup required
- **Features:**
  - UPI payments
  - Credit/Debit cards
  - Net banking
  - Wallets (Paytm, PhonePe, etc.)
  - International cards
  - EMI options

**Required Secrets:**
```
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

---

## 🚀 PHASE-BY-PHASE IMPLEMENTATION

### PHASE 1: Foundation & Authentication (Week 1)
**Goal:** Admin infrastructure and secure login

**Tasks:**
- [ ] Add `role` column to users table
- [ ] Create admin_audit_logs table
- [ ] Create admin_roles_permissions table
- [ ] Seed SUPER_ADMIN account
- [ ] Build AdminSecurityConfig
- [ ] Create AdminAuthController (login/refresh)
- [ ] Implement RBAC middleware
- [ ] Build AdminLogin page (frontend)
- [ ] Create AdminAuthContext
- [ ] Build AdminLayout with sidebar
- [ ] Set up route guards

**Acceptance Criteria:**
✅ Admin can login with email/password
✅ JWT token issued with admin role
✅ Protected routes redirect to login
✅ Admin dashboard accessible after login

**Database Migration:**
```sql
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'CUSTOMER';
CREATE TABLE admin_audit_logs (...);
CREATE TABLE admin_roles_permissions (...);
INSERT INTO users (name, email, password, role) 
VALUES ('Super Admin', 'admin@spicehouse.com', '$2a$10$...', 'SUPER_ADMIN');
```

---

### PHASE 2: Product & Inventory Management (Week 2)
**Goal:** Complete product CRUD with images and stock tracking

**Tasks:**
- [ ] Create inventory_movements table
- [ ] Create stock_alerts table
- [ ] Build AdminProductController (CRUD)
- [ ] Build AdminInventoryController
- [ ] Implement FileStorageService
- [ ] Add image upload endpoints
- [ ] Build Product List page
- [ ] Create Product Form (add/edit)
- [ ] Build Image Upload component
- [ ] Create Inventory dashboard
- [ ] Build Stock Adjustment UI

**Acceptance Criteria:**
✅ Admin can add products with multiple images
✅ Admin can edit product details
✅ Admin can delete products
✅ Stock adjustments tracked in inventory_movements
✅ Low stock alerts visible

**Features:**
- Bulk product import (CSV)
- Image optimization and thumbnails
- Product variants (size, color)
- SEO fields (meta title, description)

---

### PHASE 3: Order Management & Workflow (Week 3)
**Goal:** Complete order processing system

**Tasks:**
- [ ] Create payments table
- [ ] Create refunds table
- [ ] Build AdminOrderController
- [ ] Implement OrderWorkflowService
- [ ] Add order action endpoints
- [ ] Build Order List with filters
- [ ] Create Order Details page
- [ ] Build Order Actions UI
- [ ] Create Refund processing UI
- [ ] Add order timeline component

**Acceptance Criteria:**
✅ Admin can view all orders
✅ Admin can change order status
✅ Status transitions validated (workflow)
✅ Admin can process refunds
✅ Order history tracked

**Order Status Workflow:**
```
PENDING → CONFIRMED → PROCESSING → PACKED → SHIPPED → DELIVERED
         ↓           ↓             ↓
      CANCELLED   CANCELLED    CANCELLED/RETURNED
```

**Allowed Transitions:**
- PENDING → CONFIRMED, CANCELLED
- CONFIRMED → PROCESSING, CANCELLED
- PROCESSING → PACKED, CANCELLED
- PACKED → SHIPPED
- SHIPPED → DELIVERED, RETURNED
- DELIVERED → RETURNED (within 7 days)

---

### PHASE 4: Razorpay Payment Integration (Week 3-4)
**Goal:** Integrate payment gateway for customer checkout

**Dependencies:**
```xml
<dependency>
    <groupId>com.razorpay</groupId>
    <artifactId>razorpay-java</artifactId>
    <version>1.4.3</version>
</dependency>
```

**Tasks:**
- [ ] Add Razorpay SDK to pom.xml
- [ ] Configure Razorpay credentials in Secrets
- [ ] Build PaymentService
- [ ] Create payment order endpoint
- [ ] Add webhook endpoint for payment status
- [ ] Build payment capture logic
- [ ] Implement refund functionality
- [ ] Create customer checkout page
- [ ] Build payment status page
- [ ] Add Razorpay button integration

**Acceptance Criteria:**
✅ Customer can initiate payment
✅ Razorpay payment page opens
✅ Payment success updates order status
✅ Failed payments logged
✅ Refunds processed successfully
✅ Webhooks validate signature

**API Endpoints:**
```
POST /api/orders/{id}/payment/create    # Create Razorpay order
POST /api/webhook/razorpay               # Payment status webhook
POST /api/admin/orders/{id}/refund       # Admin refund processing
```

---

### PHASE 5: Notification System (Week 4)
**Goal:** Email and SMS notifications for order updates

**Tasks:**
- [ ] Create notifications_outbox table
- [ ] Create notification_templates table
- [ ] Set up Twilio integration (Replit)
- [ ] Set up SendGrid integration (Replit)
- [ ] Build NotificationService
- [ ] Create notification templates
- [ ] Build async worker (scheduled task)
- [ ] Add retry logic for failed notifications
- [ ] Create notification settings UI
- [ ] Build template editor (admin)

**Acceptance Criteria:**
✅ Customer receives SMS on order placed
✅ Customer receives email with order details
✅ Admin receives notification on new order
✅ Status updates trigger notifications
✅ Failed notifications retry automatically

**Notification Templates:**

**Customer Notifications:**
- Order placed confirmation
- Order confirmed
- Order shipped (with tracking)
- Order delivered
- Payment received
- Refund processed

**Admin Notifications:**
- New order placed
- Low stock alert
- Failed payment
- Refund requested

**Template Example:**
```
// SMS Template: ORDER_PLACED
"Hi {customer_name}, your order #{order_id} for ₹{amount} is confirmed! Expected delivery: {delivery_date}. Track: {tracking_link}"

// Email Template: ORDER_SHIPPED
Subject: Your order has been shipped!
Body: HTML template with order details, tracking number, delivery estimate
```

---

### PHASE 6: Coupon Management (Week 5)
**Goal:** Discount codes and promotional offers

**Tasks:**
- [ ] Create coupons table
- [ ] Create coupon_usage table
- [ ] Build AdminCouponController
- [ ] Implement CouponValidationService
- [ ] Add coupon application to checkout
- [ ] Build Coupon List page
- [ ] Create Coupon Form
- [ ] Add coupon usage statistics
- [ ] Build coupon search/filter
- [ ] Add bulk coupon generation

**Acceptance Criteria:**
✅ Admin can create coupons
✅ Admin can set validity period
✅ Admin can set usage limits
✅ Customers can apply coupons at checkout
✅ Invalid coupons rejected with message
✅ Coupon usage tracked

**Coupon Types:**

1. **Percentage Discount**
   - 10% off, 20% off, etc.
   - Optional max discount cap

2. **Fixed Amount**
   - ₹100 off, ₹500 off
   - Min order amount requirement

3. **Free Shipping**
   - Removes shipping charges
   - Min order amount optional

4. **Buy X Get Y**
   - Buy 2 Get 1 Free
   - Category-specific

**Validation Rules:**
- Code uniqueness
- Date range validation
- Usage limit check
- Min order amount check
- User-specific coupons
- One-time use codes

---

### PHASE 7: User Management (Week 5)
**Goal:** Manage customer accounts

**Tasks:**
- [ ] Build AdminUserController
- [ ] Create User List page
- [ ] Build User Details page
- [ ] Add user search/filter
- [ ] Build account activation/deactivation
- [ ] Add password reset functionality
- [ ] Show user order history
- [ ] Display user activity logs
- [ ] Add bulk operations

**Acceptance Criteria:**
✅ Admin can view all customers
✅ Admin can search users
✅ Admin can deactivate accounts
✅ Admin can reset passwords
✅ User order history visible

**Features:**
- Advanced filters (registration date, order count, total spent)
- Export user data (CSV)
- User segmentation for marketing
- View user cart items
- View user addresses
- Customer lifetime value (CLV)

---

### PHASE 8: Analytics Dashboard (Week 6)
**Goal:** Business insights and KPIs

**Tasks:**
- [ ] Build DashboardService (aggregation queries)
- [ ] Create dashboard API endpoints
- [ ] Build Dashboard page
- [ ] Add StatCard components
- [ ] Implement SalesChart (Recharts)
- [ ] Create Top Products widget
- [ ] Build Recent Orders widget
- [ ] Add revenue trends chart
- [ ] Create coupon usage stats
- [ ] Add export reports feature

**Acceptance Criteria:**
✅ Dashboard loads within 2 seconds
✅ Real-time data refresh
✅ Charts render correctly
✅ Export to PDF/CSV works

**Dashboard Metrics:**

**Overview Cards:**
- 📊 Total Sales (Today/Week/Month/Year)
- 📦 Total Orders (with status breakdown)
- 👥 New Customers (today/this week)
- 💰 Revenue (vs previous period)
- ⭐ Average Order Value
- 🎫 Active Coupons
- ⚠️ Low Stock Products
- 📱 Pending Orders

**Charts:**
- Sales trend (line chart, last 30 days)
- Order status distribution (pie chart)
- Top 10 selling products (bar chart)
- Revenue by category (bar chart)
- Customer acquisition (line chart)
- Coupon usage trend

**Widgets:**
- Recent orders (last 10)
- Low stock alerts
- Top customers by spending
- Popular products this week

---

### PHASE 9: Security & Polish (Week 7)
**Goal:** Harden security and improve UX

**Security Tasks:**
- [ ] Add rate limiting on admin login
- [ ] Implement 2FA (optional)
- [ ] Add session management
- [ ] IP whitelisting for admin access
- [ ] Build audit log viewer
- [ ] Add webhook signature validation
- [ ] Implement CSRF protection
- [ ] Add input sanitization
- [ ] File upload security (type/size validation)

**Polish Tasks:**
- [ ] Add loading states everywhere
- [ ] Implement error boundaries
- [ ] Add toast notifications (sonner)
- [ ] Create confirmation dialogs
- [ ] Responsive design for mobile
- [ ] Keyboard shortcuts
- [ ] Dark mode support
- [ ] Accessibility improvements (ARIA)
- [ ] Performance optimization

**Acceptance Criteria:**
✅ Admin login rate limited (5 attempts/min)
✅ All admin actions logged
✅ Webhooks verify signature
✅ UI responsive on mobile
✅ No console errors
✅ Lighthouse score > 90

---

## 📦 DEPENDENCIES TO ADD

### Backend (pom.xml)

```xml
<!-- Razorpay SDK -->
<dependency>
    <groupId>com.razorpay</groupId>
    <artifactId>razorpay-java</artifactId>
    <version>1.4.3</version>
</dependency>

<!-- Twilio SDK -->
<dependency>
    <groupId>com.twilio.sdk</groupId>
    <artifactId>twilio</artifactId>
    <version>9.14.1</version>
</dependency>

<!-- SendGrid SDK -->
<dependency>
    <groupId>com.sendgrid</groupId>
    <artifactId>sendgrid-java</artifactId>
    <version>4.9.3</version>
</dependency>

<!-- File Upload -->
<dependency>
    <groupId>commons-fileupload</groupId>
    <artifactId>commons-fileupload</artifactId>
    <version>1.5</version>
</dependency>

<!-- Apache Commons IO -->
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.11.0</version>
</dependency>

<!-- MapStruct (for DTO mapping) -->
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>
```

### Frontend (package.json)

```json
{
  "dependencies": {
    "recharts": "^2.15.2",           // ✅ Already installed
    "react-dropzone": "^14.2.3",     // File upload
    "date-fns": "^2.30.0",           // Date formatting
    "@tanstack/react-table": "^8.10.0",  // Advanced tables
    "react-to-print": "^2.14.15",    // Export to PDF
    "papaparse": "^5.4.1",           // CSV export/import
    "react-hot-toast": "^2.4.1"      // Alternative to sonner
  }
}
```

---

## 🎯 TIMELINE & MILESTONES

| Phase | Duration | Key Deliverable | Status |
|-------|----------|-----------------|--------|
| Phase 1 | 1 week | Admin authentication working | ⏳ Pending |
| Phase 2 | 1 week | Product management complete | ⏳ Pending |
| Phase 3 | 1 week | Order management complete | ⏳ Pending |
| Phase 4 | 1 week | Razorpay payment integrated | ⏳ Pending |
| Phase 5 | 1 week | Notifications (Email/SMS) working | ⏳ Pending |
| Phase 6 | 1 week | Coupon system operational | ⏳ Pending |
| Phase 7 | 1 week | User management complete | ⏳ Pending |
| Phase 8 | 1 week | Analytics dashboard live | ⏳ Pending |
| Phase 9 | 1 week | Security hardened & polished | ⏳ Pending |

**Total Estimated Time:** 7-9 weeks

**Daily Progress:**
- 2-3 hours/day for steady progress
- 4-6 hours/day for faster completion
- Regular testing and code reviews

---

## 🔐 SECURITY CHECKLIST

### Authentication & Authorization
- [x] Separate JWT tokens for admin vs customer
- [x] Role-based access control (RBAC)
- [x] Bcrypt password hashing (strength 10+)
- [x] Short-lived access tokens (15 min)
- [x] Refresh token rotation
- [x] Admin session timeout (30 min idle)
- [ ] Two-factor authentication (2FA)
- [ ] IP whitelisting for admin routes

### Data Protection
- [x] HTTPS only in production
- [x] SQL injection prevention (JPA/Hibernate)
- [x] XSS protection (React escapes by default)
- [x] CORS configuration (whitelist domains)
- [ ] Rate limiting on sensitive endpoints
- [ ] Input validation and sanitization
- [ ] File upload security (type, size, malware scan)

### Audit & Monitoring
- [x] Admin action logging (who, what, when)
- [ ] Failed login attempt tracking
- [ ] Suspicious activity alerts
- [ ] Webhook signature validation
- [ ] Database encryption at rest
- [ ] Sensitive data masking in logs

### Best Practices
- Regular security audits
- Dependency vulnerability scanning
- Backup strategy (daily DB backups)
- Disaster recovery plan
- GDPR compliance for user data
- PCI DSS compliance for payments

---

## 🔑 ENVIRONMENT VARIABLES / SECRETS

Store these in Replit Secrets:

```bash
# Database
MYSQL_PASSWORD=ecommerce_pass_123

# JWT
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRATION=86400000

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Twilio (SMS)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890

# SendGrid (Email)
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@spicehouse.com
SENDGRID_FROM_NAME=Spice House

# File Storage (if using S3)
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_S3_BUCKET_NAME=spicehouse-uploads
AWS_REGION=ap-south-1
```

---

## 🧪 TESTING STRATEGY

### Unit Tests
- Controller tests (MockMvc)
- Service layer tests
- Repository tests
- Validation tests

### Integration Tests
- API endpoint tests
- Database transaction tests
- Payment integration tests
- Notification delivery tests

### E2E Tests
- Admin login flow
- Order processing workflow
- Payment completion
- Coupon application

### Manual Testing Checklist
- [ ] Admin can login
- [ ] All CRUD operations work
- [ ] Order workflow complete
- [ ] Payments captured
- [ ] Notifications sent
- [ ] Refunds processed
- [ ] Audit logs accurate
- [ ] Dashboard data correct
- [ ] Mobile responsive
- [ ] Performance acceptable

---

## 📚 API ENDPOINT DOCUMENTATION

### Admin Auth
```
POST   /api/admin/auth/login          # Admin login
POST   /api/admin/auth/refresh        # Refresh token
POST   /api/admin/auth/logout         # Logout
```

### Dashboard
```
GET    /api/admin/dashboard/stats     # Get KPIs
GET    /api/admin/dashboard/sales     # Sales data
GET    /api/admin/dashboard/charts    # Chart data
```

### Orders
```
GET    /api/admin/orders               # List orders (with filters)
GET    /api/admin/orders/{id}          # Get order details
PUT    /api/admin/orders/{id}/status   # Update order status
POST   /api/admin/orders/{id}/refund   # Process refund
GET    /api/admin/orders/{id}/timeline # Order history
```

### Products
```
GET    /api/admin/products             # List products
POST   /api/admin/products             # Create product
GET    /api/admin/products/{id}        # Get product
PUT    /api/admin/products/{id}        # Update product
DELETE /api/admin/products/{id}        # Delete product
POST   /api/admin/products/{id}/images # Upload images
```

### Inventory
```
GET    /api/admin/inventory            # Stock levels
POST   /api/admin/inventory/adjust     # Adjust stock
GET    /api/admin/inventory/movements  # Movement history
GET    /api/admin/inventory/alerts     # Low stock alerts
```

### Coupons
```
GET    /api/admin/coupons              # List coupons
POST   /api/admin/coupons              # Create coupon
PUT    /api/admin/coupons/{id}         # Update coupon
DELETE /api/admin/coupons/{id}         # Delete coupon
GET    /api/admin/coupons/{id}/usage   # Usage stats
```

### Users
```
GET    /api/admin/users                # List customers
GET    /api/admin/users/{id}           # User details
PUT    /api/admin/users/{id}/status    # Activate/deactivate
POST   /api/admin/users/{id}/reset     # Reset password
GET    /api/admin/users/{id}/orders    # User orders
```

### Notifications
```
GET    /api/admin/notifications/templates  # List templates
PUT    /api/admin/notifications/templates/{id}  # Update template
POST   /api/admin/notifications/test   # Send test notification
```

### Audit Logs
```
GET    /api/admin/audit-logs           # View audit logs (with filters)
```

---

## 🎨 UI/UX DESIGN GUIDELINES

### Admin Panel Theme
- **Primary Color:** Indigo/Blue (professional)
- **Secondary Color:** Gray (neutral)
- **Success:** Green
- **Warning:** Yellow/Orange
- **Error:** Red
- **Font:** Inter or Roboto
- **Spacing:** Consistent 4px grid

### Layout
- **Sidebar:** Fixed left, collapsible
- **Navbar:** Top bar with breadcrumbs
- **Content:** Max width 1400px, centered
- **Cards:** Rounded corners, subtle shadows
- **Tables:** Striped rows, hover effects

### Components (shadcn/ui)
- Use existing shadcn components
- Consistent button styles
- Form validation feedback
- Loading skeletons
- Toast notifications (sonner)
- Confirmation modals

---

## 🚦 NEXT STEPS

### Immediate Actions
1. ✅ Review this implementation plan
2. ⏳ Start Phase 1 (Admin Authentication)
3. ⏳ Set up Twilio integration
4. ⏳ Set up SendGrid integration
5. ⏳ Configure Razorpay test account

### Before Starting Development
- [ ] Create development branch
- [ ] Set up local database backup
- [ ] Configure all environment variables
- [ ] Review security best practices
- [ ] Plan sprint milestones

### Questions to Consider
- Should we add multi-language support?
- Do we need advanced analytics (Google Analytics)?
- Should we implement multi-currency support?
- Do we need a mobile app for admins?
- Should we add real-time notifications (WebSockets)?

---

## 📞 SUPPORT & RESOURCES

### Documentation Links
- [Razorpay API Docs](https://razorpay.com/docs/api/)
- [Twilio SMS API](https://www.twilio.com/docs/sms)
- [SendGrid Email API](https://docs.sendgrid.com/)
- [Spring Security](https://spring.io/projects/spring-security)
- [React Router](https://reactrouter.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)

### Useful Tools
- Postman (API testing)
- MySQL Workbench (database management)
- React DevTools
- Redux DevTools (if needed)

---

**Document Version:** 1.0  
**Last Updated:** October 21, 2025  
**Author:** Replit Agent  
**Status:** Planning Phase
