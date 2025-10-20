#!/bin/bash
# =========================================================================
# MySQL Local Setup Script for Mac/Linux
# =========================================================================
# This script sets up the MySQL database for local development
# Prerequisites: MySQL 8.0+ installed on your machine
# =========================================================================

set -e

echo "================================="
echo "Spice House - MySQL Local Setup"
echo "================================="
echo ""

# Database configuration
DB_NAME="ecommerce_db"
DB_USER="ecommerce_user"
DB_PASS="ecommerce_pass_123"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}This script will:${NC}"
echo "1. Create database: $DB_NAME"
echo "2. Create user: $DB_USER"
echo "3. Grant all privileges"
echo "4. Load sample data"
echo ""

# Prompt for MySQL root password
echo -e "${YELLOW}Please enter your MySQL root password:${NC}"
read -s MYSQL_ROOT_PASS
echo ""

# Test MySQL connection
echo -e "${YELLOW}Testing MySQL connection...${NC}"
mysql -u root -p"${MYSQL_ROOT_PASS}" -e "SELECT 1;" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Cannot connect to MySQL. Please check your credentials.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ MySQL connection successful${NC}"
echo ""

# Create database
echo -e "${YELLOW}Creating database...${NC}"
mysql -u root -p"${MYSQL_ROOT_PASS}" -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"
echo -e "${GREEN}✓ Database created: ${DB_NAME}${NC}"

# Create user and grant privileges
echo -e "${YELLOW}Creating user and granting privileges...${NC}"
mysql -u root -p"${MYSQL_ROOT_PASS}" -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
mysql -u root -p"${MYSQL_ROOT_PASS}" -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
mysql -u root -p"${MYSQL_ROOT_PASS}" -e "FLUSH PRIVILEGES;"
echo -e "${GREEN}✓ User created and privileges granted${NC}"

# Load sample data
if [ -f "database_seed_real_data.sql" ]; then
    echo -e "${YELLOW}Loading sample data...${NC}"
    mysql -u "${DB_USER}" -p"${DB_PASS}" "${DB_NAME}" < database_seed_real_data.sql
    echo -e "${GREEN}✓ Sample data loaded successfully${NC}"
else
    echo -e "${YELLOW}Warning: database_seed_real_data.sql not found. Skipping data loading.${NC}"
fi

echo ""
echo -e "${GREEN}=================================${NC}"
echo -e "${GREEN}MySQL setup completed successfully!${NC}"
echo -e "${GREEN}=================================${NC}"
echo ""
echo "Database connection details:"
echo "  Host: localhost"
echo "  Port: 3306"
echo "  Database: ${DB_NAME}"
echo "  Username: ${DB_USER}"
echo "  Password: ${DB_PASS}"
echo ""
echo "You can now start the backend server!"
