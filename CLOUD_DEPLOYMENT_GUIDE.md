# ☁️ Spice House E-Commerce - Cloud Deployment Guide

## 📋 Overview

This guide provides comprehensive instructions for deploying your Spice House E-Commerce platform to production on various cloud platforms.

---

## 🎯 Deployment Options Comparison

| Platform | Best For | Difficulty | Cost | Pros | Cons |
|----------|----------|------------|------|------|------|
| **Vercel + Railway** | Quick MVP | ⭐ Easy | $ Low | Fast setup, auto-deploy | Separate platforms |
| **Render** | All-in-one | ⭐⭐ Easy | $$ Medium | Unified platform | Limited free tier |
| **AWS (EC2 + RDS)** | Enterprise | ⭐⭐⭐⭐ Hard | $$$ High | Full control, scalable | Complex setup |
| **Replit Deployments** | Fastest | ⭐ Easiest | $ Low | One-click deploy | Limited customization |
| **DigitalOcean** | Developer-friendly | ⭐⭐⭐ Medium | $$ Medium | Good balance | Requires some DevOps |

**Recommended for You:** Start with **Vercel + Railway** or **Render** for MVP, migrate to AWS when scaling.

---

## 🚀 OPTION 1: Vercel (Frontend) + Railway (Backend + Database)

### **Why This Stack?**
- ✅ Free tier available
- ✅ Automatic deployments from Git
- ✅ Easy environment variable management
- ✅ Built-in SSL certificates
- ✅ CDN for static assets
- ✅ Minimal DevOps knowledge required

---

### **Architecture**
```
User → Vercel (React Frontend)
       ↓ API Calls
       Railway (Spring Boot Backend)
       ↓ Database Queries
       Railway MySQL Database
```

---

### **Step 1: Deploy Backend to Railway** ⏱️ 15 minutes

#### **1.1 Prerequisites**
- Railway account (https://railway.app)
- Git repository with your code
- Dockerize your Spring Boot app (optional but recommended)

---

#### **1.2 Create Dockerfile for Backend**

**File: `backend/demo/Dockerfile`**
```dockerfile
FROM eclipse-temurin:19-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN apk add --no-cache maven
RUN mvn clean package -DskipTests

FROM eclipse-temurin:19-jre-alpine
WORKDIR /app
COPY --from=build /app/target/spice-house-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

#### **1.3 Deploy Backend on Railway**

1. **Login to Railway:**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Create New Project:**
   ```bash
   cd backend/demo
   railway init
   ```

3. **Add MySQL Database:**
   - Go to Railway dashboard
   - Click "New" → "Database" → "MySQL"
   - Railway automatically provides connection details

4. **Configure Environment Variables:**
   In Railway dashboard, add:
   ```env
   MYSQL_HOST=${MYSQLHOST}
   MYSQL_PORT=${MYSQLPORT}
   MYSQL_DATABASE=${MYSQLDATABASE}
   MYSQL_USER=${MYSQLUSER}
   MYSQL_PASSWORD=${MYSQLPASSWORD}
   JWT_SECRET=<generate-strong-secret-256-bit>
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   SPRING_DATASOURCE_URL=jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}
   SPRING_DATASOURCE_USERNAME=${MYSQLUSER}
   SPRING_DATASOURCE_PASSWORD=${MYSQLPASSWORD}
   ```

5. **Deploy:**
   ```bash
   railway up
   ```

6. **Generate Public URL:**
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Note the URL: `https://your-backend-name.up.railway.app`

---

#### **1.4 Seed Production Database**

```bash
# Connect to Railway MySQL
railway connect MySQL

# Once connected, run:
SOURCE /path/to/database_seed_real_data.sql;
```

---

### **Step 2: Deploy Frontend to Vercel** ⏱️ 10 minutes

#### **2.1 Prerequisites**
- Vercel account (https://vercel.com)
- Git repository connected to GitHub/GitLab/Bitbucket

---

#### **2.2 Prepare Frontend for Production**

**File: `.env.production`**
```env
VITE_API_URL=https://your-backend-name.up.railway.app/api
```

**File: `vite.config.ts`** (update if needed)
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select']
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: false
  }
});
```

---

#### **2.3 Deploy to Vercel**

**Method 1: Via Vercel Dashboard (Easiest)**
1. Go to https://vercel.com/new
2. Import your Git repository
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (or where package.json is)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend-name.up.railway.app/api`
5. Click "Deploy"

