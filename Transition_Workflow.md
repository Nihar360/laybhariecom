# Spice House E-Commerce - Complete Transition Workflow

This document explains how data flows through the entire application stack from the user interface through the backend to the database and back.

---

## 🏗️ System Architecture Overview

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│   React Frontend │      │  Spring Boot API │      │    MySQL    │
│   (Port 5000)    │◄────►│   (Port 8080)    │◄────►│ (Port 3306) │
│                  │      │                  │      │             │
│  - Components    │      │  - Controllers   │      │  - users    │
│  - Contexts      │      │  - Services      │      │  - products │
│  - API calls     │      │  - Repositories  │      │  - orders   │
│  - localStorage  │      │  - JPA/Hibernate │      │  - cart...  │
└─────────────────┘      └──────────────────┘      └─────────────┘
```

---

## 1️⃣ User Registration Workflow

### Frontend Flow (React)

**Component:** `src/components/auth/RegisterForm.tsx`

1. **User Input**
   ```
   User fills form:
   - Full Name: "John Doe"
   - Email: "john@example.com"
   - Mobile: "9876543210"
   - Password: "password123"
   - Confirm Password: "password123"
   ```

2. **Client-Side Validation**
   ```typescript
   - Password match check
   - Password length ≥ 6 characters
   - All required fields filled
   ```

3. **API Call** (`src/api/auth.ts`)
   ```typescript
   POST http://localhost:8080/api/auth/register
   Headers: { 'Content-Type': 'application/json' }
   Body: {
     fullName: "John Doe",
     email: "john@example.com",
     mobile: "9876543210",
     password: "password123"
   }
   ```

### Backend Flow (Spring Boot)

**Controller:** `AuthController.java`

4. **Request Reception**
   ```java
   @PostMapping("/api/auth/register")
   public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request)
   ```

5. **Service Layer** (`UserService.java`)
   ```java
   public User registerUser(RegisterRequest request) {
     // Check if email already exists
     if (userRepository.findByEmail(request.getEmail()).isPresent()) {
       throw new BadRequestException("Email already exists");
     }
     
     // Create new user
     User user = new User();
     user.setFullName(request.getFullName());
     user.setEmail(request.getEmail());
     user.setMobile(request.getMobile());
     user.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt hashing
     user.setRole(Role.USER);
     user.setActive(true);
     
     // Save to database
     return userRepository.save(user);
   }
   ```

### Database Operation (MySQL)

6. **Hibernate Query Execution**
   ```sql
   INSERT INTO users (full_name, email, mobile, password, role, active, created_at, updated_at)
   VALUES ('John Doe', 'john@example.com', '9876543210', '$2a$10$...', 'USER', true, NOW(), NOW());
   ```

7. **JWT Token Generation**
   ```java
   String token = jwtService.generateToken(userDetails);
   // Token contains: user email, role, expiry (24 hours)
   ```

### Response Flow

8. **Backend Response**
   ```json
   {
     "success": true,
     "message": "User registered successfully",
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "id": 1,
       "fullName": "John Doe",
       "email": "john@example.com",
       "role": "USER"
     }
   }
   ```

9. **Frontend Storage** (`src/api/auth.ts`)
   ```typescript
   localStorage.setItem('auth_token', response.data.data.token);
   localStorage.setItem('user', JSON.stringify({
     id: response.data.data.id,
     fullName: response.data.data.fullName,
     email: response.data.data.email,
     role: response.data.data.role
   }));
   ```

10. **Context Update** (`src/contexts/AuthContext.tsx`)
    ```typescript
    setUser({
      id: response.data.id,
      fullName: response.data.fullName,
      email: response.data.email,
      role: response.data.role
    });
    // User is now logged in!
    ```

11. **Navigation**
    ```typescript
    navigate('/'); // Redirect to homepage
    ```

**Result:** ✅ User is registered, logged in, and session persists in localStorage

---

## 2️⃣ User Login Workflow

### Frontend Flow

**Component:** `src/components/auth/LoginForm.tsx`

1. **User Input**
   ```
   Email: "john@example.com"
   Password: "password123"
   ```

2. **API Call**
   ```typescript
   POST http://localhost:8080/api/auth/login
   Body: { email: "john@example.com", password: "password123" }
   ```

### Backend Flow

3. **Authentication Manager** (`SecurityConfig.java`)
   ```java
   Authentication authentication = authenticationManager.authenticate(
     new UsernamePasswordAuthenticationToken(email, password)
   );
   ```

4. **User Lookup** (`UserService.java`)
   ```java
   @Override
   public UserDetails loadUserByUsername(String email) {
     User user = userRepository.findByEmail(email)
       .orElseThrow(() -> new UsernameNotFoundException("User not found"));
     
     return org.springframework.security.core.userdetails.User
       .withUsername(user.getEmail())
       .password(user.getPassword())
       .roles(user.getRole().name())
       .build();
   }
   ```

### Database Operation

5. **Hibernate Query**
   ```sql
   SELECT * FROM users WHERE email = 'john@example.com';
   ```

6. **Password Verification**
   ```java
   passwordEncoder.matches(rawPassword, encodedPassword); // BCrypt comparison
   ```

7. **Token Generation & Response**
   - Same as registration flow (steps 7-11)

**Result:** ✅ User is logged in with valid JWT token

---

## 3️⃣ Session Persistence & Auto-Login

### On Page Load

**Context:** `src/contexts/AuthContext.tsx`

1. **Check localStorage**
   ```typescript
   useEffect(() => {
     const storedUser = authService.getUser();
     const storedToken = authService.getToken();
     
     if (storedUser && storedToken) {
       setUser(storedUser); // Restore user session
     }
     setIsLoading(false);
   }, []);
   ```

2. **Token Injection** (`src/api/config.ts`)
   ```typescript
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('auth_token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

3. **Auto-Logout on 401**
   ```typescript
   api.interceptors.response.use(
     (response) => response,
     (error) => {
       if (error.response?.status === 401) {
         localStorage.removeItem('auth_token');
         localStorage.removeItem('user');
         window.location.href = '/login';
       }
       return Promise.reject(error);
     }
   );
   ```

**Result:** ✅ User stays logged in across page refreshes and browser sessions

---

## 4️⃣ Product Search Workflow ⭐ NEW

### Frontend Flow

**Component:** `src/components/Header.tsx`

1. **User Types in Search Box**
   ```
   User types: "Turm"
   ```

2. **Debounced Search** (300ms delay)
   ```typescript
   useEffect(() => {
     const searchProducts = async () => {
       if (searchQuery.length < 2) return; // Minimum 2 characters
       
       const response = await productsService.searchProducts(searchQuery);
       setSearchResults(response.data.slice(0, 5)); // Max 5 suggestions
       setShowSuggestions(true);
     };
     
     const debounceTimer = setTimeout(searchProducts, 300);
     return () => clearTimeout(debounceTimer);
   }, [searchQuery]);
   ```

3. **API Call**
   ```typescript
   GET http://localhost:8080/api/products/search?query=Turm
   Headers: { Authorization: 'Bearer ...' } // Optional
   ```

### Backend Flow

**Controller:** `ProductController.java`

4. **Search Endpoint**
   ```java
   @GetMapping("/search")
   public ResponseEntity<ApiResponse> searchProducts(@RequestParam String query) {
     List<ProductResponse> products = productService.searchProducts(query);
     return ResponseEntity.ok(new ApiResponse(true, "Search results", products));
   }
   ```

**Service:** `ProductService.java`

5. **Search Logic**
   ```java
   public List<ProductResponse> searchProducts(String query) {
     List<Product> products = productRepository.findByNameContainingIgnoreCase(query);
     return products.stream()
       .map(this::convertToResponse)
       .collect(Collectors.toList());
   }
   ```

### Database Operation

6. **Hibernate Query**
   ```sql
   SELECT * FROM products 
   WHERE LOWER(name) LIKE LOWER('%Turm%');
   ```

7. **Related Data Fetching**
   ```sql
   SELECT * FROM product_images WHERE product_id IN (1, 2, 3);
   SELECT * FROM product_features WHERE product_id IN (1, 2, 3);
   SELECT * FROM product_sizes WHERE product_id IN (1, 2, 3);
   SELECT * FROM categories WHERE id IN (1, 2);
   ```

### Response & UI

8. **Backend Response**
   ```json
   {
     "success": true,
     "message": "Search results fetched successfully",
     "data": [
       {
         "id": 1,
         "name": "Turmeric Powder",
         "price": 8.99,
         "images": ["https://..."],
         "rating": 4.5,
         ...
       },
       ...
     ]
   }
   ```

9. **Suggestions Dropdown**
   ```tsx
   <div className="suggestions-dropdown">
     {searchResults.map(product => (
       <div onClick={() => navigate(`/product/${product.id}`)}>
         <img src={product.images[0]} />
         <p>{product.name}</p>
         <p>${product.price}</p>
       </div>
     ))}
     <button onClick={() => navigate(`/search?q=${query}`)}>
       View all results for "{query}"
     </button>
   </div>
   ```

**Result:** ✅ Real-time search with suggestions

---

## 5️⃣ Add to Cart Workflow

### Frontend Flow

**Component:** `src/components/ProductCard.tsx` or `ProductDetailsPage.tsx`

1. **User Clicks "Add to Cart"**
   ```typescript
   const handleAddToCart = async () => {
     await addToCart({ productId: 1, quantity: 1 });
     toast.success('Added to cart!');
   };
   ```

2. **Context Function** (`src/contexts/CartContext.tsx`)
   ```typescript
   const addToCart = async (item: CartItemRequest) => {
     const response = await cartService.addToCart(item);
     if (response.success) {
       await fetchCart(); // Refresh cart from server
     }
   };
   ```

3. **API Call** (`src/api/cart.ts`)
   ```typescript
   POST http://localhost:8080/api/cart
   Headers: { 
     'Content-Type': 'application/json',
     'Authorization': 'Bearer eyJhbGc...'
   }
   Body: {
     productId: 1,
     quantity: 1,
     size: "500g",
     color: null
   }
   ```

### Backend Flow

**Controller:** `CartController.java`

4. **Request Reception**
   ```java
   @PostMapping
   public ResponseEntity<ApiResponse> addToCart(
     @CurrentUser UserDetails userDetails,
     @RequestBody CartItemRequest request
   ) {
     User user = userService.getUserByEmail(userDetails.getUsername());
     CartItemResponse cart = cartService.addToCart(user, request);
     return ResponseEntity.ok(new ApiResponse(true, "Added to cart", cart));
   }
   ```

**Service:** `CartService.java`

5. **Business Logic**
   ```java
   public CartItemResponse addToCart(User user, CartItemRequest request) {
     Product product = productRepository.findById(request.getProductId())
       .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
     
     // Check if item already in cart
     Optional<CartItem> existingItem = cartItemRepository
       .findByUserAndProductAndSizeAndColor(user, product, size, color);
     
     CartItem cartItem;
     if (existingItem.isPresent()) {
       // Update quantity
       cartItem = existingItem.get();
       cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
     } else {
       // Create new cart item
       cartItem = new CartItem();
       cartItem.setUser(user);
       cartItem.setProduct(product);
       cartItem.setQuantity(request.getQuantity());
       cartItem.setSize(request.getSize());
       cartItem.setColor(request.getColor());
       cartItem.setPrice(product.getPrice());
     }
     
     cartItem.setSubtotal(cartItem.getPrice().multiply(
       BigDecimal.valueOf(cartItem.getQuantity())
     ));
     
     return convertToResponse(cartItemRepository.save(cartItem));
   }
   ```

### Database Operation

6. **Hibernate Queries**
   ```sql
   -- Check existing cart item
   SELECT * FROM cart_items 
   WHERE user_id = 1 AND product_id = 1 AND size = '500g';
   
   -- If exists, update
   UPDATE cart_items 
   SET quantity = 2, subtotal = 17.98, updated_at = NOW()
   WHERE id = 1;
   
   -- If not exists, insert
   INSERT INTO cart_items (user_id, product_id, quantity, size, price, subtotal, created_at)
   VALUES (1, 1, 1, '500g', 8.99, 8.99, NOW());
   ```

**Result:** ✅ Cart item stored in MySQL, persists across sessions

---

## 6️⃣ Order Placement Workflow

### Frontend Flow

**Component:** `src/pages/CheckoutPage.tsx`

1. **User Fills Checkout Form**
   ```
   Shipping Address:
   - Full Name: "John Doe"
   - Mobile: "9876543210"
   - Email: "john@example.com"
   - Address Line 1: "123 Main St"
   - City: "Mumbai"
   - State: "Maharashtra"
   - Zip: "400001"
   - Country: "India"
   
   Payment Method: COD / Online
   ```

2. **Form Validation**
   ```typescript
   - All required fields filled
   - Mobile: 10 digits
   - Email: valid format
   - Zip code: valid
   ```

3. **API Call** (`src/api/orders.ts`)
   ```typescript
   POST http://localhost:8080/api/orders
   Headers: { Authorization: 'Bearer ...' }
   Body: {
     shippingAddress: { ...formData },
     paymentMethod: "COD",
     notes: ""
   }
   ```

### Backend Flow

**Controller:** `OrderController.java`

4. **Request Reception**
   ```java
   @PostMapping
   public ResponseEntity<ApiResponse> createOrder(
     @CurrentUser UserDetails userDetails,
     @RequestBody OrderRequest request
   ) {
     User user = userService.getUserByEmail(userDetails.getUsername());
     OrderResponse order = orderService.createOrder(user, request);
     return ResponseEntity.ok(new ApiResponse(true, "Order created", order));
   }
   ```

**Service:** `OrderService.java`

5. **Complex Business Logic**
   ```java
   @Transactional
   public OrderResponse createOrder(User user, OrderRequest request) {
     // 1. Get user's cart items
     List<CartItem> cartItems = cartItemRepository.findByUser(user);
     if (cartItems.isEmpty()) throw new BadRequestException("Cart is empty");
     
     // 2. Create order
     Order order = new Order();
     order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8));
     order.setUser(user);
     order.setPaymentMethod(request.getPaymentMethod());
     order.setStatus(OrderStatus.PENDING);
     
     // 3. Create shipping address
     Address address = convertToAddress(request.getShippingAddress());
     address.setUser(user);
     order.setShippingAddress(address);
     
     // 4. Process cart items
     BigDecimal subtotal = BigDecimal.ZERO;
     List<OrderItem> orderItems = new ArrayList<>();
     
     for (CartItem cartItem : cartItems) {
       Product product = cartItem.getProduct();
       
       // Validate stock
       if (!product.getInStock() || product.getStockCount() < cartItem.getQuantity()) {
         throw new BadRequestException("Product " + product.getName() + " is out of stock");
       }
       
       // Create order item
       OrderItem orderItem = new OrderItem();
       orderItem.setOrder(order);
       orderItem.setProduct(product);
       orderItem.setQuantity(cartItem.getQuantity());
       orderItem.setSize(cartItem.getSize());
       orderItem.setColor(cartItem.getColor());
       orderItem.setPrice(product.getPrice());
       orderItem.setSubtotal(product.getPrice().multiply(
         BigDecimal.valueOf(cartItem.getQuantity())
       ));
       
       orderItems.add(orderItem);
       subtotal = subtotal.add(orderItem.getSubtotal());
       
       // Update product stock
       product.setStockCount(product.getStockCount() - cartItem.getQuantity());
       productRepository.save(product);
     }
     
     // 5. Calculate totals
     order.setOrderItems(orderItems);
     order.setSubtotal(subtotal);
     order.setDiscount(request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO);
     
     BigDecimal shipping = subtotal.compareTo(BigDecimal.valueOf(25)) >= 0 
       ? BigDecimal.ZERO : BigDecimal.valueOf(5.99);
     order.setShipping(shipping);
     
     order.setTotal(subtotal.subtract(order.getDiscount()).add(shipping));
     
     // 6. Save order
     Order savedOrder = orderRepository.save(order);
     
     // 7. Clear cart
     cartItemRepository.deleteByUser(user);
     
     return convertToResponse(savedOrder);
   }
   ```

### Database Operations (Transaction)

6. **Multiple SQL Queries in Transaction**
   ```sql
   START TRANSACTION;
   
   -- Insert shipping address
   INSERT INTO addresses (user_id, full_name, mobile, email, address_line1, city, state, zip_code, country)
   VALUES (1, 'John Doe', '9876543210', 'john@example.com', '123 Main St', 'Mumbai', 'Maharashtra', '400001', 'India');
   
   -- Insert order
   INSERT INTO orders (order_number, user_id, subtotal, discount, shipping, total, payment_method, status, shipping_address_id, created_at)
   VALUES ('ORD-A1B2C3D4', 1, 35.96, 0.00, 0.00, 35.96, 'COD', 'PENDING', 1, NOW());
   
   -- Insert order items
   INSERT INTO order_items (order_id, product_id, quantity, size, price, subtotal)
   VALUES 
     (1, 1, 2, '500g', 8.99, 17.98),
     (1, 2, 1, '1kg', 17.98, 17.98);
   
   -- Update product stock
   UPDATE products SET stock_count = stock_count - 2 WHERE id = 1;
   UPDATE products SET stock_count = stock_count - 1 WHERE id = 2;
   
   -- Clear cart
   DELETE FROM cart_items WHERE user_id = 1;
   
   COMMIT;
   ```

### Response Flow

7. **Backend Response**
   ```json
   {
     "success": true,
     "message": "Order placed successfully",
     "data": {
       "id": 1,
       "orderNumber": "ORD-A1B2C3D4",
       "subtotal": 35.96,
       "discount": 0.00,
       "shipping": 0.00,
       "total": 35.96,
       "paymentMethod": "COD",
       "status": "PENDING",
       "orderDate": "2025-10-20T04:00:00",
       "items": [
         {
           "productId": 1,
           "productName": "Turmeric Powder",
           "quantity": 2,
           "price": 8.99,
           "subtotal": 17.98
         },
         {
           "productId": 2,
           "productName": "Garam Masala",
           "quantity": 1,
           "price": 17.98,
           "subtotal": 17.98
         }
       ],
       "shippingAddress": { ... }
     }
   }
   ```

8. **Frontend Actions**
   ```typescript
   // Clear local cart state
   await clearCart();
   
   // Show success notification
   toast.success("Order placed successfully!");
   
   // Navigate to order confirmation
   navigate(`/order-success/${response.data.orderNumber}`);
   ```

**Result:** ✅ Order created in MySQL, cart cleared, stock updated

---

## 7️⃣ Protected Routes & Authorization

### Route Protection

**Component:** `src/components/auth/ProtectedRoute.tsx`

1. **Route Guard**
   ```typescript
   export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
     const { isAuthenticated, isLoading } = useAuth();
     
     if (isLoading) {
       return <LoadingSpinner />;
     }
     
     if (!isAuthenticated) {
       return <Navigate to="/login" replace />;
     }
     
     return <>{children}</>;
   };
   ```

2. **Usage in App.tsx**
   ```typescript
   <Route
     path="/checkout"
     element={
       <ProtectedRoute>
         <CheckoutPage />
       </ProtectedRoute>
     }
   />
   ```

### Backend Authorization

**Security Configuration:** `JwtAuthenticationFilter.java`

3. **JWT Token Validation**
   ```java
   protected void doFilterInternal(HttpServletRequest request, ...) {
     String token = extractTokenFromRequest(request);
     
     if (token != null && jwtService.validateToken(token)) {
       String email = jwtService.extractUsername(token);
       UserDetails userDetails = userDetailsService.loadUserByUsername(email);
       
       Authentication authentication = new UsernamePasswordAuthenticationToken(
         userDetails, null, userDetails.getAuthorities()
       );
       
       SecurityContextHolder.getContext().setAuthentication(authentication);
     }
   }
   ```

4. **Protected Endpoints**
   ```java
   @GetMapping("/api/cart")
   @PreAuthorize("isAuthenticated()")
   public ResponseEntity<ApiResponse> getCart(@CurrentUser UserDetails user) {
     // Only accessible with valid JWT token
   }
   ```

**Result:** ✅ Unauthorized users cannot access protected pages or API endpoints

---

## 🗃️ Database Schema Relationships

```sql
users (1) ──────< (∞) cart_items (∞) >────── (1) products
  │                                               │
  │                                               │
  │                                            categories
  ├────< (∞) orders                              │
  │           │                                   ├──< (∞) product_images
  │           │                                   ├──< (∞) product_features
  │           ├──< (∞) order_items (∞) >─────────┤
  │           │                                   └──< (∞) product_sizes
  │           └──> (1) addresses
  │
  └────< (∞) addresses
```

**Key Relationships:**
- User has many Cart Items (one-to-many)
- User has many Orders (one-to-many)
- User has many Addresses (one-to-many)
- Product has many Cart Items (one-to-many)
- Product has many Order Items (one-to-many)
- Product belongs to one Category (many-to-one)
- Product has many Images, Features, Sizes (one-to-many)
- Order has many Order Items (one-to-many)
- Order has one Shipping Address (many-to-one)

---

## 🔐 Security Flow

### Password Security
```
User Password: "password123"
       ↓
BCrypt Hashing: $2a$10$N9qo8uLOickgx2Z...
       ↓
Stored in MySQL: password column
       ↓
On Login: BCrypt.matches(rawPassword, storedHash)
       ↓
Match? → Generate JWT → Login Success
```

### JWT Token Flow
```
User Logs In
     ↓
Backend generates JWT with:
  - Subject: user email
  - Claims: role, user ID
  - Expiration: 24 hours
  - Signature: HS256 with secret key
     ↓
Frontend stores token in localStorage
     ↓
Every API request includes: Authorization: Bearer <token>
     ↓
Backend validates:
  - Signature valid?
  - Token not expired?
  - User exists?
     ↓
Valid? → Process request
Invalid? → 401 Unauthorized → Auto-logout
```

---

## 📊 Data Flow Summary

### 1. **Stateless Operations (No DB)**
   - UI interactions
   - Client-side validation
   - Routing/navigation
   - Local state management

### 2. **Stateful Operations (With DB)**
   - User registration/login → users table
   - Add/remove cart items → cart_items table
   - Place order → orders, order_items, addresses tables
   - Search products → products table query
   - View order history → orders + order_items join

### 3. **Session Management**
   - JWT token in localStorage (persistent)
   - User object in React Context (in-memory)
   - Auto-refresh on page load from localStorage
   - Auto-logout on token expiry or 401 error

---

## 🚀 Performance Optimizations

1. **Debounced Search** - Reduces API calls by 300ms
2. **Connection Pooling** - HikariCP manages DB connections
3. **JPA Lazy Loading** - Related entities loaded on-demand
4. **React Context** - Prevents prop drilling
5. **Token-based Auth** - Stateless, no session storage needed
6. **Indexed Foreign Keys** - Fast DB queries
7. **Transaction Management** - @Transactional ensures data integrity

---

## 🔄 Error Handling

### Frontend
```typescript
try {
  await apiCall();
} catch (error) {
  if (error.response?.status === 401) {
    // Unauthorized - auto-logout
  } else if (error.response?.data?.message) {
    toast.error(error.response.data.message);
  } else {
    toast.error('Something went wrong');
  }
}
```

### Backend
```java
@ControllerAdvice
public class GlobalExceptionHandler {
  
  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ApiResponse> handleNotFound(ResourceNotFoundException ex) {
    return ResponseEntity.status(404)
      .body(new ApiResponse(false, ex.getMessage(), null));
  }
  
  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ApiResponse> handleBadRequest(BadRequestException ex) {
    return ResponseEntity.status(400)
      .body(new ApiResponse(false, ex.getMessage(), null));
  }
}
```

---

## ✅ Complete Request-Response Cycle

```
User Action (e.g., Place Order)
       ↓
React Component handles user input
       ↓
Client-side validation
       ↓
API service function called (axios)
       ↓
HTTP request with JWT token
       ↓
Spring Boot Controller receives request
       ↓
JWT Filter validates token
       ↓
Security Context sets authentication
       ↓
Controller calls Service layer
       ↓
Service executes business logic
       ↓
Repository interacts with database via Hibernate
       ↓
MySQL executes SQL queries
       ↓
Database returns results
       ↓
Hibernate maps results to Java objects
       ↓
Service processes data
       ↓
Service returns DTO to Controller
       ↓
Controller wraps in ApiResponse
       ↓
HTTP response sent to frontend
       ↓
Axios receives response
       ↓
React Context updates state
       ↓
UI re-renders with new data
       ↓
Success message shown to user
```

---

**Last Updated:** October 20, 2025  
**Document Version:** 1.0.0  
**Application Stack:** React + Spring Boot + MySQL  
**Status:** ✅ Production Ready
