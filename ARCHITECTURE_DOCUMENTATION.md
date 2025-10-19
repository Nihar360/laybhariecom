# 🏗️ Spice House E-Commerce - Architecture Documentation

## Overview
**Project Name:** Spice House E-Commerce Platform  
**Purpose:** Production-ready e-commerce platform for Malvani spice products  
**Architecture:** Full-stack web application with RESTful API

---

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER / CLIENT                            │
│                     (Web Browser / Mobile)                       │
└────────────┬────────────────────────────────────────────────────┘
             │ HTTPS
             │ Port 5000
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React 18.3 + TypeScript + Vite                          │   │
│  │  - Client-side navigation (NavigationContext)            │   │
│  │  - State management (React Context API)                  │   │
│  │  - UI Components (shadcn/ui + Radix UI)                  │   │
│  │  - Responsive design (Tailwind CSS)                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────┬────────────────────────────────────────────────────┘
             │ REST API
             │ HTTP/HTTPS
             │ Port 8080
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND LAYER (API)                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Spring Boot 3.2.0 + Java 19                             │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Controllers (REST Endpoints)                      │  │   │
│  │  │  - AuthController                                  │  │   │
│  │  │  - ProductController                               │  │   │
│  │  │  - CategoryController                              │  │   │
│  │  │  - CartController                                  │  │   │
│  │  │  - OrderController                                 │  │   │
│  │  │  - UserController                                  │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Security Layer                                    │  │   │
│  │  │  - JWT Authentication & Authorization              │  │   │
│  │  │  - Role-based Access Control (CUSTOMER, ADMIN)     │  │   │
│  │  │  - Spring Security Configuration                   │  │   │
│  │  │  - CORS Configuration                              │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Service Layer (Business Logic)                    │  │   │
│  │  │  - UserService, ProductService, etc.               │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  Repository Layer (Data Access)                    │  │   │
│  │  │  - JPA Repositories                                │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────┬────────────────────────────────────────────────────┘
             │ JDBC
             │ MySQL Protocol
             │ Port 3306
             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MariaDB 10.11 (MySQL-compatible)                        │   │
│  │  Database: ecommerce_db                                  │   │
│  │  Tables:                                                 │   │
│  │    - users (authentication, profile)                     │   │
│  │    - addresses (shipping addresses)                      │   │
│  │    - categories (product categories)                     │   │
│  │    - products (product catalog)                          │   │
│  │    - product_images, product_features, product_sizes     │   │
│  │    - cart_items (shopping cart)                          │   │
│  │    - orders (order management)                           │   │
│  │    - order_items (order line items)                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Folder Structure

### **Root Directory**
```
spice-house-ecommerce/
├── src/                          # Frontend source code (React)
├── backend/                      # Backend source code (Spring Boot)
├── mysql/                        # MySQL data directory
├── attached_assets/              # Static assets
├── target/                       # Backend build artifacts
├── package.json                  # Frontend dependencies
├── pom.xml                       # Backend dependencies
├── vite.config.ts               # Frontend build configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── start_mysql.sh               # MySQL startup script
├── start_backend.sh             # Backend startup script
├── replit.md                    # Project documentation
└── README.md                    # Project README
```

### **Frontend Structure (`src/`)**
```
src/
├── components/               # React components
│   ├── ui/                  # Reusable UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   └── ... (30+ UI components)
│   ├── figma/              # Figma-specific components
│   │   └── ImageWithFallback.tsx
│   ├── Header.tsx          # Main navigation header
│   ├── Hero.tsx            # Hero section
│   ├── Categories.tsx      # Category grid
│   ├── FeaturedProducts.tsx  # Product grid
│   ├── ProductCard.tsx     # Individual product card
│   ├── CartDrawer.tsx      # Shopping cart sidebar
│   ├── Newsletter.tsx      # Newsletter signup
│   └── Footer.tsx          # Footer
├── pages/                  # Page components
│   ├── CategoryPage.tsx    # Category product listing
│   ├── ProductDetailsPage.tsx  # Product details
│   ├── CheckoutPage.tsx    # Checkout flow
│   └── OrderSuccessPage.tsx  # Order confirmation
├── contexts/               # React Context providers
│   ├── CartContext.tsx     # Shopping cart state
│   └── NavigationContext.tsx  # Client-side routing
├── data/                   # Static data (TO BE REMOVED)
│   └── products.ts         # Demo data (will be replaced with API calls)
├── styles/                 # Global styles
│   └── globals.css
├── App.tsx                 # Main app component
├── main.tsx                # App entry point
└── index.css               # Base styles
```