**Method 2: Via CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variable
vercel env add VITE_API_URL production
# Enter: https://your-backend-name.up.railway.app/api
```

---

#### **2.4 Configure Custom Domain (Optional)**

1. **Buy Domain:** (Namecheap, GoDaddy, etc.)
   - Example: `spicehouse.com`

2. **Add to Vercel:**
   - Settings → Domains → Add Domain
   - Enter: `spicehouse.com` and `www.spicehouse.com`

3. **Update DNS:**
   - Add CNAME record: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → Vercel IP (provided in dashboard)

4. **Update Backend CORS:**
   ```env
   CORS_ALLOWED_ORIGINS=https://spicehouse.com,https://www.spicehouse.com
   ```

---

### **Step 3: Testing Production Deployment**

```bash
# Test backend health
curl https://your-backend-name.up.railway.app/api/products

# Test frontend
open https://your-frontend-name.vercel.app

# Test CORS
curl -H "Origin: https://your-frontend-name.vercel.app" \
     https://your-backend-name.up.railway.app/api/products
```

---

## 🚀 OPTION 2: Render (All-in-One Platform)

### **Why Render?**
- One platform for frontend, backend, and database
- Automatic SSL
- Free tier available
- Easy environment variables

---

### **Architecture**
```
User → Render Static Site (Frontend)
       ↓ API Calls
       Render Web Service (Backend)
       ↓ Database Queries
       Render PostgreSQL Database
```

**Note:** Render uses PostgreSQL, not MySQL. You'll need to:
- Change database driver in `pom.xml`
- Update `application.properties`
- Or use an external MySQL provider

---

### **Step 1: Deploy Backend**

1. **Create `render.yaml` in root:**
```yaml
services:
  - type: web
    name: spice-house-backend
    env: java
    buildCommand: cd backend/demo && mvn clean package
    startCommand: java -jar backend/demo/target/spice-house-backend-1.0.0.jar
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: spicehouse-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: CORS_ALLOWED_ORIGINS
        value: https://spicehouse.onrender.com

databases:
  - name: spicehouse-db
    databaseName: ecommerce_db
    user: spiceuser
```

2. **Connect Git Repository:**
   - Go to https://render.com
   - New → Web Service
   - Connect your repository
   - Render auto-detects `render.yaml`

3. **Deploy:** Click "Create Web Service"

---

### **Step 2: Deploy Frontend**

1. **New → Static Site**
2. **Configure:**
   - Build Command: `npm run build`
   - Publish Directory: `dist`
3. **Environment Variable:**
   - `VITE_API_URL` = `https://spice-house-backend.onrender.com/api`
4. **Deploy**

---

## 🚀 OPTION 3: AWS (Production-Grade)

### **Architecture**
```
CloudFront (CDN)
  ↓
S3 Bucket (Frontend Static Files)

Users → Application Load Balancer
        ↓
        EC2 Auto Scaling Group (Backend)
        ↓
        RDS MySQL (Database)
        ↓
        S3 (Product Images)
```

---

### **Services Needed**
1. **S3:** Frontend static files
2. **CloudFront:** CDN for global distribution
3. **EC2 / ECS:** Backend application
4. **RDS MySQL:** Managed database
5. **Route 53:** DNS management
6. **Certificate Manager:** SSL certificates
7. **Load Balancer:** Traffic distribution
8. **Auto Scaling:** Handle traffic spikes

---

### **Step-by-Step AWS Deployment**

#### **1. Database Setup (RDS)**

```bash
# Create RDS MySQL instance
aws rds create-db-instance \
  --db-instance-identifier spicehouse-db \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --engine-version 8.0.35 \
  --master-username admin \
  --master-user-password <SecurePassword123!> \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxxxxx \
  --publicly-accessible \
  --backup-retention-period 7

# Get endpoint
aws rds describe-db-instances \
  --db-instance-identifier spicehouse-db \
  --query 'DBInstances[0].Endpoint.Address'
```

