# Configuration Changes Summary

## What Was Changed

I've updated your Spring Boot application to support **both Replit and local VS Code environments** using Spring Profiles. Here's what changed:

---

## 📋 Files Modified/Created

### 1. **Created: `src/main/resources/application-dev.properties`**
   - **Purpose**: Configuration for local development (VS Code)
   - **Database**: Connects to `localhost:3306`
   - **CORS**: Allows `localhost:5000` and `localhost:3000`
   - **Profile**: Use with `--spring.profiles.active=dev`

### 2. **Created: `src/main/resources/application-replit.properties`**
   - **Purpose**: Configuration for Replit environment
   - **Database**: Connects to `127.0.0.1:3306`
   - **CORS**: Includes Replit-specific URLs
   - **Profile**: Use with `--spring.profiles.active=replit`

### 3. **Updated: `src/main/resources/application.properties`**
   - **Changes Made**:
     - Added `spring.profiles.active=${SPRING_PROFILES_ACTIVE:dev}` (defaults to dev profile)
     - Converted all hardcoded values to environment variables with defaults
     - Database credentials now use `${DATABASE_URL}`, `${DATABASE_USERNAME}`, `${DATABASE_PASSWORD}`
     - JWT secret now uses `${JWT_SECRET}`
     - CORS origins now use `${CORS_ORIGINS}`
   - **Benefit**: Can be configured via environment variables without editing files

### 4. **Updated: `start_backend.sh`**
   - **Change**: Added `--spring.profiles.active=replit` flag
   - **Before**: `java -jar target/spice-house-backend-1.0.0.jar`
   - **After**: `java -jar target/spice-house-backend-1.0.0.jar --spring.profiles.active=replit`

### 5. **Created: `LOCAL_SETUP_GUIDE.md`**
   - Comprehensive guide for running the application in VS Code
   - Step-by-step MySQL setup instructions
   - Troubleshooting section for common issues
   - Examples for Windows, Mac, and Linux

---

## 🚀 How to Run the Application

### **On Replit (Current Environment)**
Nothing changes for you! The application automatically uses the `replit` profile:
```bash
./start_backend.sh
```

### **On VS Code/Local Machine**
The application automatically uses the `dev` profile:

```bash
# Method 1: Using Maven
mvn spring-boot:run

# Method 2: Using the JAR
java -jar target/spice-house-backend-1.0.0.jar

# Method 3: Explicitly set dev profile
java -jar target/spice-house-backend-1.0.0.jar --spring.profiles.active=dev
```

---

## 🗄️ Database Configuration

### **Replit Environment**
- **Host**: `127.0.0.1:3306`
- **Database**: `ecommerce_db`
- **Username**: `ecommerce_user`
- **Password**: `ecommerce_pass_123`
- **Auto-managed**: MySQL starts via `start_mysql.sh`

### **Local VS Code Environment**
You need to install MySQL locally and create the database:

```sql
CREATE DATABASE ecommerce_db;
CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'ecommerce_pass_123';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
```

**Full instructions are in `LOCAL_SETUP_GUIDE.md`**

---

## 🌐 CORS Configuration

### **Replit Profile**
Allows requests from:
- `http://localhost:5000`
- `http://localhost:3000`
- `http://127.0.0.1:5000`
- `https://736ef5f2-d343-4d41-9526-ebfba578504d-00-3pe8yuz1os2es.riker.replit.dev`
- `http://736ef5f2-d343-4d41-9526-ebfba578504d-00-3pe8yuz1os2es.riker.replit.dev`

### **Dev Profile (Local)**
Allows requests from:
- `http://localhost:5000`
- `http://localhost:3000`
- `http://127.0.0.1:5000`

---

## 🔐 Environment Variables (Optional)

Instead of editing property files, you can set environment variables:

### **Windows (PowerShell)**
```powershell
$env:SPRING_PROFILES_ACTIVE="dev"
$env:DATABASE_URL="jdbc:mysql://localhost:3306/ecommerce_db?useSSL=false&allowPublicKeyRetrieval=true"
$env:DATABASE_USERNAME="ecommerce_user"
$env:DATABASE_PASSWORD="ecommerce_pass_123"
```

### **Linux/Mac (Bash)**
```bash
export SPRING_PROFILES_ACTIVE=dev
export DATABASE_URL="jdbc:mysql://localhost:3306/ecommerce_db?useSSL=false&allowPublicKeyRetrieval=true"
export DATABASE_USERNAME="ecommerce_user"
export DATABASE_PASSWORD="ecommerce_pass_123"
```