### **Backend Structure (`backend/demo/src/main/java/com/laybhariecom/demo/`)**
```
backend/demo/src/main/java/com/laybhariecom/demo/
├── config/                 # Configuration classes
│   ├── SecurityConfig.java         # Spring Security config
│   ├── JwtAuthenticationFilter.java  # JWT filter
│   ├── CorsConfig.java             # CORS configuration
│   └── WebConfig.java              # Web MVC config
├── controller/             # REST API Controllers
│   ├── AuthController.java         # /api/auth/** endpoints
│   ├── ProductController.java      # /api/products/** endpoints
│   ├── CategoryController.java     # /api/categories/** endpoints
│   ├── CartController.java         # /api/cart/** endpoints
│   ├── OrderController.java        # /api/orders/** endpoints
│   └── UserController.java         # /api/users/** endpoints
├── service/                # Business logic layer
│   ├── UserService.java
│   ├── ProductService.java
│   ├── CategoryService.java
│   ├── CartService.java
│   ├── OrderService.java
│   └── JwtService.java
├── repository/             # JPA Data repositories
│   ├── UserRepository.java
│   ├── ProductRepository.java
│   ├── CategoryRepository.java
│   ├── CartItemRepository.java
│   ├── OrderRepository.java
│   └── OrderItemRepository.java
├── model/                  # JPA Entity models
│   ├── User.java           # User entity
│   ├── Address.java        # Address entity
│   ├── Category.java       # Category entity
│   ├── Product.java        # Product entity
│   ├── CartItem.java       # Cart item entity
│   ├── Order.java          # Order entity
│   └── OrderItem.java      # Order item entity
├── dto/                    # Data Transfer Objects
│   ├── request/            # Request DTOs
│   │   ├── RegisterRequest.java
│   │   ├── LoginRequest.java
│   │   ├── CartItemRequest.java
│   │   └── OrderRequest.java
│   └── response/           # Response DTOs
│       ├── AuthResponse.java
│       ├── ProductResponse.java
│       ├── CartItemResponse.java
│       └── OrderResponse.java
├── exception/              # Custom exceptions
│   ├── ResourceNotFoundException.java
│   ├── BadRequestException.java
│   └── GlobalExceptionHandler.java
└── DemoApplication.java    # Spring Boot main class

backend/demo/src/main/resources/
└── application.properties  # Application configuration
```

---

## 🔄 Data Flow Architecture

### **1. User Authentication Flow**
```
User → Frontend (Login Form)
  → POST /api/auth/login
    → AuthController → UserService
      → UserRepository → Database
        ← User Data
      ← JWT Token Generated
    ← AuthResponse (JWT + User Info)
  ← Store JWT in localStorage
← User logged in, token used for subsequent requests
```

### **2. Product Display Flow**
```
User → Frontend (Home Page)
  → GET /api/products
    → ProductController → ProductService
      → ProductRepository → Database
        ← Product List
      ← ProductResponse List
    ← JSON Response
  ← Products rendered in UI
```

### **3. Add to Cart Flow**
```
User → Frontend (Product Page - Add to Cart)
  → POST /api/cart/add (with JWT header)
    → JwtAuthenticationFilter (validates token)
      → CartController → CartService
        → CartItemRepository → Database
          ← Cart Item Created
        ← CartItemResponse
      ← JSON Response
    ← Cart updated
  ← UI updated with new cart count
```

### **4. Checkout Flow**
```
User → Frontend (Checkout Page)
  → POST /api/orders (with order details + JWT)
    → JwtAuthenticationFilter
      → OrderController → OrderService
        → Creates Order
        → Creates OrderItems
        → Clears Cart
        → OrderRepository → Database
          ← Order Saved
        ← OrderResponse
      ← JSON Response
    ← Redirect to Success Page
  ← Order confirmation displayed
```

---

## 🔒 Security Architecture

