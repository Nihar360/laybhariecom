-- =========================================================================
-- SPICE HOUSE E-COMMERCE - REAL DATA SEEDING SCRIPT (FIXED)
-- =========================================================================
-- Purpose: Populate database with authentic Malvani products
-- Categories: Masalas (3 products), Mixes (4 products)
-- Total Products: 7
-- FIX: Removed cart_id column from cart_items table
-- =========================================================================

-- Step 1: Clear existing demo data (if any)
-- =========================================================================
SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM product_sizes;
DELETE FROM product_features;
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM addresses;
DELETE FROM users;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================================
-- Step 2: Ensure cart_items table has correct schema (NO cart_id column)
-- =========================================================================

-- Drop cart_id if it exists
ALTER TABLE cart_items DROP COLUMN IF EXISTS cart_id;

-- =========================================================================
-- Step 3: Insert Real Categories
-- =========================================================================

INSERT INTO categories (id, name, image, item_count, description) VALUES
(1, 'Masalas', 'https://images.unsplash.com/photo-1618513965492-badaf6cbdfed?w=800', '3 items', 'Authentic Malvani masala blends crafted with traditional recipes and premium spices'),
(2, 'Mixes', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800', '4 items', 'Traditional Malvani flour mixes for authentic regional delicacies');

-- =========================================================================
-- Step 4: Insert Real Products - MASALAS Category
-- =========================================================================

-- Product 1: Malvani Masala
INSERT INTO products (id, name, price, original_price, image, rating, reviews, badge, category_id, description, in_stock, stock_count, created_at, updated_at)
VALUES (
    1,
    'Malvani Masala',
    249.00,
    299.00,
    'https://images.unsplash.com/photo-1618513965492-badaf6cbdfed?w=800',
    4.8,
    142,
    'Best Seller',
    1,
    'Signature Malvani masala blend featuring a perfect balance of coconut, red chilies, coriander, and regional spices. Essential for authentic Malvani curries, fish preparations, and coastal delicacies. Stone-ground using traditional methods to preserve authentic flavors.',
    TRUE,
    156,
    NOW(),
    NOW()
);

INSERT INTO product_features (product_id, feature) VALUES
(1, '100% authentic Malvani recipe'),
(1, 'Stone-ground traditional method'),
(1, 'Perfect for seafood and chicken curries'),
(1, 'No artificial colors or preservatives'),
(1, 'Rich coconut and spice aroma'),
(1, 'Freshly prepared in small batches');

INSERT INTO product_sizes (product_id, size) VALUES
(1, '100g'),
(1, '250g'),
(1, '500g');

INSERT INTO product_images (product_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1618513965492-badaf6cbdfed?w=800'),
(1, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800');

-- Product 2: Malvani Garam Masala
INSERT INTO products (id, name, price, original_price, image, rating, reviews, badge, category_id, description, in_stock, stock_count, created_at, updated_at)
VALUES (
    2,
    'Malvani Garam Masala',
    199.00,
    249.00,
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
    4.7,
    98,
    NULL,
    1,
    'Aromatic garam masala blend with roasted spices including cardamom, cinnamon, cloves, and black pepper. Essential for finishing curries and gravies. Adds depth and warmth to any Malvani dish.',
    TRUE,
    124,
    NOW(),
    NOW()
);

INSERT INTO product_features (product_id, feature) VALUES
(2, 'Freshly roasted whole spices'),
(2, 'Perfect finishing touch for curries'),
(2, 'Aromatic and flavorful'),
(2, 'Traditional coastal blend'),
(2, 'No fillers or additives'),
(2, '100% natural ingredients');

INSERT INTO product_sizes (product_id, size) VALUES
(2, '50g'),
(2, '100g'),
(2, '250g');

INSERT INTO product_images (product_id, image_url) VALUES
(2, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800'),
(2, 'https://images.unsplash.com/photo-1599909533271-43c8b18f7fa8?w=800');

-- Product 3: Kanda Lasun Masala
INSERT INTO products (id, name, price, original_price, image, rating, reviews, badge, category_id, description, in_stock, stock_count, created_at, updated_at)
VALUES (
    3,
    'Kanda Lasun Masala',
    229.00,
    279.00,
    'https://images.unsplash.com/photo-1599909533271-43c8b18f7fa8?w=800',
    4.9,
    167,
    'Popular',
    1,
    'Classic Malvani onion-garlic masala paste. Made with sun-dried onions, fresh garlic, and aromatic spices. Perfect base for curries, stir-fries, and marinades. Concentrated flavor in every spoonful.',
    TRUE,
    89,
    NOW(),
    NOW()
);

INSERT INTO product_features (product_id, feature) VALUES
(3, 'Sun-dried onions and fresh garlic'),
(3, 'Concentrated flavor paste'),
(3, 'Versatile cooking base'),
(3, 'Time-saving convenience'),
(3, 'Authentic Malvani taste'),
(3, 'Long shelf life');

INSERT INTO product_sizes (product_id, size) VALUES
(3, '200g'),
(3, '500g');

INSERT INTO product_images (product_id, image_url) VALUES
(3, 'https://images.unsplash.com/photo-1599909533271-43c8b18f7fa8?w=800'),
(3, 'https://images.unsplash.com/photo-1618513965492-badaf6cbdfed?w=800');

-- =========================================================================
-- Step 5: Insert Real Products - MIXES Category
-- =========================================================================

-- Product 4: Solkadhi Mix
INSERT INTO products (id, name, price, original_price, image, rating, reviews, badge, category_id, description, in_stock, stock_count, created_at, updated_at)
VALUES (
    4,
    'Solkadhi Mix',
    179.00,
    229.00,
    'https://images.unsplash.com/photo-1606491048746-6d9c6a18e5ed?w=800',
    4.6,
    76,
    NULL,
    2,
    'Ready-to-use Solkadhi mix made with kokum, coconut milk powder, and authentic Malvani spices. Just add water for refreshing, digestive drink. Perfect accompaniment to fish curry and rice.',
    TRUE,
    145,
    NOW(),
    NOW()
);

INSERT INTO product_features (product_id, feature) VALUES
(4, 'Instant Solkadhi preparation'),
(4, 'Natural kokum extract'),
(4, 'Digestive and cooling properties'),
(4, 'Authentic coastal flavor'),
(4, 'Just add water'),
(4, 'No preservatives');

INSERT INTO product_sizes (product_id, size) VALUES
(4, '200g'),
(4, '500g');

INSERT INTO product_images (product_id, image_url) VALUES
(4, 'https://images.unsplash.com/photo-1606491048746-6d9c6a18e5ed?w=800');

-- Product 5: Amboli Mix
INSERT INTO products (id, name, price, original_price, image, rating, reviews, badge, category_id, description, in_stock, stock_count, created_at, updated_at)
VALUES (
    5,
    'Amboli Mix',
    149.00,
    199.00,
    'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800',
    4.5,
    54,
    NULL,
    2,
    'Traditional Malvani pancake mix made with fermented rice flour and lentils. Makes soft, fluffy amboli perfect for breakfast. Add water, ferment overnight, and cook on griddle.',
    TRUE,
    98,
    NOW(),
    NOW()
);

INSERT INTO product_features (product_id, feature) VALUES
(5, 'Pre-mixed rice and lentil flour'),
(5, 'Authentic fermented taste'),
(5, 'Soft and fluffy texture'),
(5, 'Easy preparation'),
(5, 'Traditional breakfast favorite'),
(5, 'Healthy and nutritious');

INSERT INTO product_sizes (product_id, size) VALUES
(5, '500g'),
(5, '1kg');

INSERT INTO product_images (product_id, image_url) VALUES
(5, 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800');

-- Product 6: Bhakri Mix
INSERT INTO products (id, name, price, original_price, image, rating, reviews, badge, category_id, description, in_stock, stock_count, created_at, updated_at)
VALUES (
    6,
    'Bhakri Mix',
    129.00,
    169.00,
    'https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=800',
    4.7,
    112,
    NULL,
    2,
    'Traditional jowar (sorghum) flour mix for making authentic Malvani bhakri. High in fiber and nutrients. Perfect accompaniment to spicy curries and vegetables.',
    TRUE,
    167,
    NOW(),
    NOW()
);

INSERT INTO product_features (product_id, feature) VALUES
(6, '100% jowar (sorghum) flour'),
(6, 'High in fiber and protein'),
(6, 'Gluten-free option'),
(6, 'Traditional stone-ground'),
(6, 'Easy to roll and cook'),
(6, 'Stays soft for hours');

INSERT INTO product_sizes (product_id, size) VALUES
(6, '500g'),
(6, '1kg'),
(6, '2kg');

INSERT INTO product_images (product_id, image_url) VALUES
(6, 'https://images.unsplash.com/photo-1628773822503-930a7eaecf80?w=800');

-- Product 7: Modak Mix
INSERT INTO products (id, name, price, original_price, image, rating, reviews, badge, category_id, description, in_stock, stock_count, created_at, updated_at)
VALUES (
    7,
    'Modak Mix',
    189.00,
    239.00,
    'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800',
    4.8,
    89,
    'Festive Special',
    2,
    'Premium rice flour mix for making traditional Malvani modak. Perfect for festivals and special occasions. Makes sweet and savory modaks with authentic taste and texture.',
    TRUE,
    72,
    NOW(),
    NOW()
);

INSERT INTO product_features (product_id, feature) VALUES
(7, 'Premium rice flour blend'),
(7, 'Perfect for sweet and savory modaks'),
(7, 'Smooth, pliable dough'),
(7, 'Festive specialty'),
(7, 'Easy shaping and steaming'),
(7, 'Traditional Malvani recipe');

INSERT INTO product_sizes (product_id, size) VALUES
(7, '250g'),
(7, '500g');

INSERT INTO product_images (product_id, image_url) VALUES
(7, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800');

-- =========================================================================
-- COMPLETE
-- =========================================================================

SELECT 'Database seeded successfully!' AS status;
SELECT COUNT(*) AS total_products FROM products;
SELECT COUNT(*) AS total_categories FROM categories;
