# Local Development Setup Guide (VS Code)

This guide will help you run the Spice House e-commerce application on your local machine using VS Code.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Java Development Kit (JDK) 17 or higher**
   - Download from: https://www.oracle.com/java/technologies/downloads/
   - Or use OpenJDK: https://adoptium.net/
   - Verify installation: `java -version`

2. **Maven**
   - Download from: https://maven.apache.org/download.cgi
   - Verify installation: `mvn -version`

3. **MySQL Server**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP which includes MySQL

4. **Node.js and npm**
   - Download from: https://nodejs.org/
   - Verify installation: `node -v` and `npm -v`

5. **VS Code Extensions (Recommended)**
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - MySQL (by Weijan Chen)
   - ESLint
   - Prettier

---

## Step-by-Step Setup

### 1. Clone or Download the Project

```bash
# If using Git
git clone <your-repo-url>
cd spice-house

# Or extract the ZIP file and navigate to the folder
```

---

### 2. Setup MySQL Database

#### Option A: Using MySQL Command Line

```bash
# Login to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE ecommerce_db;
CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'ecommerce_pass_123';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Run the following SQL commands:

```sql
CREATE DATABASE ecommerce_db;
CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'ecommerce_pass_123';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Load Sample Data (Optional)

If you have the database seed file:

```bash
mysql -u ecommerce_user -p ecommerce_db < database_seed_real_data.sql
# Password: ecommerce_pass_123
```

---

### 3. Configure Application Properties

The application is already configured to work locally. By default, it uses the `dev` profile.

If you need to change database credentials, edit `src/main/resources/application-dev.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=ecommerce_user
spring.datasource.password=ecommerce_pass_123
```

**Alternative: Use Environment Variables**

You can also set environment variables instead of editing the file:

```bash
# Windows (PowerShell)
$env:DATABASE_URL="jdbc:mysql://localhost:3306/ecommerce_db?useSSL=false&allowPublicKeyRetrieval=true"
$env:DATABASE_USERNAME="ecommerce_user"
$env:DATABASE_PASSWORD="ecommerce_pass_123"

# Linux/Mac
export DATABASE_URL="jdbc:mysql://localhost:3306/ecommerce_db?useSSL=false&allowPublicKeyRetrieval=true"
export DATABASE_USERNAME="ecommerce_user"
export DATABASE_PASSWORD="ecommerce_pass_123"
```

---

### 4. Build the Spring Boot Backend

```bash
# Navigate to project root
cd /path/to/spice-house

# Clean and build the project
mvn clean package

# This will create a JAR file in the target/ directory
```

**If you get build errors:**
- Ensure Java 17+ is installed: `java -version`
- Ensure Maven is installed: `mvn -version`
- Check that MySQL is running: `mysql -u ecommerce_user -p`

---

### 5. Run the Spring Boot Backend

#### Option A: Using Maven

```bash
mvn spring-boot:run
```

#### Option B: Using the JAR file

```bash
java -jar target/spice-house-backend-1.0.0.jar
```

#### Option C: From VS Code

1. Open the project in VS Code
2. Navigate to `src/main/java/com/laybhariecom/demo/DemoApplication.java`
3. Click the "Run" button above the `main` method

**Verify the backend is running:**
- Open browser and visit: http://localhost:8080/api/categories
- You should see JSON data

---

### 6. Install Frontend Dependencies

```bash
# In the project root directory
npm install
```

---

### 7. Run the Frontend (Vite Dev Server)

```bash
npm run dev
```

The frontend will start on: **http://localhost:5000**

---

### 8. Access the Application

Open your browser and navigate to:

```
http://localhost:5000
```

You should see the Spice House e-commerce website!

---

## Troubleshooting

### Backend Issues

**1. Cannot connect to MySQL**

Error: `Communications link failure`

**Solution:**
- Ensure MySQL is running
- Check MySQL credentials in `application-dev.properties`
- Try connecting via command line: `mysql -u ecommerce_user -p`

**2. Port 8080 already in use**

Error: `Port 8080 is already in use`

**Solution:**
- Stop other applications using port 8080
- Or change the port in `application.properties`:
  ```properties
  server.port=8081
  ```

**3. Java version mismatch**

Error: `UnsupportedClassVersionError`

**Solution:**
- This project requires Java 17+
- Update your JDK or set `JAVA_HOME` to Java 17+

**4. Maven build fails**

**Solution:**
```bash
# Clear Maven cache and rebuild
mvn clean
mvn dependency:purge-local-repository
mvn clean install
```

### Frontend Issues

**1. Port 5000 already in use**

**Solution:**
- Edit `vite.config.ts` and change the port:
  ```typescript
  export default defineConfig({
    server: {
      port: 3000, // Change to any available port
    },
  });
  ```

**2. CORS errors**

**Solution:**
- Ensure the backend `cors.allowed.origins` includes your frontend URL
- Already configured for `http://localhost:5000` and `http://localhost:3000`

**3. npm install fails**

**Solution:**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

**1. Tables not created automatically**

**Solution:**
- The application uses `spring.jpa.hibernate.ddl-auto=update`
- Tables should be created automatically when you start the backend
- If not, check MySQL logs or manually import `database_seed_real_data.sql`

**2. Access denied for user**

**Solution:**
```sql
# Re-grant privileges
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## Running in Different Environments

### Development (Local)

```bash
# Uses application-dev.properties
mvn spring-boot:run

# Or explicitly set profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Replit Environment

```bash
# Uses application-replit.properties
java -jar target/spice-house-backend-1.0.0.jar --spring.profiles.active=replit
```

---

## VS Code Shortcuts

- **Run Backend**: Press `F5` or click "Run and Debug" → "Spring Boot"
- **Terminal**: Press `` Ctrl + ` `` to open integrated terminal
- **Format Code**: Press `Shift + Alt + F`

---

## Project Structure

```
spice-house/
├── src/
│   ├── main/
│   │   ├── java/          # Spring Boot backend code
│   │   └── resources/
│   │       ├── application.properties          # Main config (uses env variables)
│   │       ├── application-dev.properties      # Local development config
│   │       └── application-replit.properties   # Replit environment config
│   └── components/        # React frontend components
├── pom.xml                # Maven dependencies
├── package.json           # NPM dependencies
├── vite.config.ts         # Vite configuration
└── database_seed_real_data.sql  # Database seed file
```

---

## Important Notes

1. **Default Profile**: The application uses the `dev` profile by default, perfect for local development

2. **Database Credentials**: 
   - Username: `ecommerce_user`
   - Password: `ecommerce_pass_123`
   - Database: `ecommerce_db`
   - You can change these in `application-dev.properties`

3. **API Endpoints**: Backend runs on port 8080
   - Categories: http://localhost:8080/api/categories
   - Products: http://localhost:8080/api/products
   - Auth: http://localhost:8080/api/auth/register

4. **Frontend**: Runs on port 5000
   - Configured to call backend at http://localhost:8080

5. **CORS**: Already configured for local development

---

## Next Steps

After successful setup:

1. Test the application by browsing products
2. Try user registration and login
3. Test adding items to cart
4. Place test orders

For any issues not covered here, check:
- Spring Boot logs in the console
- MySQL error logs
- Browser console for frontend errors

---

## Contact & Support

If you encounter any issues, please:
1. Check the troubleshooting section above
2. Review Spring Boot logs for specific error messages
3. Ensure all prerequisites are properly installed

Happy coding! 🎉