### **Authentication & Authorization**
- **Method:** JWT (JSON Web Tokens)
- **Token Storage:** localStorage (Frontend)
- **Token Transmission:** Authorization header (`Bearer <token>`)
- **Roles:** CUSTOMER, ADMIN
- **Password Security:** BCrypt hashing

### **Endpoint Security**
| Endpoint Pattern | Access |
|-----------------|--------|
| `/api/auth/**` | Public |
| `/api/products` (GET) | Public |
| `/api/categories` (GET) | Public |
| `/api/cart/**` | Authenticated Users |
| `/api/orders/**` | Authenticated Users |
| `/api/users/me` | Authenticated Users |

### **CORS Configuration**
```java
Allowed Origins: http://localhost:5000, http://localhost:3000
Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
Allowed Headers: Authorization, Content-Type
Credentials: true
```

---

## 🌐 Cloud-Native Architecture

### **Deployment Strategy**
The application is designed to be cloud-native and can be deployed on:

**Option 1: AWS (Recommended for Production)**
```
┌─────────────────────────────────────────────┐
│  CloudFront (CDN) + S3 (Static Frontend)    │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│  Application Load Balancer                  │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│  EC2 / ECS (Spring Boot Backend)            │
│  - Auto Scaling Group                       │
│  - Environment Variables for secrets        │
└────────────────┬────────────────────────────┘
                 │
┌────────────────▼────────────────────────────┐
│  RDS MySQL (Managed Database)               │
│  - Multi-AZ for high availability           │
│  - Automated backups                        │
└─────────────────────────────────────────────┘
```

**Option 2: Render (Simplest for MVP)**
```
Frontend: Static Site (Vite build)
Backend: Web Service (Docker container)
Database: PostgreSQL or External MySQL
```

**Option 3: Vercel + Railway**
```
Frontend: Vercel (automatic deployments from Git)
Backend: Railway (Spring Boot deployment)
Database: Railway PostgreSQL/MySQL
```

### **Environment Configuration**
The application uses environment variables for cloud deployment:
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`

---

## 📊 Database Schema

### **Entity Relationship Diagram (ERD)**
```
┌─────────────┐
│    USER     │
│─────────────│
│ id (PK)     │──┐
│ fullName    │  │
│ email       │  │
│ password    │  │
│ mobile      │  │
│ role        │  │
│ active      │  │
└─────────────┘  │
                 │
       ┌─────────┴─────────┬─────────────┬─────────────┐
       │                   │             │             │
       ▼                   ▼             ▼             ▼
┌─────────────┐     ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   ADDRESS   │     │  CART_ITEM  │ │    ORDER    │ │  (other)    │
│─────────────│     │─────────────│ │─────────────│ │             │
│ id (PK)     │     │ id (PK)     │ │ id (PK)     │ │             │
│ user_id(FK) │     │ user_id(FK) │ │ user_id(FK) │ │             │
│ fullName    │     │ product_id  │ │orderNumber  │ │             │
│ mobile      │     │ quantity    │ │ status      │ │             │
│ address     │     │ size        │ │ total       │ │             │
│ city, state │     │ color       │ │ payment     │ │             │
│ zipCode     │     └─────────────┘ └──┬──────────┘ │             │
│ country     │                        │            │             │
│ isDefault   │                        │            │             │
└─────────────┘                        ▼            │             │
                                ┌─────────────┐    │             │
┌─────────────┐                 │ ORDER_ITEM  │    │             │
│  CATEGORY   │                 │─────────────│    │             │
│─────────────│                 │ id (PK)     │    │             │
│ id (PK)     │──┐              │ order_id(FK)│    │             │
│ name        │  │              │ product_id  │    │             │
│ image       │  │              │ quantity    │    │             │
│ itemCount   │  │              │ price       │    │             │
│ description │  │              │ subtotal    │    │             │
└─────────────┘  │              └─────────────┘    │             │
                 │                                 │             │
                 ▼                                 │             │
          ┌─────────────┐                          │             │
          │   PRODUCT   │◄─────────────────────────┘             │
          │─────────────│                                        │
          │ id (PK)     │                                        │
          │ category_id │                                        │
          │ name        │                                        │
          │ price       │                                        │
          │ originalPrice│                                       │
          │ image       │                                        │
          │ rating      │                                        │
          │ reviews     │                                        │
          │ badge       │                                        │
          │ description │                                        │
          │ inStock     │                                        │
          │ stockCount  │                                        │
          └─────┬───────┘
                │
     ┌──────────┴──────────┬──────────────┐
     │                     │              │
     ▼                     ▼              ▼
