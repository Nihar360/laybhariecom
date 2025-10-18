# Spring Boot E-Commerce Backend - Complete Implementation Guide

## Table of Contents
1. [Project Structure](#project-structure)
2. [Tech Stack](#tech-stack)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Implementation Phases](#implementation-phases)
6. [Code Templates](#code-templates)
7. [Configuration Files](#configuration-files)
8. [Admin Panel Features](#admin-panel-features)

---

## 1. Project Structure

```
ecommerce-backend/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── spicehouse/
│   │   │           └── ecommerce/
│   │   │               ├── EcommerceApplication.java
│   │   │               │
│   │   │               ├── config/
│   │   │               │   ├── SecurityConfig.java
│   │   │               │   ├── JwtConfig.java
│   │   │               │   └── CorsConfig.java
│   │   │               │
│   │   │               ├── controller/
│   │   │               │   ├── AuthController.java
│   │   │               │   ├── UserController.java
│   │   │               │   ├── ProductController.java
│   │   │               │   ├── CartController.java
│   │   │               │   └── OrderController.java
│   │   │               │
│   │   │               ├── service/
│   │   │               │   ├── UserService.java
│   │   │               │   ├── ProductService.java
│   │   │               │   ├── CartService.java
│   │   │               │   └── OrderService.java
│   │   │               │
│   │   │               ├── repository/
│   │   │               │   ├── UserRepository.java
│   │   │               │   ├── ProductRepository.java
│   │   │               │   ├── CartRepository.java
│   │   │               │   ├── CartItemRepository.java
│   │   │               │   ├── OrderRepository.java
│   │   │               │   └── OrderItemRepository.java
│   │   │               │
│   │   │               ├── model/
│   │   │               │   ├── User.java
│   │   │               │   ├── Product.java
│   │   │               │   ├── Cart.java
│   │   │               │   ├── CartItem.java
│   │   │               │   ├── Order.java
│   │   │               │   └── OrderItem.java
│   │   │               │
│   │   │               ├── dto/
│   │   │               │   ├── request/
│   │   │               │   │   ├── LoginRequest.java
│   │   │               │   │   ├── RegisterRequest.java
│   │   │               │   │   ├── AddToCartRequest.java
│   │   │               │   │   └── PlaceOrderRequest.java
│   │   │               │   └── response/
│   │   │               │       ├── JwtResponse.java
│   │   │               │       ├── UserResponse.java
│   │   │               │       ├── ProductResponse.java
│   │   │               │       ├── CartResponse.java
│   │   │               │       └── OrderResponse.java
│   │   │               │
│   │   │               ├── security/
│   │   │               │   ├── JwtTokenProvider.java
│   │   │               │   ├── JwtAuthenticationFilter.java
│   │   │               │   └── UserDetailsServiceImpl.java
│   │   │               │
│   │   │               └── exception/
│   │   │                   ├── GlobalExceptionHandler.java
│   │   │                   ├── ResourceNotFoundException.java
│   │   │                   └── BadRequestException.java
│   │   │
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application-dev.properties
│   │
│   └── test/
│       └── java/
│           └── com/
│               └── spicehouse/
│                   └── ecommerce/
│                       └── EcommerceApplicationTests.java
│
└── pom.xml
```

---

## 2. Tech Stack

### Core Technologies
- **Java**: 17 or 21 (LTS versions)
- **Spring Boot**: 3.2.x (latest stable)
- **Build Tool**: Maven 3.9+
- **Database**: MySQL 8.0+
- **IDE**: IntelliJ IDEA or Eclipse

### Dependencies
```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- MySQL Driver -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## 3. Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20),
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    image_url VARCHAR(500),
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Carts Table
```sql
CREATE TABLE carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Cart Items Table
```sql
CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_product (cart_id, product_id)
);
```

### Orders Table
```sql
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    payment_method VARCHAR(50),
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### ER Diagram Relationships
- **User** (1) → (1) **Cart**
- **Cart** (1) → (N) **CartItem**
- **Product** (1) → (N) **CartItem**
- **User** (1) → (N) **Order**
- **Order** (1) → (N) **OrderItem**
- **Product** (1) → (N) **OrderItem**

---

## 4. API Endpoints

### 4.1 Authentication APIs

#### Register User
- **Method**: POST
- **URL**: `/api/auth/register`
- **Description**: Register a new user
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe",
  "mobile": "1234567890"
}
```
- **Response** (201 Created):
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

#### Login User
- **Method**: POST
- **URL**: `/api/auth/login`
- **Description**: Login and receive JWT token
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```
- **Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "userId": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "USER"
}
```

---

### 4.2 User APIs

#### Get User Profile
- **Method**: GET
- **URL**: `/api/users/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Description**: Get logged-in user's profile
- **Response** (200 OK):
```json
{
  "id": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "mobile": "1234567890",
  "role": "USER",
  "createdAt": "2025-01-15T10:30:00"
}
```

#### Update User Profile
- **Method**: PUT
- **URL**: `/api/users/profile`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
  "fullName": "John Updated Doe",
  "mobile": "9876543210"
}
```
- **Response** (200 OK):
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Updated Doe",
    "mobile": "9876543210"
  }
}
```

---

### 4.3 Product APIs

#### Get All Products
- **Method**: GET
- **URL**: `/api/products`
- **Query Params**: `?category={category}&search={keyword}&page=0&size=10`
- **Description**: Fetch all products with optional filters
- **Response** (200 OK):
```json
{
  "content": [
    {
      "id": 1,
      "name": "Turmeric Powder",
      "description": "Premium quality turmeric",
      "price": 12.99,
      "category": "Single Spices",
      "imageUrl": "https://example.com/turmeric.jpg",
      "stockQuantity": 100
    }
  ],
  "totalPages": 5,
  "totalElements": 50,
  "currentPage": 0
}
```

#### Get Product by ID
- **Method**: GET
- **URL**: `/api/products/{id}`
- **Description**: Get single product details
- **Response** (200 OK):
```json
{
  "id": 1,
  "name": "Turmeric Powder",
  "description": "Premium quality turmeric powder from India",
  "price": 12.99,
  "category": "Single Spices",
  "imageUrl": "https://example.com/turmeric.jpg",
  "stockQuantity": 100,
  "createdAt": "2025-01-10T08:00:00"
}
```

#### Create Product (Admin Only)
- **Method**: POST
- **URL**: `/api/products`
- **Headers**: `Authorization: Bearer {admin-token}`
- **Request Body**:
```json
{
  "name": "Red Chili Powder",
  "description": "Hot and spicy red chili",
  "price": 8.99,
  "category": "Single Spices",
  "imageUrl": "https://example.com/chili.jpg",
  "stockQuantity": 200
}
```
- **Response** (201 Created):
```json
{
  "id": 2,
  "name": "Red Chili Powder",
  "price": 8.99,
  "message": "Product created successfully"
}
```

#### Update Product (Admin Only)
- **Method**: PUT
- **URL**: `/api/products/{id}`
- **Headers**: `Authorization: Bearer {admin-token}`
- **Request Body**: (same as create)
- **Response** (200 OK):
```json
{
  "message": "Product updated successfully",
  "product": { /* updated product */ }
}
```

#### Delete Product (Admin Only)
- **Method**: DELETE
- **URL**: `/api/products/{id}`
- **Headers**: `Authorization: Bearer {admin-token}`
- **Response** (200 OK):
```json
{
  "message": "Product deleted successfully"
}
```

---

### 4.4 Cart APIs

#### Get User Cart
- **Method**: GET
- **URL**: `/api/cart`
- **Headers**: `Authorization: Bearer {token}`
- **Description**: Get current user's cart
- **Response** (200 OK):
```json
{
  "cartId": 1,
  "items": [
    {
      "id": 1,
      "productId": 1,
      "productName": "Turmeric Powder",
      "price": 12.99,
      "quantity": 2,
      "imageUrl": "https://example.com/turmeric.jpg",
      "subtotal": 25.98
    }
  ],
  "totalItems": 2,
  "totalPrice": 25.98
}
```

#### Add to Cart
- **Method**: POST
- **URL**: `/api/cart/items`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
  "productId": 1,
  "quantity": 2
}
```
- **Response** (200 OK):
```json
{
  "message": "Item added to cart",
  "cartItem": {
    "id": 1,
    "productId": 1,
    "quantity": 2,
    "price": 12.99
  }
}
```

#### Update Cart Item Quantity
- **Method**: PUT
- **URL**: `/api/cart/items/{cartItemId}`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
  "quantity": 5
}
```
- **Response** (200 OK):
```json
{
  "message": "Cart updated",
  "cartItem": {
    "id": 1,
    "quantity": 5
  }
}
```

#### Remove from Cart
- **Method**: DELETE
- **URL**: `/api/cart/items/{cartItemId}`
- **Headers**: `Authorization: Bearer {token}`
- **Response** (200 OK):
```json
{
  "message": "Item removed from cart"
}
```

#### Clear Cart
- **Method**: DELETE
- **URL**: `/api/cart/clear`
- **Headers**: `Authorization: Bearer {token}`
- **Response** (200 OK):
```json
{
  "message": "Cart cleared successfully"
}
```

---

### 4.5 Order APIs

#### Place Order
- **Method**: POST
- **URL**: `/api/orders`
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
  "shippingAddress": {
    "fullName": "John Doe",
    "mobile": "1234567890",
    "addressLine1": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  },
  "paymentMethod": "RAZORPAY"
}
```
- **Response** (201 Created):
```json
{
  "orderId": 1,
  "orderNumber": "ORD-2025-001",
  "totalAmount": 45.97,
  "status": "PENDING",
  "message": "Order placed successfully",
  "estimatedDelivery": "2025-01-20"
}
```

#### Get User Orders
- **Method**: GET
- **URL**: `/api/orders`
- **Headers**: `Authorization: Bearer {token}`
- **Query Params**: `?page=0&size=10`
- **Response** (200 OK):
```json
{
  "content": [
    {
      "id": 1,
      "orderNumber": "ORD-2025-001",
      "totalAmount": 45.97,
      "status": "DELIVERED",
      "paymentMethod": "RAZORPAY",
      "createdAt": "2025-01-15T14:30:00",
      "itemCount": 3
    }
  ],
  "totalPages": 2,
  "currentPage": 0
}
```

#### Get Order Details by ID
- **Method**: GET
- **URL**: `/api/orders/{orderId}`
- **Headers**: `Authorization: Bearer {token}`
- **Response** (200 OK):
```json
{
  "id": 1,
  "orderNumber": "ORD-2025-001",
  "status": "DELIVERED",
  "totalAmount": 45.97,
  "paymentMethod": "RAZORPAY",
  "shippingAddress": "123 Main St, Mumbai, Maharashtra 400001, India",
  "items": [
    {
      "id": 1,
      "productName": "Turmeric Powder",
      "quantity": 2,
      "price": 12.99,
      "subtotal": 25.98
    }
  ],
  "createdAt": "2025-01-15T14:30:00"
}
```

#### Cancel Order
- **Method**: PUT
- **URL**: `/api/orders/{orderId}/cancel`
- **Headers**: `Authorization: Bearer {token}`
- **Response** (200 OK):
```json
{
  "message": "Order cancelled successfully",
  "orderId": 1,
  "status": "CANCELLED"
}
```

---

## 5. Implementation Phases

### Phase 1: Project Setup (Day 1)
**Goal**: Initialize Spring Boot project with MySQL connection

**Steps**:
1. Create Spring Boot project using Spring Initializr (https://start.spring.io/)
   - Project: Maven
   - Language: Java
   - Spring Boot: 3.2.x
   - Dependencies: Web, JPA, MySQL, Security, Validation, Lombok

2. Configure `application.properties`:
```properties
# Server Configuration
server.port=8080

# MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=yourSecretKeyForJWT2025SpiceHouseEcommerceApplication
jwt.expiration=86400000

# Logging
logging.level.org.springframework.security=DEBUG
```

3. Create MySQL database:
```sql
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. Test application startup:
```bash
mvn spring-boot:run
```

**Deliverables**: Working Spring Boot app connected to MySQL

---

### Phase 2: Model/Entity Classes (Day 2)
**Goal**: Create all database entities with relationships

**Steps**:
1. Create `User.java` entity with Lombok annotations
2. Create `Product.java` entity
3. Create `Cart.java` and `CartItem.java` entities with relationships
4. Create `Order.java` and `OrderItem.java` entities
5. Run application to auto-create tables

**Sample Entity Code** (User.java):
```java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    @Email
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "full_name", nullable = false)
    private String fullName;
    
    private String mobile;
    
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;
    
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Cart cart;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders;
}
```

**Deliverables**: All entity classes created, tables auto-generated in MySQL

---

### Phase 3: Repositories (Day 3)
**Goal**: Create Spring Data JPA repositories

**Steps**:
1. Create repository interfaces for each entity
2. Add custom query methods where needed

**Sample Repository**:
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
}

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    List<Product> findByNameContainingIgnoreCase(String keyword);
}

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    Optional<Order> findByOrderNumber(String orderNumber);
}
```

**Deliverables**: All repository interfaces ready for service layer

---

### Phase 4: Service Layer (Day 4-5)
**Goal**: Implement business logic in service classes

**Steps**:
1. Create `UserService` with registration and profile methods
2. Create `ProductService` with CRUD operations
3. Create `CartService` with add/remove/update logic
4. Create `OrderService` with order placement logic

**Sample Service**:
```java
@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    
    public Page<Product> getAllProducts(String category, String search, Pageable pageable) {
        if (category != null) {
            return productRepository.findByCategory(category, pageable);
        }
        if (search != null) {
            return productRepository.findByNameContainingIgnoreCase(search, pageable);
        }
        return productRepository.findAll(pageable);
    }
    
    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }
    
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
}
```

**Deliverables**: Complete service layer with business logic

---

### Phase 5: Controller Layer (Day 6)
**Goal**: Create REST API endpoints

**Steps**:
1. Create controllers for each module
2. Add proper validation and error handling
3. Map endpoints to service methods

**Sample Controller**:
```java
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    
    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String search,
        @PageableDefault(size = 10) Pageable pageable
    ) {
        Page<Product> products = productService.getAllProducts(category, search, pageable);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        Product created = productService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
```

**Deliverables**: All REST endpoints functional

---

### Phase 6: JWT Authentication (Day 7-8)
**Goal**: Secure APIs with JWT token-based authentication

**Steps**:
1. Create `JwtTokenProvider` utility class
2. Implement `JwtAuthenticationFilter`
3. Configure `SecurityConfig`
4. Create `AuthController` for login/register
5. Implement `UserDetailsServiceImpl`

**Key Components**:

**JwtTokenProvider.java**:
```java
@Component
public class JwtTokenProvider {
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private long jwtExpiration;
    
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }
    
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
```

**SecurityConfig.java**:
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthFilter;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/products/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

**AuthController.java**:
```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        User user = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(Map.of("message", "User registered successfully", "userId", user.getId()));
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken((UserDetails) authentication.getPrincipal());
        
        return ResponseEntity.ok(new JwtResponse(token, "Bearer", user));
    }
}
```

**Deliverables**: Secure authentication system with JWT

---

### Phase 7: DTOs and Validation (Day 9)
**Goal**: Add Data Transfer Objects and input validation

**Steps**:
1. Create request DTOs with validation annotations
2. Create response DTOs
3. Add global exception handler

**Sample DTO**:
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile must be 10 digits")
    private String mobile;
}
```

**Global Exception Handler**:
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of("error", ex.getMessage()));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
            .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }
}
```

