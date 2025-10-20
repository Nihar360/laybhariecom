# 🚀 START HERE - Spice House E-commerce

Welcome! This project now works **identically** in both Replit and VS Code.

---

## 📖 Quick Navigation

### For New Users:
1. **Running on Replit?** → Just click "Run" button - everything works automatically!
2. **Cloning to VS Code?** → Read `VSCODE_SETUP.md` (5-minute setup)

### Documentation Guide:

| File | Purpose | When to Read |
|------|---------|--------------|
| **VSCODE_SETUP.md** | Complete VS Code setup guide | Before first run in VS Code |
| **GITHUB_CLONE_INSTRUCTIONS.md** | Quick reference for both environments | After cloning repository |
| **VS_CODE_CLONE_SUMMARY.md** | What changed & why | To understand the fixes |
| **CHANGES.md** | Technical changelog | For detailed change history |
| **replit.md** | Project documentation | For architecture & history |

---

## ✅ What Works

✅ User registration and login  
✅ Product browsing (7 Malvani products)  
✅ Categories (Masalas & Mixes)  
✅ Shopping cart with database persistence  
✅ Checkout with address  
✅ Order history  
✅ **Works in both Replit AND VS Code** 🎉  

---

## 🎯 Quick Start

### On Replit (Already Set Up):
```
Click "Run" → Everything starts automatically
```

### On VS Code (First Time):

**1. Clone the repository:**
```bash
git clone <your-repo-url>
cd spice-house
```

**2. Create MySQL database (ONE TIME ONLY):**
```bash
mysql -u root -p
```
Then run:
```sql
CREATE DATABASE IF NOT EXISTS ecommerce_db;
CREATE USER IF NOT EXISTS 'ecommerce_user'@'localhost' IDENTIFIED BY 'ecommerce_pass_123';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**3. Build & install:**
```bash
mvn clean install
npm install
```

**4. Run (Daily):**

Terminal 1:
```bash
mvn spring-boot:run
```

Terminal 2:
```bash
npm run dev
```

**5. Open:** http://localhost:5000

**For detailed troubleshooting, see VSCODE_SETUP.md**

---

## 🔧 What Was Fixed

### Critical Bug Fixed:
- **Problem:** "Field 'cart_id' doesn't have a default value" error
- **Solution:** Removed cart_id column, created proper schema.sql
- **Result:** Cart works perfectly in both environments

### Major Improvements:
- ✅ Automatic environment detection (Replit vs VS Code)
- ✅ Database schema managed by SQL files (not Hibernate)
- ✅ Sample data loads automatically (7 products)
- ✅ No manual configuration needed

---

## 📂 Project Structure

```
spice-house/
├── START_HERE.md                   ← You are here!
├── VSCODE_SETUP.md                 ← VS Code detailed guide
├── GITHUB_CLONE_INSTRUCTIONS.md    ← Quick reference
├── VS_CODE_CLONE_SUMMARY.md        ← What changed
├── CHANGES.md                      ← Technical changelog
├── replit.md                       ← Project documentation
│
├── src/main/resources/
│   ├── schema.sql                  ← Database tables (auto-run)
│   ├── data.sql                    ← Sample products (auto-run)
│   ├── application.properties      ← Main config
│   ├── application-dev.properties  ← VS Code config
│   └── application-replit.properties ← Replit config
│
├── setup-mysql-local.sh            ← Mac/Linux database setup
├── setup-mysql-local.bat           ← Windows database setup
├── fix-cart-schema.sql             ← Fix for existing databases
└── database_seed_real_data_fixed.sql ← Complete seed file
```

---

## 🎓 Environment Detection (How It Works)

### Backend Auto-Detection:
- **VS Code:** Uses `dev` profile → localhost:3306
- **Replit:** Uses `replit` profile → 127.0.0.1:3306

### Frontend Auto-Detection:
- **VS Code:** API at http://localhost:8080
- **Replit:** API at same origin (no port)

### Database:
- **VS Code:** Uses your local MySQL
- **Replit:** Uses Replit's MySQL
- **Both:** Same schema from schema.sql!

---

## 🐛 Common Issues

### Cart not working?
✅ **Already fixed!** The schema.sql automatically removes cart_id column.

### Login not working?
- Check backend is running (port 8080)
- Check browser console (F12) for errors
- Clear browser cache

### Backend won't start?
- Check MySQL is running
- Verify database credentials
- See VSCODE_SETUP.md troubleshooting section

---

## 📞 Need Help?

1. **Setup issues?** → See `VSCODE_SETUP.md` (detailed guide)
2. **Understanding changes?** → See `VS_CODE_CLONE_SUMMARY.md`
3. **Technical details?** → See `CHANGES.md`

---

## 🎉 Success Checklist

After setup in VS Code, verify:

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:5000  
- [ ] Homepage shows 7 products
- [ ] Can register a new user
- [ ] Can login
- [ ] **Can add to cart (no errors!)**
- [ ] Can complete checkout
- [ ] Can view order history

If all checked → **You're ready to develop!** 🚀

---

**Status:** ✅ Ready for both Replit and VS Code  
**Last Updated:** October 20, 2025  

**Next Step:** See `VSCODE_SETUP.md` for detailed VS Code setup guide
