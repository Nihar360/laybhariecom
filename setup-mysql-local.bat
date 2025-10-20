@echo off
REM =========================================================================
REM MySQL Local Setup Script for Windows
REM =========================================================================
REM This script sets up the MySQL database for local development
REM Prerequisites: MySQL 8.0+ installed on your machine
REM =========================================================================

setlocal enabledelayedexpansion

echo =================================
echo Spice House - MySQL Local Setup
echo =================================
echo.

REM Database configuration
set DB_NAME=ecommerce_db
set DB_USER=ecommerce_user
set DB_PASS=ecommerce_pass_123

echo This script will:
echo 1. Create database: %DB_NAME%
echo 2. Create user: %DB_USER%
echo 3. Grant all privileges
echo 4. Load sample data
echo.

REM Prompt for MySQL root password
set /p MYSQL_ROOT_PASS="Please enter your MySQL root password: "
echo.

REM Test MySQL connection
echo Testing MySQL connection...
mysql -u root -p%MYSQL_ROOT_PASS% -e "SELECT 1;" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Cannot connect to MySQL. Please check your credentials.
    exit /b 1
)
echo [OK] MySQL connection successful
echo.

REM Create database
echo Creating database...
mysql -u root -p%MYSQL_ROOT_PASS% -e "CREATE DATABASE IF NOT EXISTS %DB_NAME%;"
echo [OK] Database created: %DB_NAME%

REM Create user and grant privileges
echo Creating user and granting privileges...
mysql -u root -p%MYSQL_ROOT_PASS% -e "CREATE USER IF NOT EXISTS '%DB_USER%'@'localhost' IDENTIFIED BY '%DB_PASS%';"
mysql -u root -p%MYSQL_ROOT_PASS% -e "GRANT ALL PRIVILEGES ON %DB_NAME%.* TO '%DB_USER%'@'localhost';"
mysql -u root -p%MYSQL_ROOT_PASS% -e "FLUSH PRIVILEGES;"
echo [OK] User created and privileges granted

REM Load sample data
if exist database_seed_real_data_fixed.sql (
    echo Loading sample data (with cart fix)...
    mysql -u %DB_USER% -p%DB_PASS% %DB_NAME% < database_seed_real_data_fixed.sql
    echo [OK] Sample data loaded successfully
) else if exist database_seed_real_data.sql (
    echo Loading sample data...
    mysql -u %DB_USER% -p%DB_PASS% %DB_NAME% < database_seed_real_data.sql
    echo [OK] Sample data loaded successfully
) else (
    echo [WARNING] database seed file not found. Skipping data loading.
)

REM Fix cart_items table if needed
echo Applying cart schema fix...
mysql -u %DB_USER% -p%DB_PASS% %DB_NAME% -e "ALTER TABLE cart_items DROP COLUMN IF EXISTS cart_id;" 2>nul
echo [OK] Cart schema verified

echo.
echo =================================
echo MySQL setup completed successfully!
echo =================================
echo.
echo Database connection details:
echo   Host: localhost
echo   Port: 3306
echo   Database: %DB_NAME%
echo   Username: %DB_USER%
echo   Password: %DB_PASS%
echo.
echo You can now start the backend server!
echo.
pause
