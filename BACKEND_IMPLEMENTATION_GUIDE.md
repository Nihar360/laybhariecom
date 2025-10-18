# Spring Boot + MySQL Backend Implementation Guide
## Complete E-commerce Backend for Spice House

---

## Table of Contents
1. [Project Structure](#project-structure)
2. [Dependencies (pom.xml)](#dependencies-pomxml)
3. [Application Configuration](#application-configuration)
4. [Entity Models](#entity-models)
5. [Repository Layer](#repository-layer)
6. [DTO Classes](#dto-classes)
7. [Service Layer](#service-layer)
8. [Controller Layer](#controller-layer)
9. [Security Configuration](#security-configuration)
10. [Exception Handling](#exception-handling)
11. [Database Schema](#database-schema)
12. [API Documentation](#api-documentation)

---

## Project Structure

```
spice-house-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── spicehouse/
│   │   │           ├── SpiceHouseApplication.java
│   │   │           ├── config/
│   │   │           │   ├── SecurityConfig.java
│   │   │           │   ├── CorsConfig.java
│   │   │           │   └── JwtConfig.java
│   │   │           ├── controller/
│   │   │           │   ├── ProductController.java
│   │   │           │   ├── CategoryController.java
│   │   │           │   ├── CartController.java
│   │   │           │   ├── OrderController.java
│   │   │           │   ├── AuthController.java
│   │   │           │   └── UserController.java
│   │   │           ├── dto/
│   │   │           │   ├── request/
│   │   │           │   │   ├── LoginRequest.java
│   │   │           │   │   ├── RegisterRequest.java
│   │   │           │   │   ├── CartItemRequest.java
│   │   │           │   │   └── OrderRequest.java
│   │   │           │   └── response/
│   │   │           │       ├── AuthResponse.java
│   │   │           │       ├── ProductResponse.java
│   │   │           │       ├── OrderResponse.java
│   │   │           │       └── ApiResponse.java
│   │   │           ├── entity/
│   │   │           │   ├── User.java
│   │   │           │   ├── Product.java
│   │   │           │   ├── Category.java
│   │   │           │   ├── CartItem.java
│   │   │           │   ├── Order.java
│   │   │           │   ├── OrderItem.java
│   │   │           │   └── Address.java
│   │   │           ├── repository/
│   │   │           │   ├── UserRepository.java
│   │   │           │   ├── ProductRepository.java
│   │   │           │   ├── CategoryRepository.java
│   │   │           │   ├── CartItemRepository.java
│   │   │           │   ├── OrderRepository.java
│   │   │           │   └── AddressRepository.java
│   │   │           ├── service/
│   │   │           │   ├── UserService.java
│   │   │           │   ├── ProductService.java
│   │   │           │   ├── CategoryService.java
│   │   │           │   ├── CartService.java
│   │   │           │   ├── OrderService.java
│   │   │           │   └── JwtService.java
│   │   │           ├── exception/
│   │   │           │   ├── ResourceNotFoundException.java
│   │   │           │   ├── BadRequestException.java
│   │   │           │   └── GlobalExceptionHandler.java
│   │   │           └── util/
│   │   │               └── Constants.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── data.sql (optional - for initial data)
│   └── test/
└── pom.xml
```

---

## Dependencies (pom.xml)

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
    <artifactId>spice-house-backend</artifactId>
    <version>1.0.0</version>
    <name>Spice House Backend</name>
    <description>E-commerce backend for Spice House</description>
    
    <properties>
        <java.version>17</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starter Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <!-- Spring Boot Starter Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <!-- Spring Boot Starter Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        
        <!-- Spring Boot Starter Validation -->
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
            <version>0.12.3</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- Spring Boot DevTools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        
        <!-- Spring Boot Starter Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        
        <!-- Spring Security Test -->
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

## Application Configuration

### application.properties

```properties
# Application Name
spring.application.name=spice-house-backend

# Server Port
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/spice_house_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
jwt.expiration=86400000

# Logging
logging.level.org.springframework.security=DEBUG
logging.level.com.spicehouse=DEBUG

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# CORS Configuration
cors.allowed.origins=http://localhost:5000,http://localhost:3000
```

---

## Entity Models

### 1. User.java

```java
package com.spicehouse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(unique = true)
    private String mobile;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.CUSTOMER;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> addresses = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders = new ArrayList<>();
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    public enum Role {
        CUSTOMER,
        ADMIN
    }
}
```

### 2. Product.java

```java
package com.spicehouse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal originalPrice;
    
    @Column(nullable = false, length = 1000)
    private String image;
    
    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url", length = 1000)
    private List<String> images = new ArrayList<>();
    
    @Column(nullable = false)
    private Double rating = 0.0;
    
    @Column(nullable = false)
    private Integer reviews = 0;
    
    private String badge;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @Column(length = 2000)
    private String description;
    
    @ElementCollection
    @CollectionTable(name = "product_features", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "feature", length = 500)
    private List<String> features = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "size")
    private List<String> sizes = new ArrayList<>();
    
    @Column(nullable = false)
    private Boolean inStock = true;
    
    @Column(nullable = false)
    private Integer stockCount = 0;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### 3. Category.java

```java
package com.spicehouse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(length = 1000)
    private String image;
    
    private String itemCount;
    
    @Column(length = 1000)
    private String description;
    
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Product> products = new ArrayList<>();
}
```

### 4. CartItem.java

```java
package com.spicehouse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(nullable = false)
    private Integer quantity;
    
    private String size;
    
    private String color;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

### 5. Order.java

```java
package com.spicehouse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
    
    @Column(unique = true, nullable = false)
    private String orderNumber;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();
    
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "shipping_address_id", nullable = false)
    private Address shippingAddress;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal shipping;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.PENDING;
    
    @Column(length = 1000)
    private String notes;
    
    private String couponCode;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime orderDate;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    private LocalDateTime deliveredDate;
    
    public enum PaymentMethod {
        RAZORPAY,
        COD
    }
    
    public enum OrderStatus {
        PENDING,
        CONFIRMED,
        PROCESSING,
        SHIPPED,
        DELIVERED,
        CANCELLED,
        REFUNDED
    }
}
```

### 6. OrderItem.java

```java
package com.spicehouse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    @Column(nullable = false)
    private Integer quantity;
    
    private String size;
    
    private String color;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
}
```

### 7. Address.java

```java
package com.spicehouse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(nullable = false)
    private String fullName;
    
    @Column(nullable = false)
    private String mobile;
    
    private String email;
    
    @Column(nullable = false, length = 500)
    private String addressLine1;
    
    @Column(length = 500)
    private String addressLine2;
    
    @Column(nullable = false)
    private String city;
    
    @Column(nullable = false)
    private String state;
    
    @Column(nullable = false)
    private String zipCode;
    
    @Column(nullable = false)
    private String country;
    
    @Column(nullable = false)
    private Boolean isDefault = false;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
```

---

## Repository Layer

### 1. UserRepository.java

```java
package com.spicehouse.repository;

import com.spicehouse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByMobile(String mobile);
    Boolean existsByEmail(String email);
    Boolean existsByMobile(String mobile);
}
```

### 2. ProductRepository.java

```java
package com.spicehouse.repository;

import com.spicehouse.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryName(String categoryName);
    List<Product> findByInStockTrue();
    List<Product> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT p FROM Product p WHERE p.category.name = :categoryName AND p.inStock = true")
    List<Product> findAvailableProductsByCategory(@Param("categoryName") String categoryName);
    
    @Query("SELECT p FROM Product p WHERE p.inStock = true ORDER BY p.rating DESC")
    List<Product> findTopRatedProducts();
    
    @Query("SELECT p FROM Product p WHERE p.badge IS NOT NULL")
    List<Product> findFeaturedProducts();
}
```

### 3. CategoryRepository.java

```java
package com.spicehouse.repository;

import com.spicehouse.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
    Boolean existsByName(String name);
}
```

### 4. CartItemRepository.java

```java
package com.spicehouse.repository;

import com.spicehouse.entity.CartItem;
import com.spicehouse.entity.User;
import com.spicehouse.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    List<CartItem> findByUserId(Long userId);
    Optional<CartItem> findByUserAndProductAndSizeAndColor(User user, Product product, String size, String color);
    void deleteByUser(User user);
    void deleteByUserId(Long userId);
}
```

### 5. OrderRepository.java

```java
package com.spicehouse.repository;

import com.spicehouse.entity.Order;
import com.spicehouse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByUserId(Long userId);
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByStatus(Order.OrderStatus status);
    List<Order> findByUserOrderByOrderDateDesc(User user);
}
```

### 6. AddressRepository.java

```java
package com.spicehouse.repository;

import com.spicehouse.entity.Address;
import com.spicehouse.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUser(User user);
    List<Address> findByUserId(Long userId);
    Optional<Address> findByUserAndIsDefaultTrue(User user);
}
```

---

## DTO Classes

### Request DTOs

#### 1. LoginRequest.java

```java
package com.spicehouse.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
}
```

#### 2. RegisterRequest.java

```java
package com.spicehouse.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String fullName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String mobile;
}
```

#### 3. CartItemRequest.java

```java
package com.spicehouse.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CartItemRequest {
    @NotNull(message = "Product ID is required")
    private Long productId;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    
    private String size;
    private String color;
}
```

#### 4. OrderRequest.java

```java
package com.spicehouse.dto.request;

import com.spicehouse.entity.Order;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderRequest {
    @NotNull(message = "Payment method is required")
    private Order.PaymentMethod paymentMethod;
    
    @NotNull(message = "Shipping address is required")
    private AddressRequest shippingAddress;
    
    private String couponCode;
    private String notes;
    private BigDecimal discount;
}
```

#### 5. AddressRequest.java

```java
package com.spicehouse.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AddressRequest {
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @NotBlank(message = "Mobile number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits")
    private String mobile;
    
    private String email;
    
    @NotBlank(message = "Address line 1 is required")
    private String addressLine1;
    
    private String addressLine2;
    
    @NotBlank(message = "City is required")
    private String city;
    
    @NotBlank(message = "State is required")
    private String state;
    
    @NotBlank(message = "Zip code is required")
    private String zipCode;
    
    @NotBlank(message = "Country is required")
    private String country;
    
    private Boolean isDefault = false;
}
```

### Response DTOs

#### 1. AuthResponse.java

```java
package com.spicehouse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String fullName;
    private String email;
    private String role;
    
    public AuthResponse(String token, Long id, String fullName, String email, String role) {
        this.token = token;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }
}
```

#### 2. ProductResponse.java

```java
package com.spicehouse.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String image;
    private List<String> images;
    private Double rating;
    private Integer reviews;
    private String badge;
    private String category;
    private String description;
    private List<String> features;
    private List<String> sizes;
    private Boolean inStock;
    private Integer stockCount;
}
```

#### 3. OrderResponse.java

```java
package com.spicehouse.dto.response;

import com.spicehouse.entity.Order;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private List<OrderItemResponse> items;
    private AddressResponse shippingAddress;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal shipping;
    private BigDecimal total;
    private Order.PaymentMethod paymentMethod;
    private Order.OrderStatus status;
    private LocalDateTime orderDate;
    private LocalDateTime deliveredDate;
}
```

#### 4. OrderItemResponse.java

```java
package com.spicehouse.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private String size;
    private String color;
    private BigDecimal price;
    private BigDecimal subtotal;
}
```

#### 5. AddressResponse.java

```java
package com.spicehouse.dto.response;

import lombok.Data;

@Data
public class AddressResponse {
    private Long id;
    private String fullName;
    private String mobile;
    private String email;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private Boolean isDefault;
}
```

#### 6. CartItemResponse.java

```java
package com.spicehouse.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartItemResponse {
    private Long id;
    private Long productId;
    private String productName;
    private BigDecimal price;
    private String image;
    private Integer quantity;
    private String size;
    private String color;
    private BigDecimal subtotal;
}
```

#### 7. ApiResponse.java

```java
package com.spicehouse.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {
    private Boolean success;
    private String message;
    private Object data;
    
    public ApiResponse(Boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}
```

---

## Service Layer

### 1. JwtService.java

```java
package com.spicehouse.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;
    
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
    
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername());
    }
    
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
```

### 2. UserService.java

```java
package com.spicehouse.service;

import com.spicehouse.dto.request.RegisterRequest;
import com.spicehouse.entity.User;
import com.spicehouse.exception.BadRequestException;
import com.spicehouse.exception.ResourceNotFoundException;
import com.spicehouse.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>()
        );
    }
    
    @Transactional
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        
        if (request.getMobile() != null && userRepository.existsByMobile(request.getMobile())) {
            throw new BadRequestException("Mobile number already exists");
        }
        
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setMobile(request.getMobile());
        user.setRole(User.Role.CUSTOMER);
        user.setActive(true);
        
        return userRepository.save(user);
    }
    
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
```

### 3. ProductService.java

```java
package com.spicehouse.service;

import com.spicehouse.dto.response.ProductResponse;
import com.spicehouse.entity.Product;
import com.spicehouse.exception.ResourceNotFoundException;
import com.spicehouse.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return convertToResponse(product);
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByCategory(String categoryName) {
        return productRepository.findByCategoryName(categoryName).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponse> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCase(query).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findFeaturedProducts().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<ProductResponse> getAvailableProducts() {
        return productRepository.findByInStockTrue().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    private ProductResponse convertToResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setPrice(product.getPrice());
        response.setOriginalPrice(product.getOriginalPrice());
        response.setImage(product.getImage());
        response.setImages(product.getImages());
        response.setRating(product.getRating());
        response.setReviews(product.getReviews());
        response.setBadge(product.getBadge());
        response.setCategory(product.getCategory().getName());
        response.setDescription(product.getDescription());
        response.setFeatures(product.getFeatures());
        response.setSizes(product.getSizes());
        response.setInStock(product.getInStock());
        response.setStockCount(product.getStockCount());
        return response;
    }
}
```

### 4. CategoryService.java

```java
package com.spicehouse.service;

import com.spicehouse.entity.Category;
import com.spicehouse.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Category getCategoryByName(String name) {
        return categoryRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Category not found: " + name));
    }
}
```

### 5. CartService.java

```java
package com.spicehouse.service;

import com.spicehouse.dto.request.CartItemRequest;
import com.spicehouse.dto.response.CartItemResponse;
import com.spicehouse.entity.CartItem;
import com.spicehouse.entity.Product;
import com.spicehouse.entity.User;
import com.spicehouse.exception.BadRequestException;
import com.spicehouse.exception.ResourceNotFoundException;
import com.spicehouse.repository.CartItemRepository;
import com.spicehouse.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {
    
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    
    @Transactional
    public CartItemResponse addToCart(User user, CartItemRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        if (!product.getInStock()) {
            throw new BadRequestException("Product is out of stock");
        }
        
        if (product.getStockCount() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock available");
        }
        
        CartItem existingItem = cartItemRepository.findByUserAndProductAndSizeAndColor(
                user, product, request.getSize(), request.getColor()
        ).orElse(null);
        
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
            return convertToResponse(cartItemRepository.save(existingItem));
        }
        
        CartItem cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setProduct(product);
        cartItem.setQuantity(request.getQuantity());
        cartItem.setSize(request.getSize());
        cartItem.setColor(request.getColor());
        
        return convertToResponse(cartItemRepository.save(cartItem));
    }
    
    @Transactional(readOnly = true)
    public List<CartItemResponse> getCartItems(User user) {
        return cartItemRepository.findByUser(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CartItemResponse updateQuantity(User user, Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }
        
        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }
        
        if (cartItem.getProduct().getStockCount() < quantity) {
            throw new BadRequestException("Insufficient stock available");
        }
        
        cartItem.setQuantity(quantity);
        return convertToResponse(cartItemRepository.save(cartItem));
    }
    
    @Transactional
    public void removeFromCart(User user, Long cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to cart item");
        }
        
        cartItemRepository.delete(cartItem);
    }
    
    @Transactional
    public void clearCart(User user) {
        cartItemRepository.deleteByUser(user);
    }
    
    private CartItemResponse convertToResponse(CartItem cartItem) {
        CartItemResponse response = new CartItemResponse();
        response.setId(cartItem.getId());
        response.setProductId(cartItem.getProduct().getId());
        response.setProductName(cartItem.getProduct().getName());
        response.setPrice(cartItem.getProduct().getPrice());
        response.setImage(cartItem.getProduct().getImage());
        response.setQuantity(cartItem.getQuantity());
        response.setSize(cartItem.getSize());
        response.setColor(cartItem.getColor());
        response.setSubtotal(cartItem.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        return response;
    }
}
```

### 6. OrderService.java

```java
package com.spicehouse.service;

import com.spicehouse.dto.request.AddressRequest;
import com.spicehouse.dto.request.OrderRequest;
import com.spicehouse.dto.response.*;
import com.spicehouse.entity.*;
import com.spicehouse.exception.BadRequestException;
import com.spicehouse.exception.ResourceNotFoundException;
import com.spicehouse.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    
    @Transactional
    public OrderResponse createOrder(User user, OrderRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }
        
        Order order = new Order();
        order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setUser(user);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setCouponCode(request.getCouponCode());
        order.setNotes(request.getNotes());
        
        Address shippingAddress = convertToAddress(request.getShippingAddress());
        shippingAddress.setUser(user);
        order.setShippingAddress(shippingAddress);
        
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            
            if (!product.getInStock() || product.getStockCount() < cartItem.getQuantity()) {
                throw new BadRequestException("Product " + product.getName() + " is out of stock");
            }
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setSize(cartItem.getSize());
            orderItem.setColor(cartItem.getColor());
            orderItem.setPrice(product.getPrice());
            orderItem.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            
            orderItems.add(orderItem);
            subtotal = subtotal.add(orderItem.getSubtotal());
            
            product.setStockCount(product.getStockCount() - cartItem.getQuantity());
            productRepository.save(product);
        }
        
        order.setOrderItems(orderItems);
        order.setSubtotal(subtotal);
        
        BigDecimal discount = request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO;
        order.setDiscount(discount);
        
        BigDecimal shipping = subtotal.compareTo(BigDecimal.valueOf(25)) >= 0 ? 
                BigDecimal.ZERO : BigDecimal.valueOf(5.99);
        order.setShipping(shipping);
        
        BigDecimal total = subtotal.subtract(discount).add(shipping);
        order.setTotal(total);
        
        Order savedOrder = orderRepository.save(order);
        
        cartItemRepository.deleteByUser(user);
        
        return convertToResponse(savedOrder);
    }
    
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to order");
        }
        
        return convertToResponse(order);
    }
    
    @Transactional(readOnly = true)
    public OrderResponse getOrderByNumber(User user, String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (!order.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized access to order");
        }
        
        return convertToResponse(order);
    }
    
    @Transactional(readOnly = true)
    public List<OrderResponse> getUserOrders(User user) {
        return orderRepository.findByUserOrderByOrderDateDesc(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    private OrderResponse convertToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setSubtotal(order.getSubtotal());
        response.setDiscount(order.getDiscount());
        response.setShipping(order.getShipping());
        response.setTotal(order.getTotal());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setStatus(order.getStatus());
        response.setOrderDate(order.getOrderDate());
        response.setDeliveredDate(order.getDeliveredDate());
        
        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(this::convertToOrderItemResponse)
                .collect(Collectors.toList());
        response.setItems(itemResponses);
        
        response.setShippingAddress(convertToAddressResponse(order.getShippingAddress()));
        
        return response;
    }
    
    private OrderItemResponse convertToOrderItemResponse(OrderItem orderItem) {
        OrderItemResponse response = new OrderItemResponse();
        response.setId(orderItem.getId());
        response.setProductId(orderItem.getProduct().getId());
        response.setProductName(orderItem.getProduct().getName());
        response.setProductImage(orderItem.getProduct().getImage());
        response.setQuantity(orderItem.getQuantity());
        response.setSize(orderItem.getSize());
        response.setColor(orderItem.getColor());
        response.setPrice(orderItem.getPrice());
        response.setSubtotal(orderItem.getSubtotal());
        return response;
    }
    
    private Address convertToAddress(AddressRequest request) {
        Address address = new Address();
        address.setFullName(request.getFullName());
        address.setMobile(request.getMobile());
        address.setEmail(request.getEmail());
        address.setAddressLine1(request.getAddressLine1());
        address.setAddressLine2(request.getAddressLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setZipCode(request.getZipCode());
        address.setCountry(request.getCountry());
        address.setIsDefault(request.getIsDefault());
        return address;
    }
    
    private AddressResponse convertToAddressResponse(Address address) {
        AddressResponse response = new AddressResponse();
        response.setId(address.getId());
        response.setFullName(address.getFullName());
        response.setMobile(address.getMobile());
        response.setEmail(address.getEmail());
        response.setAddressLine1(address.getAddressLine1());
        response.setAddressLine2(address.getAddressLine2());
        response.setCity(address.getCity());
        response.setState(address.getState());
        response.setZipCode(address.getZipCode());
        response.setCountry(address.getCountry());
        response.setIsDefault(address.getIsDefault());
        return response;
    }
}
```

---

## Controller Layer

### 1. AuthController.java

```java
package com.spicehouse.controller;

import com.spicehouse.dto.request.LoginRequest;
import com.spicehouse.dto.request.RegisterRequest;
import com.spicehouse.dto.response.ApiResponse;
import com.spicehouse.dto.response.AuthResponse;
import com.spicehouse.entity.User;
import com.spicehouse.service.JwtService;
import com.spicehouse.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        User user = userService.registerUser(request);
        
        UserDetails userDetails = userService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);
        
        AuthResponse authResponse = new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name()
        );
        
        return ResponseEntity.ok(new ApiResponse(true, "User registered successfully", authResponse));
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);
        
        User user = userService.getUserByEmail(request.getEmail());
        
        AuthResponse authResponse = new AuthResponse(
                token,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().name()
        );
        
        return ResponseEntity.ok(new ApiResponse(true, "Login successful", authResponse));
    }
}
```

### 2. ProductController.java

```java
package com.spicehouse.controller;

import com.spicehouse.dto.response.ApiResponse;
import com.spicehouse.dto.response.ProductResponse;
import com.spicehouse.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {
    
    private final ProductService productService;
    
    @GetMapping
    public ResponseEntity<ApiResponse> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(new ApiResponse(true, "Products fetched successfully", products));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getProductById(@PathVariable Long id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Product fetched successfully", product));
    }
    
    @GetMapping("/category/{categoryName}")
    public ResponseEntity<ApiResponse> getProductsByCategory(@PathVariable String categoryName) {
        List<ProductResponse> products = productService.getProductsByCategory(categoryName);
        return ResponseEntity.ok(new ApiResponse(true, "Products fetched successfully", products));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchProducts(@RequestParam String query) {
        List<ProductResponse> products = productService.searchProducts(query);
        return ResponseEntity.ok(new ApiResponse(true, "Search results fetched successfully", products));
    }
    
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse> getFeaturedProducts() {
        List<ProductResponse> products = productService.getFeaturedProducts();
        return ResponseEntity.ok(new ApiResponse(true, "Featured products fetched successfully", products));
    }
}
```

### 3. CategoryController.java

```java
package com.spicehouse.controller;

import com.spicehouse.dto.response.ApiResponse;
import com.spicehouse.entity.Category;
import com.spicehouse.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @GetMapping
    public ResponseEntity<ApiResponse> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(new ApiResponse(true, "Categories fetched successfully", categories));
    }
}
```

### 4. CartController.java

```java
package com.spicehouse.controller;

import com.spicehouse.dto.request.CartItemRequest;
import com.spicehouse.dto.response.ApiResponse;
import com.spicehouse.dto.response.CartItemResponse;
import com.spicehouse.entity.User;
import com.spicehouse.service.CartService;
import com.spicehouse.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {
    
    private final CartService cartService;
    private final UserService userService;
    
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addToCart(
            Authentication authentication,
            @Valid @RequestBody CartItemRequest request) {
        User user = userService.getUserByEmail(authentication.getName());
        CartItemResponse cartItem = cartService.addToCart(user, request);
        return ResponseEntity.ok(new ApiResponse(true, "Item added to cart", cartItem));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse> getCartItems(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        List<CartItemResponse> cartItems = cartService.getCartItems(user);
        return ResponseEntity.ok(new ApiResponse(true, "Cart items fetched successfully", cartItems));
    }
    
    @PutMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse> updateQuantity(
            Authentication authentication,
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity) {
        User user = userService.getUserByEmail(authentication.getName());
        CartItemResponse cartItem = cartService.updateQuantity(user, cartItemId, quantity);
        return ResponseEntity.ok(new ApiResponse(true, "Cart updated successfully", cartItem));
    }
    
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse> removeFromCart(
            Authentication authentication,
            @PathVariable Long cartItemId) {
        User user = userService.getUserByEmail(authentication.getName());
        cartService.removeFromCart(user, cartItemId);
        return ResponseEntity.ok(new ApiResponse(true, "Item removed from cart", null));
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse> clearCart(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        cartService.clearCart(user);
        return ResponseEntity.ok(new ApiResponse(true, "Cart cleared successfully", null));
    }
}
```

### 5. OrderController.java

```java
package com.spicehouse.controller;

import com.spicehouse.dto.request.OrderRequest;
import com.spicehouse.dto.response.ApiResponse;
import com.spicehouse.dto.response.OrderResponse;
import com.spicehouse.entity.User;
import com.spicehouse.service.OrderService;
import com.spicehouse.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    
    private final OrderService orderService;
    private final UserService userService;
    
    @PostMapping
    public ResponseEntity<ApiResponse> createOrder(
            Authentication authentication,
            @Valid @RequestBody OrderRequest request) {
        User user = userService.getUserByEmail(authentication.getName());
        OrderResponse order = orderService.createOrder(user, request);
        return ResponseEntity.ok(new ApiResponse(true, "Order created successfully", order));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse> getUserOrders(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        List<OrderResponse> orders = orderService.getUserOrders(user);
        return ResponseEntity.ok(new ApiResponse(true, "Orders fetched successfully", orders));
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse> getOrderById(
            Authentication authentication,
            @PathVariable Long orderId) {
        User user = userService.getUserByEmail(authentication.getName());
        OrderResponse order = orderService.getOrderById(user, orderId);
        return ResponseEntity.ok(new ApiResponse(true, "Order fetched successfully", order));
    }
    
    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse> getOrderByNumber(
            Authentication authentication,
            @PathVariable String orderNumber) {
        User user = userService.getUserByEmail(authentication.getName());
        OrderResponse order = orderService.getOrderByNumber(user, orderNumber);
        return ResponseEntity.ok(new ApiResponse(true, "Order fetched successfully", order));
    }
}
```

### 6. UserController.java

```java
package com.spicehouse.controller;

import com.spicehouse.dto.response.ApiResponse;
import com.spicehouse.entity.User;
import com.spicehouse.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getCurrentUser(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(new ApiResponse(true, "User fetched successfully", user));
    }
}
```

---

## Security Configuration

### 1. SecurityConfig.java

```java
package com.spicehouse.config;

import com.spicehouse.service.JwtService;
import com.spicehouse.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserService userService;
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configure(http))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/products/**").permitAll()
                        .requestMatchers("/api/categories/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

@Component
@RequiredArgsConstructor
class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtService jwtService;
    private final UserService userService;
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        jwt = authHeader.substring(7);
        userEmail = jwtService.extractUsername(jwt);
        
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userService.loadUserByUsername(userEmail);
            
            if (jwtService.validateToken(jwt, userDetails)) {
                org.springframework.security.authentication.UsernamePasswordAuthenticationToken authToken =
                        new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

### 2. CorsConfig.java

```java
package com.spicehouse.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {
    
    @Value("${cors.allowed.origins}")
    private String allowedOrigins;
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

---

## Exception Handling

### 1. ResourceNotFoundException.java

```java
package com.spicehouse.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

### 2. BadRequestException.java

```java
package com.spicehouse.exception;

public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
```

### 3. GlobalExceptionHandler.java

```java
package com.spicehouse.exception;

import com.spicehouse.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse(false, ex.getMessage()));
    }
    
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse> handleBadRequest(BadRequestException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, ex.getMessage()));
    }
    
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(false, "Invalid email or password"));
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(false, "Validation failed", errors));
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGlobalException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse(false, "An error occurred: " + ex.getMessage()));
    }
}
```

---

## Main Application Class

### SpiceHouseApplication.java

```java
package com.spicehouse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpiceHouseApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpiceHouseApplication.class, args);
    }
}
```

---

## Database Schema

The database schema will be automatically created by Hibernate based on the entity classes. Here's what will be created:

### Tables:
1. **users** - User accounts
2. **products** - Product catalog
3. **categories** - Product categories
4. **cart_items** - Shopping cart items
5. **orders** - Customer orders
6. **order_items** - Items in each order
7. **addresses** - Shipping/billing addresses
8. **product_images** - Multiple images per product
9. **product_features** - Product features list
10. **product_sizes** - Available sizes

---

## API Documentation

### Authentication Endpoints

#### Register
- **POST** `/api/auth/register`
- Body: `{ "fullName": "string", "email": "string", "password": "string", "mobile": "string" }`
- Response: `{ "success": true, "message": "User registered successfully", "data": {...} }`

#### Login
- **POST** `/api/auth/login`
- Body: `{ "email": "string", "password": "string" }`
- Response: `{ "success": true, "message": "Login successful", "data": { "token": "...", ... } }`

### Product Endpoints

#### Get All Products
- **GET** `/api/products`
- Response: List of all products

#### Get Product by ID
- **GET** `/api/products/{id}`
- Response: Single product details

#### Get Products by Category
- **GET** `/api/products/category/{categoryName}`
- Response: List of products in category

#### Search Products
- **GET** `/api/products/search?query={searchTerm}`
- Response: List of matching products

### Cart Endpoints (Protected)

#### Add to Cart
- **POST** `/api/cart/add`
- Headers: `Authorization: Bearer {token}`
- Body: `{ "productId": 1, "quantity": 2, "size": "100g" }`

#### Get Cart Items
- **GET** `/api/cart`
- Headers: `Authorization: Bearer {token}`

#### Update Cart Item
- **PUT** `/api/cart/{cartItemId}?quantity={newQuantity}`
- Headers: `Authorization: Bearer {token}`

#### Remove from Cart
- **DELETE** `/api/cart/{cartItemId}`
- Headers: `Authorization: Bearer {token}`

### Order Endpoints (Protected)

#### Create Order
- **POST** `/api/orders`
- Headers: `Authorization: Bearer {token}`
- Body: Order request with shipping address and payment method

#### Get User Orders
- **GET** `/api/orders`
- Headers: `Authorization: Bearer {token}`

#### Get Order by ID
- **GET** `/api/orders/{orderId}`
- Headers: `Authorization: Bearer {token}`

---

## Setup Instructions

1. **Install MySQL** and create database
2. **Update** `application.properties` with your MySQL credentials
3. **Run** `mvn clean install` to build the project
4. **Run** `mvn spring-boot:run` to start the application
5. **Test** endpoints using Postman or your React frontend

The backend will be available at `http://localhost:8080`

---

## Notes

- All endpoints return standardized `ApiResponse` format
- JWT token expires after 24 hours (configurable)
- Cart operations require authentication
- Order creation automatically updates stock counts and clears cart
- Shipping is free for orders over $25
- All prices use BigDecimal for precision