**Deliverables**: Clean DTOs with validation, proper error handling

---

### Phase 8: Testing (Day 10)
**Goal**: Test all APIs using Postman

**Steps**:
1. Create Postman collection for all endpoints
2. Test authentication flow (register → login → get token)
3. Test protected endpoints with JWT token
4. Test all CRUD operations
5. Test cart and order flows

**Postman Collection Structure**:
```
E-Commerce API/
├── Auth/
│   ├── Register
│   └── Login
├── Users/
│   ├── Get Profile
│   └── Update Profile
├── Products/
│   ├── Get All Products
│   ├── Get Product by ID
│   ├── Create Product (Admin)
│   ├── Update Product (Admin)
│   └── Delete Product (Admin)
├── Cart/
│   ├── Get Cart
│   ├── Add to Cart
│   ├── Update Cart Item
│   ├── Remove from Cart
│   └── Clear Cart
└── Orders/
    ├── Place Order
    ├── Get User Orders
    ├── Get Order Details
    └── Cancel Order
```

**Deliverables**: Fully tested API with Postman collection

---

### Phase 9: Frontend Integration (Day 11-12)
**Goal**: Connect React frontend with Spring Boot backend

**Steps**:
1. Update React app to use real API endpoints
2. Configure CORS in Spring Boot
3. Implement JWT token storage in localStorage
4. Add API interceptor for attaching JWT token
5. Update all frontend API calls