┌───────────────┐  ┌───────────────┐ ┌───────────────┐
│PRODUCT_IMAGES │  │PRODUCT_FEATURES│ │PRODUCT_SIZES  │
│───────────────│  │───────────────│ │───────────────│
│product_id(FK) │  │product_id(FK) │ │product_id(FK) │
│ image_url     │  │ feature       │ │ size          │
└───────────────┘  └───────────────┘ └───────────────┘
```

### **Key Relationships**
- **User → Address:** One-to-Many (one user can have multiple addresses)
- **User → CartItem:** One-to-Many (one user has multiple cart items)
- **User → Order:** One-to-Many (one user can place multiple orders)
- **Category → Product:** One-to-Many (one category contains multiple products)
- **Product → CartItem:** One-to-Many (one product can be in multiple carts)
- **Product → OrderItem:** One-to-Many (one product can be in multiple orders)
- **Order → OrderItem:** One-to-Many (one order contains multiple items)
- **Product → Images/Features/Sizes:** One-to-Many (collection tables)

---

## 🚀 Technology Stack Summary

### **Frontend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.9.3 | Type Safety |
| Vite | 6.3.5 | Build Tool & Dev Server |
| Tailwind CSS | 4.1.14 | Styling |
| Radix UI | Latest | Accessible Components |
| shadcn/ui | Latest | Pre-built Components |
| Framer Motion | 12.23.24 | Animations |
| Lucide React | Latest | Icons |

### **Backend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| Spring Boot | 3.2.0 | Backend Framework |
| Java | 19 | Programming Language |
| Spring Security | 6.1.1 | Authentication & Authorization |
| Spring Data JPA | 3.2.0 | ORM & Database Access |
| JWT | Latest | Token-based Auth |
| Hibernate | 6.3.1 | JPA Implementation |
| Lombok | Latest | Boilerplate Reduction |

### **Database**
| Technology | Version | Purpose |
|-----------|---------|---------|
| MariaDB | 10.11.13 | Relational Database |
| MySQL Connector | Latest | JDBC Driver |

---

## 📈 Scalability Considerations

### **Horizontal Scaling**
- Stateless backend (JWT-based, no sessions)
- Can deploy multiple backend instances behind load balancer
- Database can be scaled with read replicas

### **Caching Strategy** (Future Enhancement)
- Redis for session/cart data
- CDN for static assets
- Database query caching

### **Microservices Migration Path** (Future)
```
Monolith → Service Separation:
1. Auth Service (User management)
2. Product Service (Catalog management)
3. Order Service (Order processing)
4. Payment Service (Payment gateway)
5. Notification Service (Emails, SMS)
```

---

## 🔧 Development vs Production

### **Development Environment**
- Frontend: Vite Dev Server (HMR enabled)
- Backend: Spring Boot Dev Tools (hot reload)
- Database: Local MariaDB instance
- CORS: Permissive (localhost origins)

### **Production Environment**
- Frontend: Static build served via CDN/S3
- Backend: JAR deployment on cloud (EC2/ECS/Railway)
- Database: Managed database (RDS/PlanetScale)
- CORS: Restricted to production domains
- Environment Variables: Secrets management via cloud provider
- HTTPS: Required for all communications
- Monitoring: Application Performance Monitoring (APM)
- Logging: Centralized logging (CloudWatch/DataDog)

---

## ✅ Production Readiness Checklist

- [ ] Environment variables properly configured
- [ ] Database migrations managed (Flyway/Liquibase)
- [ ] API rate limiting implemented
- [ ] Error logging and monitoring setup
- [ ] HTTPS certificates configured
- [ ] CORS properly restricted
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using JPA/PreparedStatements)
- [ ] XSS protection
- [ ] CSRF protection for state-changing operations
- [ ] Database backups automated
- [ ] Health check endpoints implemented
- [ ] Performance testing completed
- [ ] Load testing completed
- [ ] Documentation updated

---

**Last Updated:** October 19, 2025  
**Version:** 1.0.0  
**Status:** Development → Production Transition
