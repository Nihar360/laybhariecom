# 🚀 VS Code Local Setup Guide (Complete)

This guide will help you run the Spice House e-commerce application on your local VS Code environment after cloning from GitHub.

---

## ✅ Prerequisites

Before you start, make sure you have:

1. **MySQL 8.0+** installed and running
2. **Java 17+** (or Java 19)
3. **Maven 3.6+**
4. **Node.js 18+** and npm
5. **Git**

---

## 📋 Quick Start (5 Minutes)

### Step 1: Clone the Repository

```bash
git clone <your-github-repo-url>
cd spice-house
```

### Step 2: Database Setup

**Important:** You only need to do this ONCE. The database will persist on your machine.

#### Option A: Using MySQL Command Line

```bash
# Login to MySQL as root
mysql -u root -p

# In MySQL prompt, run:
CREATE DATABASE IF NOT EXISTS ecommerce_db;
CREATE USER IF NOT EXISTS 'ecommerce_user'@'localhost' IDENTIFIED BY 'ecommerce_pass_123';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Run the SQL commands from Option A

**That's it!** The schema and data will be created automatically by Spring Boot when you start the backend.

### Step 3: Start Backend

```bash
# Build the project (first time only)
mvn clean install

# Run the backend
mvn spring-boot:run

# By default, it uses "dev" profile which connects to localhost:3306
```

The backend will automatically:
- Create all database tables using `schema.sql`
- Load sample products and categories using `data.sql`
- Fix any cart_id issues if present

### Step 4: Start Frontend

Open a new terminal:

```bash
# Install dependencies (first time only)
npm install

# Start the dev server
npm run dev
```

### Step 5: Open in Browser

```
http://localhost:5000
```

---

## 🎯 What Works Out of the Box

✅ **Registration** - Create a new account  
✅ **Login** - Sign in with email/password  
✅ **Browse Products** - View all Malvani spices and mixes  
✅ **Categories** - Filter by Masalas or Mixes  
✅ **Product Details** - View detailed product information  
✅ **Add to Cart** - Add products with size selection  
✅ **Cart Management** - View, update, remove items  
✅ **Checkout** - Complete order with address  
✅ **Order History** - View past orders  

---

## 🔧 Configuration (Already Set for You)

### Backend Configuration

The application automatically uses the **dev** profile when running locally:

**Database:** `localhost:3306/ecommerce_db`  
**Username:** `ecommerce_user`  
**Password:** `ecommerce_pass_123`  
**Backend Port:** `8080`

### Frontend Configuration

**Dev Server:** `localhost:5000`  
**API URL:** `http://localhost:8080` (auto-detected)

---

## 🐛 Troubleshooting

### Problem 1: "Can't connect to MySQL server"

**Solution:**
```bash
# Check if MySQL is running
# Windows:
services.msc (look for MySQL)

# Mac:
brew services list

# Linux:
sudo systemctl status mysql
```

Start MySQL if it's not running:
```bash
# Windows: Start from services.msc
# Mac:
brew services start mysql
# Linux:
sudo systemctl start mysql
```

### Problem 2: "Access denied for user 'ecommerce_user'"

**Solution:** Recreate the user:
```bash
mysql -u root -p

# In MySQL:
DROP USER IF EXISTS 'ecommerce_user'@'localhost';
CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'ecommerce_pass_123';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Problem 3: Backend won't start - "Port 8080 already in use"

**Solution:**
```bash
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8080 | xargs kill -9
```

### Problem 4: Frontend won't start - "Port 5000 already in use"

**Solution:**
```bash
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### Problem 5: Cart not working - "Field 'cart_id' doesn't have a default value"

**This is automatically fixed!** The new `schema.sql` file includes logic to remove the `cart_id` column.

If you still see the error:
```bash
mysql -u ecommerce_user -pecommerce_pass_123 ecommerce_db

# In MySQL:
ALTER TABLE cart_items DROP COLUMN IF EXISTS cart_id;
EXIT;

# Restart backend
```