---

#### **2. Backend Deployment (EC2)**

**Create EC2 Instance:**
```bash
# Launch Ubuntu instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t2.micro \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxxxx \
  --user-data file://setup-script.sh
```

**`setup-script.sh`:**
```bash
#!/bin/bash
sudo apt update
sudo apt install -y openjdk-19-jre-headless

# Download your JAR
wget https://your-ci-server/spice-house-backend-1.0.0.jar

# Create systemd service
sudo cat > /etc/systemd/system/spicehouse.service <<EOF
[Unit]
Description=Spice House Backend
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu
ExecStart=/usr/bin/java -jar spice-house-backend-1.0.0.jar
Restart=always

Environment="MYSQL_HOST=<rds-endpoint>"
Environment="MYSQL_PORT=3306"
Environment="MYSQL_DATABASE=ecommerce_db"
Environment="MYSQL_USER=admin"
Environment="MYSQL_PASSWORD=<SecurePassword123!>"
Environment="JWT_SECRET=<256-bit-secret>"

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable spicehouse
sudo systemctl start spicehouse
```

---

#### **3. Frontend Deployment (S3 + CloudFront)**

```bash
# Build frontend
npm run build

# Create S3 bucket
aws s3 mb s3://spicehouse-frontend

# Upload build
aws s3 sync dist/ s3://spicehouse-frontend --acl public-read

# Configure bucket for static hosting
aws s3 website s3://spicehouse-frontend \
  --index-document index.html \
  --error-document index.html

# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name spicehouse-frontend.s3.amazonaws.com \
  --default-root-object index.html
```

---

#### **4. SSL Certificate**

```bash
# Request certificate
aws acm request-certificate \
  --domain-name spicehouse.com \
  --domain-name www.spicehouse.com \
  --validation-method DNS

# Validate via DNS (add CNAME records)
# Attach to CloudFront distribution
```

---

## 🔒 Security Best Practices

### **1. Environment Variables**
Never commit secrets to Git. Use:
- Vercel/Railway: Built-in secret management
- Render: Environment variables in dashboard
- AWS: Systems Manager Parameter Store or Secrets Manager

---

### **2. CORS Configuration**
```properties
# ❌ DON'T: Allow all origins
cors.allowed.origins=*

# ✅ DO: Specific domains only
cors.allowed.origins=https://spicehouse.com,https://www.spicehouse.com
```

---

### **3. Database Security**
- Use private subnets for database
- Enable encryption at rest
- Use SSL/TLS for connections
- Implement regular backups
- Strong passwords (20+ characters)
- Limit access to specific IPs

---

### **4. API Security**
- Rate limiting (e.g., 100 requests/minute per IP)
- Input validation
- SQL injection prevention (using JPA)
- XSS protection
- HTTPS only
- Security headers:
  ```java
  Content-Security-Policy: default-src 'self'
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Strict-Transport-Security: max-age=31536000
  ```

---

## 📊 Monitoring & Logging

### **Application Monitoring**

**Option 1: Free Tools**
- **Frontend:** Vercel Analytics (built-in)
- **Backend:** Railway Logs / Render Logs
- **Uptime:** UptimeRobot (free tier)

**Option 2: Professional Tools**
- **Datadog:** Full-stack monitoring
- **New Relic:** APM for Java
- **Sentry:** Error tracking
- **LogRocket:** Session replay

---

### **Metrics to Track**
| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Response Time | < 500ms | > 2000ms |
| Uptime | 99.9% | < 99% |
| Error Rate | < 0.1% | > 1% |
| Database Queries | < 100ms | > 500ms |
| CPU Usage | < 70% | > 85% |
| Memory Usage | < 80% | > 90% |

---

### **Health Check Endpoints**

Add to Spring Boot:
```java
@RestController
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", Instant.now().toString());
        health.put("version", "1.0.0");
        return ResponseEntity.ok(health);
    }
    
    @GetMapping("/health/db")
    public ResponseEntity<Map<String, String>> dbHealth() {
        // Check database connection
        try {
            productRepository.count();
            return ResponseEntity.ok(Map.of("database", "CONNECTED"));
        } catch (Exception e) {
            return ResponseEntity.status(503)
                .body(Map.of("database", "DISCONNECTED", "error", e.getMessage()));
        }
    }
}
```

