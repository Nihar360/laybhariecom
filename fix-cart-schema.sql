-- =========================================================================
-- FIX: Remove cart_id column from cart_items table
-- =========================================================================
-- This script fixes the cart_items table to match the CartItem entity
-- The application uses user_id directly (no separate Cart entity)
-- =========================================================================

USE ecommerce_db;

-- Step 1: Check if cart_id column exists
SELECT COLUMN_NAME, IS_NULLABLE, COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ecommerce_db' 
  AND TABLE_NAME = 'cart_items' 
  AND COLUMN_NAME = 'cart_id';

-- Step 2: Drop cart_id column if it exists
ALTER TABLE cart_items DROP COLUMN IF EXISTS cart_id;

-- Step 3: Verify the fix
DESCRIBE cart_items;

-- =========================================================================
-- Expected columns after fix:
-- - id (PRIMARY KEY, AUTO_INCREMENT)
-- - user_id (NOT NULL, FOREIGN KEY to users)
-- - product_id (NOT NULL, FOREIGN KEY to products)
-- - quantity (NOT NULL)
-- - size (VARCHAR)
-- - color (VARCHAR)
-- - created_at (TIMESTAMP)
-- - updated_at (TIMESTAMP)
-- =========================================================================