**CORS Configuration**:
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5000"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    return source -> configuration;
}
```

**React API Service** (api.ts):
```typescript
const API_BASE_URL = 'http://localhost:8080/api';

const getAuthToken = () => localStorage.getItem('token');

export const authAPI = {
  register: (data: RegisterData) =>
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
    
  login: (email: string, password: string) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),
};

export const productAPI = {
  getAll: (params?: { category?: string; search?: string; page?: number }) =>
    fetch(`${API_BASE_URL}/products?${new URLSearchParams(params)}`),
    
  getById: (id: number) =>
    fetch(`${API_BASE_URL}/products/${id}`),
};

export const cartAPI = {
  getCart: () =>
    fetch(`${API_BASE_URL}/cart`, {
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
    }),
    
  addItem: (productId: number, quantity: number) =>
    fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ productId, quantity }),
    }),
};
```

**Deliverables**: Fully integrated full-stack application

---

## 6. Code Templates

### 6.1 Complete Model Classes

#### User.java
```java
package com.spicehouse.ecommerce.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "full_name", nullable = false)
    private String fullName;
    
    private String mobile;
    
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;
    
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Cart cart;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders;
}

enum Role {
    USER, ADMIN
}
```

#### Product.java
```java
package com.spicehouse.ecommerce.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    private String category;
    
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    
    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;
    
    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