---

## 🔄 CI/CD Pipeline

### **GitHub Actions Example**

**`.github/workflows/deploy.yml`:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK 19
        uses: actions/setup-java@v3
        with:
          java-version: '19'
          
      - name: Build with Maven
        run: |
          cd backend/demo
          mvn clean package -DskipTests
          
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          service: spice-house-backend
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install and Build
        run: |
          npm ci
          npm run build
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 💰 Cost Estimation

### **Small Scale (100-1000 users/month)**

**Vercel + Railway:**
- Frontend (Vercel): $0 (free tier)
- Backend (Railway): $5-10/month
- Database (Railway): $5/month
- **Total:** ~$10-15/month

**Render:**
- Frontend: $0 (free tier)
- Backend: $7/month
- Database: $7/month
- **Total:** ~$14/month

---

### **Medium Scale (1000-10000 users/month)**

**AWS:**
- EC2 (t3.small): ~$15/month
- RDS (db.t3.micro): ~$15/month
- S3 + CloudFront: ~$5/month
- Load Balancer: ~$18/month
- **Total:** ~$53/month

---

### **Large Scale (10000+ users/month)**

**AWS (Auto-scaling):**
- EC2 Auto Scaling (2-5 instances): ~$75/month
- RDS (db.t3.medium): ~$60/month
- S3 + CloudFront: ~$20/month
- Load Balancer: ~$18/month
- **Total:** ~$173/month

---

## 📝 Pre-Deployment Checklist

### **Code**
- [ ] All environment variables externalized
- [ ] No hardcoded secrets
- [ ] Production database credentials secured
- [ ] API endpoints tested
- [ ] Error handling implemented
- [ ] Logging configured

### **Database**
- [ ] Real data seeded
- [ ] Indexes created for performance
- [ ] Backup strategy in place
- [ ] Connection pooling configured
- [ ] SSL/TLS enabled

### **Frontend**
- [ ] Production build tested
- [ ] API URL pointing to production backend
- [ ] Assets optimized
- [ ] Bundle size < 500KB
- [ ] SEO meta tags added
- [ ] Favicon and manifest configured

### **Security**
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] Security headers configured

### **Performance**
- [ ] Lighthouse score > 90
- [ ] API response time < 500ms
- [ ] Database queries optimized
- [ ] Caching strategy implemented
- [ ] CDN configured for static assets

### **Monitoring**
- [ ] Application monitoring setup
- [ ] Error tracking configured
- [ ] Health check endpoints working
- [ ] Alerts configured for downtime
- [ ] Log aggregation setup

---

## 🆘 Troubleshooting

### **Issue: CORS Error in Production**
**Symptom:** Frontend can't call backend API

**Solution:**
```properties
# Update backend CORS
cors.allowed.origins=https://your-frontend-domain.com

# Restart backend
# Clear browser cache
```

---

### **Issue: Database Connection Timeout**
**Symptom:** Backend can't connect to database

**Solution:**
1. Check environment variables
2. Verify database firewall rules
3. Test connection manually:
   ```bash
   mysql -h <host> -P <port> -u <user> -p
   ```
4. Check database status on cloud dashboard

---

### **Issue: Frontend Shows Blank Page**
**Symptom:** Deployment successful but site is blank

**Solution:**
1. Check browser console for errors
2. Verify `VITE_API_URL` is set correctly
3. Check `dist/` folder was created during build
4. Verify routing configuration for SPA

---

## 🎓 Post-Deployment Tasks

1. **Set up monitoring alerts**
2. **Configure automated backups**
3. **Document deployment process**
4. **Train team on deployment workflow**
5. **Plan for disaster recovery**
6. **Schedule security audits**
7. **Implement A/B testing**
8. **Set up analytics**

---

**Last Updated:** October 19, 2025  
**Status:** Production-Ready Guide  
**Recommended:** Start with Vercel + Railway, scale to AWS later
