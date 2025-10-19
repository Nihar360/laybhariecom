-- =========================================================================
-- SPICE HOUSE E-COMMERCE - REAL DATA SEEDING SCRIPT
-- =========================================================================
-- Purpose: Populate database with authentic Malvani products
-- Categories: Masalas (3 products), Mixes (4 products)
-- Total Products: 7
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
-- Step 2: Insert Real Categories
-- =========================================================================

INSERT INTO categories (id, name, image, item_count, description) VALUES
(1, 'Masalas', 'https://images.unsplash.com/photo-1618513965492-badaf6cbdfed?w=800', '3 items', 'Authentic Malvani masala blends crafted with traditional recipes and premium spices'),
(2, 'Mixes', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800', '4 items', 'Traditional Malvani flour mixes for authentic regional delicacies');

-- =========================================================================
-- Step 3: Insert Real Products - MASALAS Category
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
    NULL,
    'https://images.unsplash.com/photo-1758745464235-ccb8c1253074?w=800',
    4.6,
    89,
    NULL,
    1,
    'Premium Malvani-style garam masala with a unique blend of star anise, stone flower, and Maharashtrian spices. Adds warmth and depth to curries, rice dishes, and traditional Konkani preparations. Roasted and ground fresh to order.',
    TRUE,
    203,
    NOW(),
    NOW()
);

INSERT INTO product_features (product_id, feature) VALUES
(2, 'Traditional Konkani spice blend'),
(2, 'Contains rare stone flower (dagad phool)'),
(2, 'Freshly roasted and ground'),
(2, 'Aromatic and warming'),
(2, 'Ideal for mutton and chicken dishes'),
(2, 'Premium quality whole spices used');

INSERT INTO product_sizes (product_id, size) VALUES
(2, '50g'),
(2, '100g'),
(2, '250g');

INSERT INTO product_images (product_id, image_url) VALUES
(2, 'https://images.unsplash.com/photo-1758745464235-ccb8c1253074?w=800'),
(2, 'https://images.unsplash.com/photo-1618513965492-badaf6cbdfed?w=800');

-- Product 3: Malvani Fish Masala
INSERT INTO products (id, name, price, original_price, image, rating, reviews, badge, category_id, description, in_stock, stock_count, created_at, updated_at)
VALUES (
    3,
    'Malvani Fish Masala',
    229.00,
    279.00,
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800',
    4.9,
    176,
    'Chef\'s Choice',
    1,
    'Specially crafted fish masala perfect for Malvani seafood curries. Balanced blend of coconut, kokum, tamarind, and coastal spices. Ideal for pomfret, surmai, bangda, and prawns. Creates authentic restaurant-style Malvani fish curry.',
    TRUE,
    128,
    NOW(),
    NOW()
);

INSERT INTO product_features (product_id, feature) VALUES
(3, 'Perfect for all seafood preparations'),
(3, 'Contains traditional Konkani spices'),
(3, 'Balanced tangy and spicy flavor'),
(3, 'Restaurant-quality taste'),
(3, 'Made with fresh ground coconut'),
(3, 'No MSG or artificial additives');

INSERT INTO product_sizes (product_id, size) VALUES
(3, '100g'),
(3, '250g'),
(3, '500g');

