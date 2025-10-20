-- =========================================================================
-- SPICE HOUSE E-COMMERCE - DATABASE SCHEMA (Works in both Replit & VS Code)
-- =========================================================================

-- Drop existing tables if recreating (optional - remove these lines if updating existing db)
-- SET FOREIGN_KEY_CHECKS = 0;
-- DROP TABLE IF EXISTS order_items;
-- DROP TABLE IF EXISTS orders;
-- DROP TABLE IF EXISTS cart_items;
-- DROP TABLE IF EXISTS product_sizes;
-- DROP TABLE IF EXISTS product_features;
-- DROP TABLE IF EXISTS product_images;
-- DROP TABLE IF EXISTS products;
-- DROP TABLE IF EXISTS categories;
-- DROP TABLE IF EXISTS addresses;
-- DROP TABLE IF EXISTS users;
-- SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================================
-- Users Table
-- =========================================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'CUSTOMER',
    created_at DATETIME(6),
    updated_at DATETIME(6)
);

-- =========================================================================
-- Categories Table
-- =========================================================================
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(500),
    image VARCHAR(500),
    item_count VARCHAR(50)
);

-- =========================================================================
-- Products Table
-- =========================================================================
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    image VARCHAR(500),
    badge VARCHAR(100),
    rating DOUBLE,
    reviews INT,
    in_stock BOOLEAN DEFAULT TRUE,
    stock_count INT DEFAULT 0,
    category_id BIGINT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- =========================================================================
-- Product Features Table
-- =========================================================================
CREATE TABLE IF NOT EXISTS product_features (
    product_id BIGINT NOT NULL,
    feature VARCHAR(500),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =========================================================================
-- Product Images Table
-- =========================================================================
CREATE TABLE IF NOT EXISTS product_images (
    product_id BIGINT NOT NULL,
    image_url VARCHAR(500),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =========================================================================
-- Product Sizes Table
-- =========================================================================
CREATE TABLE IF NOT EXISTS product_sizes (
    product_id BIGINT NOT NULL,
    size VARCHAR(100),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =========================================================================
-- Cart Items Table (NO cart_id column - uses user_id directly)
-- =========================================================================
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    size VARCHAR(255),
    color VARCHAR(255),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =========================================================================
-- Addresses Table
-- =========================================================================
CREATE TABLE IF NOT EXISTS addresses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(500) NOT NULL,
    address_line2 VARCHAR(500),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================================================
-- Orders Table
-- =========================================================================
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(100) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    shipping_address_line1 VARCHAR(500) NOT NULL,
    shipping_address_line2 VARCHAR(500),
    shipping_city VARCHAR(100) NOT NULL,
    shipping_state VARCHAR(100) NOT NULL,
    shipping_pincode VARCHAR(20) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================================================================
-- Order Items Table
-- =========================================================================
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    product_image VARCHAR(500),
    quantity INT NOT NULL,
    size VARCHAR(255),
    color VARCHAR(255),
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =========================================================================
-- Fix: Remove cart_id if it exists from previous installations
-- =========================================================================
SET @dbname = DATABASE();
SET @tablename = 'cart_items';
SET @columnname = 'cart_id';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      TABLE_SCHEMA = @dbname
      AND TABLE_NAME = @tablename
      AND COLUMN_NAME = @columnname
  ) > 0,
  CONCAT('ALTER TABLE ', @tablename, ' DROP COLUMN ', @columnname, ';'),
  'SELECT 1;'
));

PREPARE alterIfExists FROM @preparedStatement;
EXECUTE alterIfExists;
DEALLOCATE PREPARE alterIfExists;
