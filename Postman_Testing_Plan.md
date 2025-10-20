# Postman Testing Plan - Spice House E-commerce Application

## Table of Contents
1. [Setup](#setup)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Product Endpoints](#product-endpoints)
4. [Category Endpoints](#category-endpoints)
5. [Cart Endpoints](#cart-endpoints)
6. [Order Endpoints](#order-endpoints)
7. [Testing Workflow](#testing-workflow)
8. [Environment Variables](#environment-variables)

---

## Setup

### Base URL
```
http://localhost:8080
```
Or use your Replit domain:
```
https://[your-repl-name].[your-username].replit.dev
```

### Headers
For **Public Endpoints** (Auth, Products, Categories):
```
Content-Type: application/json
```

For **Protected Endpoints** (Cart, Orders):
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "mobile": "9876543210"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "id": 1,
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "role": "USER"
  }
}
```

**Testing Steps:**
1. Send POST request with valid user data
2. Verify response status is 200
3. Verify response contains `token`
4. **Copy the token** - you'll need it for protected endpoints
5. Try registering same email again - should get 400 error

---

### 2. Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "id": 1,
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "role": "USER"
  }
}
```

**Testing Steps:**
1. Send POST request with valid credentials
2. Verify response status is 200
3. Verify response contains JWT token
4. **Save the token** for subsequent requests
5. Try with wrong password - should get 401 error

---

## Product Endpoints

### 3. Get All Products
**GET** `/api/products`

**Headers:**
```
Content-Type: application/json
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Kashmiri Red Chili Powder",
      "description": "Premium quality chili powder from Kashmir...",
      "price": 8.99,
      "images": ["/api/placeholder/400/400"],
      "category": "Spices",
      "rating": 4.5,
      "reviews": 128,
      "inStock": true,
      "stockCount": 50,
      "sizes": ["50g", "100g", "250g"],
      "features": ["100% Pure", "Premium Quality", "Rich Flavor"]
    }
  ]
}
```

**Testing Steps:**
1. Send GET request (no auth required)
2. Verify response status is 200
3. Verify data is array of products
4. Verify each product has required fields: id, name, price, category, images

---

### 4. Get Product by ID
**GET** `/api/products/{id}`

**Example:** `/api/products/1`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Product fetched successfully",
  "data": {
    "id": 1,
    "name": "Kashmiri Red Chili Powder",
    "description": "Premium quality chili powder...",
    "price": 8.99,
    "images": ["/api/placeholder/400/400"],
    "category": "Spices",
    "rating": 4.5,
    "reviews": 128,
    "inStock": true,
    "stockCount": 50,
    "sizes": ["50g", "100g", "250g"],
    "features": ["100% Pure", "Premium Quality"]
  }
}
```

**Testing Steps:**
1. Send GET request with valid product ID
2. Verify response contains single product
3. Try with invalid ID (e.g., 9999) - should get 404 error

---

### 5. Get Products by Category
**GET** `/api/products/category/{categoryName}`

**Example:** `/api/products/category/Spices`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Kashmiri Red Chili Powder",
      "category": "Spices",
      "price": 8.99,
      ...
    },
    {
      "id": 2,
      "name": "Turmeric Powder",
      "category": "Spices",
      "price": 6.99,
      ...
    }
  ]
}
```

**Testing Steps:**
1. Send GET request with valid category name
2. Verify all returned products belong to requested category
3. Try with non-existent category - should return empty array

---

### 6. Search Products
**GET** `/api/products/search?query={searchTerm}`

**Example:** `/api/products/search?query=turmeric`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [
    {
      "id": 2,
      "name": "Turmeric Powder",
      "description": "Pure turmeric powder...",
      "price": 6.99,
      ...
    }
  ]
}
```

**Testing Steps:**
1. Search for "turmeric" - should return matching products
2. Search for "masala" - should return matching products
3. Search for empty string - should return all products
4. Search for non-existent product - should return empty array

---

## Category Endpoints

### 7. Get All Categories
**GET** `/api/categories`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "Spices",
      "description": "Premium quality spices",
      "image": "/api/placeholder/400/300"
    },
    {
      "id": 2,
      "name": "Masalas",
      "description": "Traditional Indian masala blends",
      "image": "/api/placeholder/400/300"
    }
  ]
}
```

**Testing Steps:**
1. Send GET request (no auth required)
2. Verify response contains array of categories
3. Verify each category has id, name, description, image

---

## Cart Endpoints

⚠️ **IMPORTANT:** All cart endpoints require authentication. Include JWT token in Authorization header.

### 8. Get User Cart
**GET** `/api/cart`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart fetched successfully",
  "data": [
    {
      "id": 1,
      "productId": 1,
      "productName": "Kashmiri Red Chili Powder",
      "price": 8.99,
      "image": "/api/placeholder/400/400",
      "quantity": 2,
      "size": "100g",
      "color": null,
      "subtotal": 17.98
    }
  ]
}
```

**Testing Steps:**
1. Get JWT token from login/register
2. Add token to Authorization header
3. Send GET request
4. Verify cart items are returned
5. Try without token - should get 401 Unauthorized

---

### 9. Add Item to Cart
**POST** `/api/cart`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Request Body:**
```json
{
  "productId": 1,
  "quantity": 2,
  "size": "100g",
  "color": null
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "id": 1,
    "productId": 1,
    "productName": "Kashmiri Red Chili Powder",
    "price": 8.99,
    "image": "/api/placeholder/400/400",
    "quantity": 2,
    "size": "100g",
    "subtotal": 17.98
  }
}
```

**Testing Steps:**
1. Add valid product to cart
2. Verify response contains cart item
3. Add same product again - should increase quantity
4. Try with invalid product ID - should get 404 error
5. Try without auth token - should get 401 error

---

### 10. Update Cart Item Quantity
**PUT** `/api/cart/{cartItemId}`

**Example:** `/api/cart/1?quantity=5`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Query Parameters:**
```
quantity=5
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Cart updated successfully",
  "data": {
    "id": 1,
    "productId": 1,
    "productName": "Kashmiri Red Chili Powder",
    "price": 8.99,
    "quantity": 5,
    "subtotal": 44.95
  }
}
```

**Testing Steps:**
1. Update cart item to quantity 5
2. Verify subtotal is recalculated
3. Try with quantity 0 - should remove item
4. Try with invalid cart item ID - should get 404 error

---

### 11. Remove Item from Cart
**DELETE** `/api/cart/{cartItemId}`

**Example:** `/api/cart/1`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": null
}
```