#### Cart.java & CartItem.java
```java
package com.spicehouse.ecommerce.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;
    
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(nullable = false)
    private Integer quantity = 1;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
}
```

#### Order.java & OrderItem.java
```java
package com.spicehouse.ecommerce.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;
    
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;
    
    @Column(name = "payment_method")
    private String paymentMethod;
    
    @Column(name = "shipping_address", columnDefinition = "TEXT", nullable = false)
    private String shippingAddress;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}

enum OrderStatus {
    PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
}

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(name = "product_name", nullable = false)
    private String productName;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
}
```

---

## 7. Configuration Files

### application.properties
```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/

# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false

# Enable JPA Auditing
spring.jpa.properties.hibernate.enable_lazy_load_no_trans=true

# JWT Configuration
jwt.secret=mySecretKeyForJWT2025SpiceHouseEcommerceApplicationVerySecureAndLongKey
jwt.expiration=86400000

# Logging Configuration
logging.level.root=INFO
logging.level.com.spicehouse.ecommerce=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# File Upload Configuration (for product images)
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB

# Jackson Configuration
spring.jackson.serialization.fail-on-empty-beans=false
spring.jackson.default-property-inclusion=NON_NULL
```

### pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.spicehouse</groupId>
    <artifactId>ecommerce-backend</artifactId>
    <version>1.0.0</version>
    <name>Spice House E-Commerce Backend</name>
    <description>Spring Boot backend for e-commerce application</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- MySQL Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- JWT Dependencies -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.11.5</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- DevTools for hot reload -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        
        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## 8. Admin Panel Features (Phase 2)