INSERT INTO product_images (product_id, image_url) VALUES
(3, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800'),
(3, 'https://images.unsplash.com/photo-1758745464235-ccb8c1253074?w=800');

-- =========================================================================
-- Step 4: Insert Real Products - MIXES Category
-- =========================================================================

-- Product 4: Kuldachi Pithi
INSERT INTO products (id, name, price, original_price, image, rating, reviews, badge, category_id, description, in_stock, stock_count, created_at, updated_at)
VALUES (
    4,
    'Kuldachi Pithi',
    149.00,
    NULL,
    'https://images.unsplash.com/photo-1698556735172-1b5b3cd9d2ce?w=800',
    4.7,
    98,
    NULL,
    2,
    'Traditional Malvani Kuldachi Pithi (horse gram flour) packed with nutrition and authentic taste. Perfect for making wholesome kulda bhakri, thalipeeth, or nutritious porridge. Rich in protein and iron. Stone-ground from selected horse gram.',
    TRUE,
    185,
    NOW(),
    NOW()
);

INSERT INTO product_features (product_id, feature) VALUES
(4, 'Made from 100% horse gram'),
(4, 'High protein and iron content'),
(4, 'Stone-ground for best texture'),
(4, 'Perfect for traditional bhakri'),
(4, 'No additives or preservatives'),
(4, 'Authentic Malvani staple');

INSERT INTO product_sizes (product_id, size) VALUES
(4, '500g'),
(4, '1kg');

INSERT INTO product_images (product_id, image_url) VALUES
(4, 'https://images.unsplash.com/photo-1698556735172-1b5b3cd9d2ce?w=800'),
(4, 'https://images.unsplash.com/photo-1608797178894-bf7c596932da?w=800');

-- Product 5: Tandlache Pith
INSERT INTO products (id, name, price, original_price, image, rating, reviews, badge, category_id, description, in_stock, stock_count, created_at, updated_at)
VALUES (
    5,
    'Tandlache Pith',
    129.00,
    159.00,
    'https://images.unsplash.com/photo-1608797178894-bf7c596932da?w=800',
    4.5,
    67,
    NULL,
    2,
    'Premium rice flour (Tandlache Pith) made from specially selected rice varieties. Essential ingredient for traditional Malvani snacks like amboli, appo, and rice bhakri. Finely milled for smooth texture and easy preparation.',
    TRUE,
    234,
    NOW(),
    NOW()
);

INSERT INTO product_features (product_id, feature) VALUES
(5, 'Made from premium quality rice'),
(5, 'Finely milled smooth texture'),
(5, 'Perfect for amboli and appo'),
(5, 'Traditional stone grinding'),
(5, 'No chemicals or bleaching'),
(5, 'Versatile cooking flour');

INSERT INTO product_sizes (product_id, size) VALUES
(5, '500g'),
(5, '1kg'),
(5, '2kg');

INSERT INTO product_images (product_id, image_url) VALUES
(5, 'https://images.unsplash.com/photo-1608797178894-bf7c596932da?w=800'),
(5, 'https://images.unsplash.com/photo-1698556735172-1b5b3cd9d2ce?w=800');

-- Product 6: Tandlahi Bhakri Pith
INSERT INTO products (id, name, price, original_price, image, rating, reviews, badge, category_id, description, in_stock, stock_count, created_at, updated_at)
VALUES (
    6,
    'Tandlahi Bhakri Pith',
    139.00,
    NULL,
    'https://images.unsplash.com/photo-1700308234510-85bf5f51e135?w=800',
    4.6,
    112,
    'Popular',
    2,
    'Specially prepared rice bhakri flour blend for making soft and nutritious rice rotis. Pre-mixed with the right proportions for perfect consistency. Just add water and salt to make traditional Malvani rice bhakris in minutes.',
    TRUE,
    167,
    NOW(),
    NOW()
);

INSERT INTO product_features (product_id, feature) VALUES
(6, 'Ready-to-use bhakri mix'),
(6, 'Perfect soft texture guaranteed'),
(6, 'Made from aged rice'),
(6, 'Traditional Malvani recipe'),
(6, 'No artificial ingredients'),
(6, 'Easy preparation - just add water');

INSERT INTO product_sizes (product_id, size) VALUES
(6, '500g'),
(6, '1kg');

INSERT INTO product_images (product_id, image_url) VALUES
(6, 'https://images.unsplash.com/photo-1700308234510-85bf5f51e135?w=800'),
(6, 'https://images.unsplash.com/photo-1608797178894-bf7c596932da?w=800');

-- Product 7: Ghavne Pith
INSERT INTO products (id, name, price, original_price, image, rating, reviews, badge, category_id, description, in_stock, stock_count, created_at, updated_at)
VALUES (
    7,
    'Ghavne Pith',
    169.00,
    199.00,
    'https://images.unsplash.com/photo-1649952052743-5e8f37c348c5?w=800',
    4.8,
    134,
    'Traditional',
    2,
    'Authentic Ghavne flour mix for making traditional Malvani sweet pancakes. Special blend of rice, urad dal, and jaggery. Perfect for festive occasions and traditional celebrations. Creates soft, fluffy ghavne with authentic taste.',
    TRUE,
    145,
    NOW(),
    NOW()
);

INSERT INTO product_features (product_id, feature) VALUES
(7, 'Traditional festive recipe'),
(7, 'Pre-mixed with urad dal'),
(7, 'Perfect for celebrations'),
(7, 'Authentic sweet flavor'),
(7, 'Stone-ground ingredients'),
(7, 'Creates soft fluffy texture');

INSERT INTO product_sizes (product_id, size) VALUES
(7, '500g'),
(7, '1kg');

INSERT INTO product_images (product_id, image_url) VALUES
(7, 'https://images.unsplash.com/photo-1649952052743-5e8f37c348c5?w=800'),
(7, 'https://images.unsplash.com/photo-1698556735172-1b5b3cd9d2ce?w=800');

-- =========================================================================
-- Step 5: Reset Auto Increment Values
-- =========================================================================

ALTER TABLE categories AUTO_INCREMENT = 3;
ALTER TABLE products AUTO_INCREMENT = 8;

-- =========================================================================
-- Step 6: Verify Data Insertion
-- =========================================================================

-- Count products by category
SELECT 
    c.name AS category_name,
    COUNT(p.id) AS product_count
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name;

-- List all products
SELECT 
    p.id,
    p.name,
    p.price,
    c.name AS category,
    p.stock_count,
    p.rating
FROM products p
JOIN categories c ON p.category_id = c.id
ORDER BY c.id, p.id;

-- =========================================================================
-- EXECUTION COMPLETE
-- =========================================================================
-- Summary:
-- ✓ 2 Categories inserted (Masalas, Mixes)
-- ✓ 7 Products inserted (3 Masalas + 4 Mixes)
-- ✓ Product features, sizes, and images added
-- ✓ All demo data cleared
-- ✓ Database ready for production use
-- =========================================================================