**Testing Steps:**
1. Delete a cart item
2. Verify response is successful
3. Get cart again - item should be removed
4. Try deleting non-existent item - should get 404 error

---

## Order Endpoints

⚠️ **IMPORTANT:** All order endpoints require authentication.

### 12. Create Order
**POST** `/api/orders`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Request Body:**
```json
{
  "shippingAddress": {
    "fullName": "John Doe",
    "mobile": "9876543210",
    "email": "john.doe@example.com",
    "addressLine1": "123 Main Street",
    "addressLine2": "Apartment 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  },
  "paymentMethod": "COD",
  "notes": "Please deliver before 6 PM"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "orderNumber": "ORD-12345678",
    "subtotal": 44.95,
    "discount": 0,
    "shipping": 3.00,
    "total": 47.95,
    "paymentMethod": "COD",
    "status": "PENDING",
    "orderDate": "2025-10-20T10:30:00",
    "deliveredDate": null,
    "items": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Kashmiri Red Chili Powder",
        "productImage": "/api/placeholder/400/400",
        "quantity": 5,
        "size": "100g",
        "price": 8.99,
        "subtotal": 44.95
      }
    ],
    "shippingAddress": {
      "id": 1,
      "fullName": "John Doe",
      "mobile": "9876543210",
      "email": "john.doe@example.com",
      "addressLine1": "123 Main Street",
      "addressLine2": "Apartment 4B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001",
      "country": "India"
    }
  }
}
```

**Testing Steps:**
1. Ensure cart has items
2. Send POST request with valid shipping address
3. Verify order is created with unique order number
4. Verify cart is cleared after order creation
5. **Save the orderNumber** for next tests
6. Try creating order with empty cart - should get error

---

### 13. Get All User Orders
**GET** `/api/orders`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": [
    {
      "id": 1,
      "orderNumber": "ORD-12345678",
      "subtotal": 44.95,
      "discount": 0,
      "shipping": 3.00,
      "total": 47.95,
      "paymentMethod": "COD",
      "status": "PENDING",
      "orderDate": "2025-10-20T10:30:00",
      "items": [...],
      "shippingAddress": {...}
    }
  ]
}
```

**Testing Steps:**
1. Get JWT token from login
2. Send GET request
3. Verify all user's orders are returned
4. Verify each order has orderNumber, items, shippingAddress
5. Try without auth - should get 401 error

---

### 14. Get Order by ID
**GET** `/api/orders/{orderId}`

**Example:** `/api/orders/1`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Order fetched successfully",
  "data": {
    "id": 1,
    "orderNumber": "ORD-12345678",
    "subtotal": 44.95,
    "total": 47.95,
    "items": [...],
    "shippingAddress": {...}
  }
}
```

**Testing Steps:**
1. Get order by valid ID
2. Verify full order details are returned
3. Try with another user's order ID - should get 403 Forbidden
4. Try with invalid ID - should get 404 error

---

### 15. Get Order by Order Number
**GET** `/api/orders/number/{orderNumber}`

