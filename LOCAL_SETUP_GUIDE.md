# Spice House E-Commerce - Complete Local Development Setup Guide

This comprehensive guide will help you set up and run the complete Spice House e-commerce application on your local VS Code environment, including all features: registration, login, add to cart, checkout, and order management.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)
7. [Testing All Features](#testing-all-features)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

Install the following on your machine:

1. **Java Development Kit (JDK) 17+**
   - Download: https://adoptium.net/
   - Verify: `java --version`

2. **Maven 3.6+**
   - Download: https://maven.apache.org/download.cgi
   - Verify: `mvn --version`

3. **MySQL 8.0+**
   - Download: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP/MAMP (includes MySQL)
   - Verify: `mysql --version`

4. **Node.js 18+**
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

5. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

### Recommended VS Code Extensions

- Extension Pack for Java
- Spring Boot Extension Pack
- MySQL (by Weijan Chen)
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense

---

## Quick Start

For experienced developers, here's the quick setup:

```bash
# 1. Setup MySQL database
./setup-mysql-local.sh     # Mac/Linux
setup-mysql-local.bat      # Windows

# 2. Build backend
mvn clean install

# 3. Install frontend dependencies
npm install  # or: pnpm install

# 4. Run backend (Terminal 1)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 5. Run frontend (Terminal 2)
npm run dev

# 6. Open browser
# http://localhost:5000
```

---

## Database Setup

### Step 1: Start MySQL Service

**Windows:**
```bash
net start MySQL80
```

**macOS:**
```bash
brew services start mysql
# OR
mysql.server start
```

**Linux:**
```bash
sudo systemctl start mysql
# OR
sudo service mysql start
```

### Step 2: Automated Setup (Recommended)

We provide setup scripts that automatically create the database, user, and load sample data.

**Windows:**
```bash
setup-mysql-local.bat
```

**macOS/Linux:**
```bash
chmod +x setup-mysql-local.sh
./setup-mysql-local.sh
```

Enter your MySQL root password when prompted. The script will:
- Create database: `ecommerce_db`
- Create user: `ecommerce_user` with password: `ecommerce_pass_123`
- Grant all privileges
- Load sample product data from `database_seed_real_data.sql`

### Step 3: Manual Setup (Alternative)

If you prefer manual setup:

```bash
# Login to MySQL
mysql -u root -p

# Run these commands
CREATE DATABASE ecommerce_db;
CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'ecommerce_pass_123';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Load sample data
mysql -u ecommerce_user -pecommerce_pass_123 ecommerce_db < database_seed_real_data.sql
```

### Step 4: Verify Database

```bash
mysql -u ecommerce_user -pecommerce_pass_123 ecommerce_db -e "SHOW TABLES;"
```

Expected tables: `categories`, `products`, `users`, `orders`, `cart_items`, `addresses`, etc.

---

## Backend Setup

### Step 1: Configure Application Properties

The application is pre-configured for local development. Check `src/main/resources/application-dev.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=ecommerce_user
spring.datasource.password=ecommerce_pass_123

# CORS Configuration
cors.allowed.origins=http://localhost:5000,http://localhost:3000,http://127.0.0.1:5000

# JWT Configuration
jwt.secret=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
jwt.expiration=86400000
```

**Note:** These are development credentials. Change them for production!

### Step 2: Build the Backend

```bash
# Clean previous builds and install dependencies
mvn clean install
```

This will:
- Download all Maven dependencies
- Compile Java source code
- Run unit tests
- Package the application as JAR file in `target/` directory

### Step 3: Verify Build

Check that `target/spice-house-backend-1.0.0.jar` was created successfully.

---

## Frontend Setup

### Step 1: Install Dependencies

```bash
# Using npm
npm install

# OR using pnpm (faster, recommended)
npm install -g pnpm
pnpm install
```

### Step 2: Environment Configuration

A `.env.local` file has been created with default settings. For standard local development, no changes are needed.

To customize (optional), edit `.env.local`:

```env
# API Base URL (default: http://localhost:8080)
# VITE_API_URL=http://localhost:8080

# Port for Vite dev server (default: 5000)
VITE_PORT=5000
```

### Step 3: Verify Vite Configuration

The `vite.config.ts` has been optimized for local development:
- Runs on `localhost` (not 0.0.0.0) for local development
- Hot Module Replacement (HMR) enabled
- API proxy configured to forward `/api` requests to `localhost:8080`

---

## Running the Application

### Method 1: Using Maven (Recommended for Development)

**Terminal 1 - Backend:**
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Method 2: Using Pre-built JAR

**Terminal 1 - Backend:**
```bash
java -jar target/spice-house-backend-1.0.0.jar --spring.profiles.active=dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Verification

- **Frontend:** http://localhost:5000
- **Backend API:** http://localhost:8080/api/products
- **Backend Health:** http://localhost:8080/actuator/health (if actuator is enabled)

You should see the Spice House homepage with products and categories!

---

## Testing All Features

### 1. User Registration

**Via Web Interface:**
1. Open http://localhost:5000
2. Click "Sign Up" or navigate to http://localhost:5000/register
3. Fill the form:
   - **Name:** John Doe
   - **Email:** john@example.com
   - **Password:** Password123!
   - **Confirm Password:** Password123!
4. Click "Register"
5. You should be redirected to login page

**Via API (cURL):**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

### 2. User Login

**Via Web Interface:**
1. Go to http://localhost:5000/login
2. Enter:
   - **Email:** john@example.com
   - **Password:** Password123!
3. Click "Login"
4. You should see your name in the header (logged in state)

**Via API (cURL):**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Save this token for authenticated requests!**

### 3. Browse Products

1. Visit http://localhost:5000
2. Explore categories: **Masalas**, **Mixes**
3. Click on a category to filter products
4. Click on any product to view details
5. See product images, price, description, features, available sizes

### 4. Add to Cart

**Via Web Interface:**
1. **Login first** (required for cart functionality)
2. Navigate to any product page
3. Select:
   - **Size:** e.g., 100g, 250g, or 500g
   - **Quantity:** 1, 2, 3, etc.
4. Click "Add to Cart"
5. You should see a success notification
6. Cart icon in header shows item count

**Via API:**
```bash
curl -X POST http://localhost:8080/api/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "productId": 1,
    "quantity": 2,
    "size": "250g"
  }'