### Admin Endpoints

#### Admin Login
- **Method**: POST
- **URL**: `/api/admin/login`
- **Description**: Admin login with elevated privileges
- Same as user login, but returns role: ADMIN

#### Get All Users (Admin Only)
- **Method**: GET
- **URL**: `/api/admin/users`
- **Headers**: `Authorization: Bearer {admin-token}`
- **Response**:
```json
{
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "USER",
      "createdAt": "2025-01-15"
    }
  ],
  "totalUsers": 100
}
```

#### Get All Orders (Admin Only)
- **Method**: GET
- **URL**: `/api/admin/orders`
- **Headers**: `Authorization: Bearer {admin-token}`
- **Query Params**: `?status={status}&page=0&size=20`
- **Response**: Paginated list of all orders

#### Update Order Status (Admin Only)
- **Method**: PUT
- **URL**: `/api/admin/orders/{orderId}/status`
- **Headers**: `Authorization: Bearer {admin-token}`
- **Request Body**:
```json
{
  "status": "SHIPPED"
}
```

#### Dashboard Statistics (Admin Only)
- **Method**: GET
- **URL**: `/api/admin/dashboard`
- **Headers**: `Authorization: Bearer {admin-token}`
- **Response**:
```json
{
  "totalUsers": 1250,
  "totalProducts": 85,
  "totalOrders": 450,
  "totalRevenue": 45897.50,
  "recentOrders": [ /* last 10 orders */ ],
  "topSellingProducts": [ /* top 5 products */ ]
}
```

---

## 9. Project Flow Explanation

### Request Flow Architecture