**Example:** `/api/orders/number/ORD-12345678`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Order fetched successfully",
  "data": {
    "id": 1,
    "orderNumber": "ORD-12345678",
    "subtotal": 44.95,
    "discount": 0,
    "shipping": 3.00,
    "total": 47.95,
    "paymentMethod": "COD",
    "status": "PENDING",
    "orderDate": "2025-10-20T10:30:00",
    "items": [
      {
        "id": 1,
        "productId": 1,
        "productName": "Kashmiri Red Chili Powder",
        "productImage": "/api/placeholder/400/400",
        "quantity": 5,
        "price": 8.99,
        "subtotal": 44.95
      }
    ],
    "shippingAddress": {
      "fullName": "John Doe",
      "mobile": "9876543210",
      "email": "john.doe@example.com",
      "addressLine1": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001",
      "country": "India"
    }
  }
}
```

**Testing Steps:**
1. Use orderNumber from create order response
2. Send GET request
3. Verify correct order is returned
4. Try with non-existent order number - should get 404 error

---

## Testing Workflow

### Complete End-to-End Test Scenario

#### **Step 1: User Registration**
```
POST /api/auth/register
Body: {fullName, email, password, mobile}
✓ Save JWT token
```

#### **Step 2: Browse Products**
```
GET /api/products
✓ Verify products are returned
GET /api/categories
✓ Verify categories exist
```

#### **Step 3: Search Products**
```
GET /api/products/search?query=turmeric
✓ Verify search results
```

#### **Step 4: Add to Cart**
```
POST /api/cart
Header: Authorization: Bearer {token}
Body: {productId: 1, quantity: 2, size: "100g"}
✓ Verify item added
```

#### **Step 5: View Cart**
```
GET /api/cart
Header: Authorization: Bearer {token}
✓ Verify cart contains items
```

#### **Step 6: Update Cart**
```
PUT /api/cart/1?quantity=5
Header: Authorization: Bearer {token}
✓ Verify quantity updated
✓ Verify subtotal recalculated
```

#### **Step 7: Create Order**
```
POST /api/orders
Header: Authorization: Bearer {token}
Body: {shippingAddress, paymentMethod, notes}
✓ Verify order created
✓ Save orderNumber
✓ Verify cart is cleared
```

#### **Step 8: View Order History**
```
GET /api/orders
Header: Authorization: Bearer {token}
✓ Verify order appears in history
```

#### **Step 9: View Specific Order**
```
GET /api/orders/number/ORD-12345678
Header: Authorization: Bearer {token}
✓ Verify complete order details
✓ Verify items, address, pricing
```

---

## Environment Variables

### Postman Environment Setup

Create a Postman environment with these variables:

```
base_url: http://localhost:8080
jwt_token: (leave empty - will be set from login response)
order_number: (leave empty - will be set from create order response)
```

### Auto-Save Token Script

Add this script to **Login** and **Register** requests (Tests tab):
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    if (jsonData.data && jsonData.data.token) {
        pm.environment.set("jwt_token", jsonData.data.token);
        console.log("JWT token saved!");
    }
}
```

### Auto-Save Order Number Script

Add this script to **Create Order** request (Tests tab):
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    if (jsonData.data && jsonData.data.orderNumber) {
        pm.environment.set("order_number", jsonData.data.orderNumber);
        console.log("Order number saved: " + jsonData.data.orderNumber);
    }
}
```

### Using Environment Variables

In requests, use variables like this:
```
URL: {{base_url}}/api/products
Authorization: Bearer {{jwt_token}}
```

---

## Common Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Email already registered",
  "data": null
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid credentials",
  "data": null
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied",
  "data": null
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Product not found",
  "data": null
}
```

---

## Testing Checklist

- [ ] Register new user successfully
- [ ] Login with registered user
- [ ] Get all products
- [ ] Get product by ID
- [ ] Get products by category
- [ ] Search products
- [ ] Get all categories
- [ ] Add item to cart (with auth)
- [ ] View cart
- [ ] Update cart item quantity
- [ ] Remove item from cart
- [ ] Create order (with shipping address)
- [ ] View all orders
- [ ] View order by order number
- [ ] Test error cases (invalid IDs, missing auth, etc.)

---

## Notes

1. **Authentication Required**: Cart and Order endpoints require JWT token
2. **Token Expiration**: Tokens expire after 24 hours
3. **Order Numbers**: Unique format `ORD-XXXXXXXX`
4. **Cart Clearing**: Cart is automatically cleared after successful order creation
5. **Stock Management**: Stock count decreases when order is placed
6. **Price Calculation**: Free shipping over $25, otherwise $3 shipping fee

---

## Support

For issues or questions, refer to:
- Backend Code: `backend/demo/src/main/java/com/laybhariecom/demo/controller/`
- API Types: `src/types/api.ts`
- Documentation: `Functionality_Checklist.md` and `Transition_Workflow.md`