---

## 📂 Project Structure

```
spice-house/
├── src/main/resources/
│   ├── application.properties          # Main config (uses env vars with defaults)
│   ├── application-dev.properties      # Local development
│   └── application-replit.properties   # Replit environment
├── LOCAL_SETUP_GUIDE.md               # Step-by-step local setup guide
├── CONFIGURATION_CHANGES_SUMMARY.md   # This file
├── start_backend.sh                   # Replit startup script (uses replit profile)
└── pom.xml                            # Maven dependencies
```

---

## ✅ What Works Now

### **In Replit (No Changes Needed)**
- ✅ MySQL auto-starts
- ✅ Spring Boot backend runs on port 8080
- ✅ Vite frontend runs on port 5000
- ✅ All workflows configured
- ✅ CORS properly configured for Replit URLs

### **In VS Code/Local (After Setup)**
- ✅ Uses `dev` profile automatically
- ✅ Connects to local MySQL database
- ✅ CORS configured for localhost
- ✅ Frontend can call backend at localhost:8080
- ✅ All features work exactly like in Replit

---

## 🛠️ Prerequisites for Local Development

Before running locally, you need:

1. ✅ **Java 17+** (`java -version`)
2. ✅ **Maven** (`mvn -version`)
3. ✅ **MySQL Server** (installed and running)
4. ✅ **Node.js & npm** (for frontend)

**See `LOCAL_SETUP_GUIDE.md` for detailed installation instructions.**

---

## 🐛 Common Issues & Solutions

### **Issue 1: Backend won't start locally**
**Error**: `Communications link failure`

**Solution**: 
- Ensure MySQL is running
- Check credentials in `application-dev.properties`
- Test connection: `mysql -u ecommerce_user -p`

### **Issue 2: Port 8080 already in use**
**Solution**: Change port in `application.properties`:
```properties
server.port=8081
```

### **Issue 3: CORS errors**
**Solution**: 
- Ensure backend is running on port 8080
- Frontend should call `http://localhost:8080/api/*`
- Check `cors.allowed.origins` in properties file

### **Issue 4: Tables not created**
**Solution**:
- `spring.jpa.hibernate.ddl-auto=update` creates tables automatically
- Or manually import: `mysql -u ecommerce_user -p ecommerce_db < database_seed_real_data.sql`

---

## 📊 Profile Comparison

| Feature | dev (Local) | replit (Replit) |
|---------|-------------|-----------------|
| **Default** | ✅ Yes | No |
| **Database Host** | localhost:3306 | 127.0.0.1:3306 |
| **CORS** | Local only | Includes Replit URLs |
| **Auto-start MySQL** | ❌ Manual | ✅ Via workflow |
| **Environment** | VS Code, IntelliJ | Replit |

---

## 🎯 Key Benefits

1. **No Code Changes Needed**: Works in both environments without editing code
2. **Environment Variables**: Can override any setting without file changes
3. **Best Practices**: Follows Spring Boot profile conventions
4. **Security**: Credentials can be externalized via environment variables
5. **Flexibility**: Easy to add more profiles (test, production, etc.)

---

## 📝 Next Steps

### **To Run Locally in VS Code:**
1. Read `LOCAL_SETUP_GUIDE.md`
2. Install prerequisites (Java 17+, Maven, MySQL)
3. Create MySQL database and user
4. Run `mvn clean package`
5. Run `mvn spring-boot:run`
6. Run `npm run dev` for frontend

### **To Continue in Replit:**
Nothing changes! Everything works as before.

---

## 🔄 Migration Path

If you want to move from Replit to local permanently:

1. Export your database:
   ```bash
   mysqldump -u ecommerce_user -p ecommerce_db > backup.sql
   ```

2. Import on local machine:
   ```bash
   mysql -u ecommerce_user -p ecommerce_db < backup.sql
   ```

3. Update frontend API URL if needed (already configured for localhost)

---

## 🤝 Support

If you encounter any issues:
1. Check `LOCAL_SETUP_GUIDE.md` troubleshooting section
2. Verify all prerequisites are installed
3. Check Spring Boot logs for specific error messages
4. Ensure MySQL is running and accessible

---

**Happy coding! Your application is now ready to run anywhere! 🎉**