```
Frontend (React)
    ↓ HTTP Request with JWT Token
    ↓
REST API Controller Layer
    ↓ Validates input, calls service
    ↓
Service Layer (Business Logic)
    ↓ Processes data, applies business rules
    ↓
Repository Layer (Spring Data JPA)
    ↓ Generates SQL queries
    ↓
MySQL Database
    ↓ Returns data
    ↑
Repository → Service → Controller → Frontend
```

### Authentication Flow

```
1. User Registration:
   Frontend → POST /api/auth/register → Controller
   → UserService.registerUser() → Hash password with BCrypt
   → UserRepository.save() → MySQL
   → Return success response

2. User Login:
   Frontend → POST /api/auth/login → AuthController
   → AuthenticationManager.authenticate()
   → UserDetailsService loads user from DB
   → Verify password
   → JwtTokenProvider.generateToken()
   → Return JWT token to frontend

3. Protected Route Access:
   Frontend → GET /api/cart (with JWT in header)
   → JwtAuthenticationFilter intercepts request
   → Extract and validate JWT token
   → Load user from token
   → Set SecurityContext
   → Controller → Service → Repository → MySQL
   → Return response
```

### Cart to Order Flow

```
1. User adds items to cart:
   → POST /api/cart/items
   → CartService.addToCart(userId, productId, quantity)
   → Find or create Cart for user
   → Create CartItem
   → Save to database

2. User proceeds to checkout:
   → Frontend displays cart items
   → User fills shipping address

3. User places order:
   → POST /api/orders
   → OrderService.placeOrder(userId, shippingAddress)
   → Create Order entity
   → Copy CartItems to OrderItems
   → Clear cart
   → Save Order to database
   → Return order confirmation
```

---

## 10. Quick Start Checklist

### Day 1: Setup
- [ ] Install Java 17, Maven, MySQL
- [ ] Create Spring Boot project
- [ ] Configure application.properties
- [ ] Create MySQL database
- [ ] Test connection and startup

### Day 2: Database
- [ ] Create all entity classes
- [ ] Define relationships
- [ ] Verify tables are auto-created
- [ ] Add sample data manually

### Day 3: Repositories
- [ ] Create all repository interfaces
- [ ] Test basic CRUD operations

### Day 4-5: Services
- [ ] Implement UserService
- [ ] Implement ProductService
- [ ] Implement CartService
- [ ] Implement OrderService

### Day 6: Controllers
- [ ] Create REST controllers
- [ ] Map endpoints
- [ ] Add validation

### Day 7-8: Security
- [ ] Configure Spring Security
- [ ] Implement JWT authentication
- [ ] Secure endpoints
- [ ] Test login flow

### Day 9: DTOs & Exception Handling
- [ ] Create request/response DTOs
- [ ] Add validation annotations
- [ ] Implement global exception handler

### Day 10: Testing
- [ ] Create Postman collection
- [ ] Test all endpoints
- [ ] Fix bugs

### Day 11-12: Frontend Integration
- [ ] Configure CORS
- [ ] Update React API calls
- [ ] Test full flow
- [ ] Deploy

---

## 11. Common Issues & Solutions

### Issue 1: JWT Token Not Working
**Solution**: Check token is sent in header as `Authorization: Bearer {token}`

### Issue 2: CORS Error
**Solution**: Add CORS configuration in SecurityConfig

### Issue 3: Password Not Hashing
**Solution**: Use `passwordEncoder.encode()` before saving

### Issue 4: Lazy Loading Error
**Solution**: Use `@Transactional` or fetch data eagerly

### Issue 5: Circular Reference in JSON
**Solution**: Use `@JsonIgnoreProperties` or DTOs

---

## 12. Next Steps After Completion

1. **Add Product Images Upload**: Implement file upload for product images
2. **Email Notifications**: Send order confirmation emails
3. **Payment Integration**: Integrate actual Razorpay/Stripe payment
4. **Search & Filters**: Advanced product search with filters
5. **Reviews & Ratings**: Add product review system
6. **Wishlist**: Implement user wishlist feature
7. **Admin Dashboard**: Build complete admin panel
8. **Analytics**: Track user behavior and sales
9. **Caching**: Add Redis for better performance
10. **Deployment**: Deploy to AWS, Azure, or Heroku

---

## Resources

- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **Spring Security**: https://spring.io/projects/spring-security
- **JWT Guide**: https://jwt.io/
- **MySQL Docs**: https://dev.mysql.com/doc/
- **Postman**: https://www.postman.com/

---

**Good luck with your Spring Boot backend implementation! 🚀**
