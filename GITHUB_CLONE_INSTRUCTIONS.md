# 📦 GitHub Clone Instructions - Works in Both Replit & VS Code

This project is designed to run **identically** in both Replit and VS Code environments. Just clone and run!

---

## 🎯 What You Get

✅ Complete e-commerce application (Spice House)  
✅ User authentication (Register/Login)  
✅ Product catalog (7 authentic Malvani products)  
✅ Shopping cart with backend persistence  
✅ Checkout and order management  
✅ Works in both Replit and VS Code **without any code changes**  

---

## 🚀 Running on Replit (After Clone/Import)

### Option 1: Import from GitHub to Replit

1. Go to [Replit](https://replit.com)
2. Click "Create Repl"
3. Select "Import from GitHub"
4. Paste your repository URL
5. Click "Import from GitHub"
6. Wait for import to complete
7. Click "Run" button

**That's it!** Replit will automatically:
- Start MySQL server
- Start Spring Boot backend
- Start Vite frontend
- Everything works out of the box

### Option 2: Clone in Replit Shell

```bash
git clone <your-repo-url>
cd <repo-name>
# Replit will automatically detect and run the workflows
```

**Replit Configuration:**
- The project has 3 workflows already configured:
  1. MySQL Server (internal database)
  2. Spring Boot Backend (port 8080)
  3. Vite Dev Server (port 5000)
- No setup needed - just click Run!

---

## 💻 Running on VS Code (Local Machine)

### Prerequisites

Make sure you have:
- MySQL 8.0+ installed and running
- Java 17+ (or Java 19)
- Maven 3.6+
- Node.js 18+ and npm
- Git

### Step 1: Clone Repository

```bash
git clone <your-github-repo-url>
cd spice-house
```

### Step 2: Setup MySQL Database

**You only need to do this ONCE!**

```bash
# Login to MySQL
mysql -u root -p

# Run these commands:
CREATE DATABASE IF NOT EXISTS ecommerce_db;
CREATE USER IF NOT EXISTS 'ecommerce_user'@'localhost' IDENTIFIED BY 'ecommerce_pass_123';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Note:** The backend will automatically create all tables and load sample data on first run!

### Step 3: Start Backend

```bash
# Build (first time only)
mvn clean install

# Run
mvn spring-boot:run
```

**What happens:**
- Backend starts on port 8080
- Connects to MySQL at localhost:3306
- Runs schema.sql to create tables (if they don't exist)
- Runs data.sql to load 7 sample products (if not already loaded)
- No errors about cart_id - it's automatically fixed!

### Step 4: Start Frontend

Open a new terminal:

```bash
# Install dependencies (first time only)
npm install

# Run dev server
npm run dev
```

**What happens:**
- Frontend starts on port 5000
- Automatically detects it's running locally (not Replit)
- Connects to backend at http://localhost:8080
- Hot reload enabled

### Step 5: Open in Browser

```
http://localhost:5000
```

**Test everything:**
1. Register a new account
2. Login
3. Browse products
4. Add items to cart
5. Checkout
6. View order history

**Everything works!** ✅

---

## 🔧 How It Works (Technical Details)

### Environment Auto-Detection

**Frontend (`vite.config.ts`):**
```typescript
// Detects Replit via process.env.REPL_SLUG
// Uses different host and HMR settings for each environment
```

**Backend (`application.properties`):**
```properties
# Default profile: dev (for local)
spring.profiles.active=${SPRING_PROFILES_ACTIVE:dev}

# Replit sets SPRING_PROFILES_ACTIVE=replit automatically
```

**API Client (`src/api/config.ts`):**
```typescript
// Detects hostname and adjusts API URL:
// - Replit: Uses same origin (no port)
// - Local: Uses localhost:8080
```

### Database Schema Management

**Old way (problematic):**
- Hibernate auto-generates tables
- Can create wrong schema (cart_id column)
- Different results in different environments

**New way (reliable):**
- Uses `schema.sql` to define exact table structure
- Uses `data.sql` to load sample products
- Same schema in both Replit and VS Code
- No cart_id issues!

### Files That Make It Work

```
src/main/resources/
├── schema.sql              # Creates all tables (runs on startup)
├── data.sql                # Loads sample products (runs on startup)
├── application.properties  # Default config (uses "dev" profile)
├── application-dev.properties    # Local VS Code config
└── application-replit.properties # Replit config
```

---

## 📁 What's Included in Repository

```
spice-house/
├── src/                    # Backend & Frontend code
├── pom.xml                 # Maven config
├── package.json            # npm config
├── vite.config.ts          # Vite config (auto-detects environment)
├── VSCODE_SETUP.md         # Detailed VS Code setup guide
├── GITHUB_CLONE_INSTRUCTIONS.md  # This file
├── CHANGES.md              # Complete changelog
├── .gitignore              # Excludes mysql/, node_modules/, target/
└── replit.md               # Project documentation
```

**NOT included (local only):**
- `mysql/` - Database files (created locally)
- `node_modules/` - npm dependencies (run `npm install`)
- `target/` - Compiled Java files (run `mvn clean install`)
- `.env.local` - Local environment variables (optional)

---

## 🎓 For First-Time Users

### If you've never used this project:

1. **On Replit**: Just click "Run" - everything works
2. **On VS Code**: Follow Step 2-5 above (5 minutes)

### If you're pulling updates:

```bash
git pull origin main

# If backend changed:
mvn clean install
mvn spring-boot:run

# If frontend changed:
npm install
npm run dev
```

---

## ✅ Verification Checklist

After setup, verify everything works:

**Replit:**
- [ ] Click "Run" button
- [ ] Wait for workflows to start (~10 seconds)
- [ ] Open Webview - homepage loads
- [ ] Register/Login works
- [ ] Add to cart works
- [ ] Checkout works

**VS Code:**
- [ ] MySQL is running
- [ ] Backend starts without errors
- [ ] Frontend starts on port 5000
- [ ] http://localhost:5000 loads
- [ ] Register/Login works
- [ ] Add to cart works
- [ ] Checkout works

---

## 🐛 Troubleshooting

### "Can't connect to MySQL"
- Make sure MySQL is running on your machine
- Verify credentials (user: ecommerce_user, password: ecommerce_pass_123)

### "Port already in use"
```bash
# Stop the process using the port
# Windows: taskkill /PID <pid> /F
# Mac/Linux: lsof -ti:8080 | xargs kill -9
```

### "Cart not working"
- This is automatically fixed by schema.sql
- If you still see issues, check backend logs for errors

### Still having issues?
- See VSCODE_SETUP.md for detailed troubleshooting
- Check backend logs for error messages
- Check browser console (F12) for frontend errors

---

## 🌟 Key Features

**For Users:**
- Browse authentic Malvani spices and mixes
- Add products to cart with size selection
- Complete checkout with address
- Track order history

**For Developers:**
- Works in both Replit and VS Code
- No environment-specific code
- Automatic schema and data loading
- Hot reload in both environments
- TypeScript + React + Spring Boot

---

## 📚 Additional Documentation

- **VSCODE_SETUP.md** - Detailed local setup guide
- **CHANGES.md** - Complete changelog of all changes
- **replit.md** - Project architecture and history

---

**Last Updated:** October 20, 2025  
**Status:** ✅ Ready for both Replit and VS Code development