```

### 5. View Cart

**Via Web Interface:**
1. Click the **cart icon** in the header
2. View all cart items:
   - Product name, image
   - Size and quantity
   - Price per item
   - Subtotal
3. Update quantity using +/- buttons
4. Remove items with trash icon
5. See total price at bottom

**Via API:**
```bash
curl http://localhost:8080/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Checkout Process

1. In cart view, click "Proceed to Checkout"
2. **Shipping Address:**
   - Enter or select delivery address
   - Add new address if needed
3. **Payment Method:**
   - Select COD (Cash on Delivery) or other methods
4. **Review Order:**
   - Verify items, quantities, total
   - Check delivery address
5. Click "Place Order"
6. Order confirmation page appears with order number

### 7. View Order History

**Via Web Interface:**
1. Click on your profile/account menu
2. Select "My Orders" or navigate to http://localhost:5000/orders
3. See list of all orders:
   - Order ID and date
   - Items ordered
   - Total amount
   - Order status (Pending, Processing, Shipped, Delivered)

**Via API:**
```bash
curl http://localhost:8080/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 8. Search Products

1. Use the search bar in header
2. Type product name or keyword (e.g., "masala", "mix")
3. Press Enter or click search
4. See filtered results

### 9. Filter by Category

1. Click on category name in navigation or homepage
2. Products from that category are displayed
3. Use "All Products" to clear filter

### 10. User Profile

1. Click on user icon/name in header
2. View profile information
3. Update profile details
4. Manage addresses
5. Change password

---

## Troubleshooting

### Backend Issues

#### Issue: "Could not connect to database"
**Solutions:**
1. Verify MySQL is running:
   ```bash
   # Windows
   net start MySQL80
   
   # Mac
   mysql.server status
   
   # Linux
   sudo systemctl status mysql
   ```
2. Test database connection:
   ```bash
   mysql -u ecommerce_user -pecommerce_pass_123 ecommerce_db -e "SELECT 1;"
   ```
3. Check credentials in `application-dev.properties`

#### Issue: "Port 8080 already in use"
**Solutions:**
1. Find and kill the process:
   ```bash
   # Mac/Linux
   lsof -ti:8080 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :8080
   taskkill /PID <PID> /F
   ```
2. Or change the port in `application-dev.properties`:
   ```properties
   server.port=8081
   ```

#### Issue: Maven build fails
**Solutions:**
1. Clean and rebuild:
   ```bash
   mvn clean
   rm -rf target/
   mvn clean install
   ```
2. Check Java version: `java --version` (must be 17+)
3. Update Maven: `mvn --version`

### Frontend Issues

#### Issue: "Cannot connect to backend" / Network Error
**Solutions:**
1. Verify backend is running:
   ```bash
   curl http://localhost:8080/api/products
   ```
2. Check browser console for CORS errors
3. Clear browser cache and localStorage
4. Verify `vite.config.ts` proxy configuration

#### Issue: "Port 5000 already in use"
**Solutions:**
1. Kill the process:
   ```bash
   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```
2. Or change port in `.env.local`:
   ```env
   VITE_PORT=3000
   ```

#### Issue: npm install fails or takes forever
**Solutions:**
1. Use pnpm (faster):
   ```bash
   npm install -g pnpm
   pnpm install
   ```
2. Clear npm cache:
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

### Authentication Issues

#### Issue: Login returns 403 or Unauthorized
**Solutions:**
1. Verify JWT secret is set in `application-dev.properties`
2. Clear browser localStorage:
   ```javascript
   // In browser console
   localStorage.clear()
   ```
3. Check backend logs for authentication errors

#### Issue: Token expired or invalid
**Solution:** Login again to get a new token

### Database Issues

#### Issue: No products showing
**Solutions:**
1. Verify data is loaded:
   ```bash
   mysql -u ecommerce_user -pecommerce_pass_123 ecommerce_db -e "SELECT COUNT(*) FROM products;"
   ```
2. If count is 0, reload seed data:
   ```bash
   mysql -u ecommerce_user -pecommerce_pass_123 ecommerce_db < database_seed_real_data.sql
   ```

#### Issue: "Table doesn't exist" errors
**Solutions:**
1. Let Spring Boot auto-create tables (it will on first run)
2. Or manually run seed script which includes table creation
3. Check `spring.jpa.hibernate.ddl-auto=update` in properties

---

## Configuration Summary

### Database
- **Host:** localhost
- **Port:** 3306
- **Database:** ecommerce_db
- **Username:** ecommerce_user
- **Password:** ecommerce_pass_123

### Application Ports
- **Frontend:** http://localhost:5000
- **Backend:** http://localhost:8080
- **MySQL:** localhost:3306

### Default Test User
After registration, you'll have your own user. Or create one:
- **Email:** test@example.com
- **Password:** Test123!

---

## Development Tools

### Postman Collection
Import `Spice_House_API_Postman_Collection.json` into Postman to test all API endpoints.

### Database GUI Tools
- MySQL Workbench (official)
- DBeaver (free, multi-platform)
- phpMyAdmin (web-based)
- TablePlus (Mac/Windows)

### Hot Reload
Both frontend and backend support hot reload:
- **Frontend:** Vite HMR - changes reflect instantly
- **Backend:** Spring Boot DevTools - auto-restart on code changes

---

## Project Structure

```
spice-house/
├── src/                          # Backend Java source
│   ├── main/
│   │   ├── java/com/laybhariecom/demo/
│   │   │   ├── config/          # Security, CORS, etc.
│   │   │   ├── controller/      # REST API endpoints
│   │   │   ├── model/           # JPA entities
│   │   │   ├── repository/      # Database repositories
│   │   │   ├── dto/             # Data transfer objects
│   │   │   └── exception/       # Custom exceptions
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       └── application-replit.properties
├── src/ (frontend)               # React TypeScript source
│   ├── components/              # React components
│   ├── pages/                   # Page components
│   ├── contexts/                # React contexts
│   ├── api/                     # API client
│   └── assets/                  # Images, styles
├── database_seed_real_data.sql  # Sample data
├── pom.xml                      # Maven configuration
├── package.json                 # Node dependencies
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS config
├── setup-mysql-local.sh         # MySQL setup (Mac/Linux)
├── setup-mysql-local.bat        # MySQL setup (Windows)
└── LOCAL_SETUP_GUIDE.md         # This file
```

---

## Additional Tips

1. **Always run with `dev` profile locally:**
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=dev
   ```

2. **Check backend logs for detailed error messages** - DEBUG level is enabled

3. **Use browser DevTools Network tab** to inspect API calls

4. **Verify environment:**
   ```bash
   java --version   # 17+
   node --version   # 18+
   mvn --version    # 3.6+
   mysql --version  # 8.0+
   ```

5. **Database too slow?** Increase MySQL buffer pool size in my.cnf

---

## Need Help?

If you're still stuck after trying troubleshooting steps:

1. **Check logs:** Backend console + Browser console
2. **Verify services:** MySQL + Backend + Frontend all running
3. **Test connectivity:** Can backend reach database? Can frontend reach backend?
4. **Check firewall:** Ensure ports 3306, 5000, 8080 are not blocked

---

**Happy Coding! 🎉**

Your Spice House e-commerce application is now ready for local development with full registration, login, cart, checkout, and order management functionality!