### Problem 6: Login not working

**Check:**
1. Backend is running (check `http://localhost:8080`)
2. Browser console for errors (F12)
3. Backend logs for authentication errors

**Common fix:**
```bash
# Clear browser data
# - Open DevTools (F12)
# - Application tab
# - Clear storage
# - Refresh page
```

---

## 📂 Project Structure

```
spice-house/
├── src/
│   ├── main/
│   │   ├── java/                      # Backend code
│   │   │   └── com/laybhariecom/demo/
│   │   │       ├── config/            # Security, CORS, JWT
│   │   │       ├── controller/        # REST APIs
│   │   │       ├── model/             # JPA entities
│   │   │       ├── repository/        # Data access
│   │   │       └── service/           # Business logic
│   │   └── resources/
│   │       ├── schema.sql             # Database schema (auto-run)
│   │       ├── data.sql               # Sample data (auto-run)
│   │       ├── application.properties # Main config
│   │       ├── application-dev.properties    # Local config
│   │       └── application-replit.properties # Replit config
│   ├── api/                           # Frontend API layer
│   ├── components/                    # React components
│   ├── pages/                         # Page components
│   ├── contexts/                      # State management
│   └── types/                         # TypeScript types
├── pom.xml                            # Maven config
├── package.json                       # npm config
└── vite.config.ts                     # Vite config (auto-detects env)
```

---

## 🔄 Daily Development Workflow

```bash
# Terminal 1 - Backend
cd spice-house
mvn spring-boot:run

# Terminal 2 - Frontend
cd spice-house
npm run dev

# Open browser
# http://localhost:5000
```

**Note:** You only need to create the database once. After that, just run the two commands above!

---

## 🆕 After Pulling Updates from GitHub

```bash
git pull origin main

# If backend changes:
mvn clean install
mvn spring-boot:run

# If frontend changes:
npm install
npm run dev
```

The database will automatically update its schema if needed.

---

## 🌐 Environment Detection

The application automatically detects where it's running:

**VS Code (Local):**
- Uses `dev` profile
- Connects to `localhost:3306`
- Frontend on `localhost:5000`
- Backend on `localhost:8080`

**Replit:**
- Uses `replit` profile
- Connects to Replit's MySQL
- Both frontend and backend use Replit domains

**No manual configuration needed!**

---

## 📊 Database Information

**Tables Created Automatically:**
- `users` - User accounts
- `categories` - Product categories
- `products` - Product catalog
- `product_features` - Product features
- `product_sizes` - Available sizes
- `product_images` - Product images
- `cart_items` - Shopping cart (NO cart_id column)
- `addresses` - User addresses
- `orders` - Order history
- `order_items` - Order details

**Sample Data Included:**
- 2 categories (Masalas, Mixes)
- 7 products (Malvani spices and mixes)
- Product features, sizes, and images

---

## 🚫 Do NOT Commit to Git

These files are already in `.gitignore`:

- `node_modules/`
- `target/`
- `.env.local`
- `mysql/` (database files)

---

## ✨ Features Verified Working

✅ User Registration with JWT token  
✅ User Login with authentication  
✅ Add to Cart (with size selection)  
✅ View Cart with live updates  
✅ Update cart quantities  
✅ Remove from cart  
✅ Checkout with address  
✅ Order placement (COD)  
✅ Order history  
✅ Product browsing  
✅ Category filtering  
✅ Search functionality  

---

## 🔐 Security Notes

**Development Credentials** (for local use only):
- Database Password: `ecommerce_pass_123`
- JWT Secret: Auto-generated

**For Production:** Use environment variables to set secure passwords.

---

## 📞 Need Help?

1. Check backend logs in the terminal
2. Check browser console (F12)
3. Verify MySQL is running
4. Make sure ports 5000 and 8080 are free

---

**Status:** ✅ Ready for local development on VS Code

**Last Updated:** October 20, 2025
