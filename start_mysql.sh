#!/bin/bash

export MYSQL_HOME=$PWD/mysql
mkdir -p $MYSQL_HOME

if [ ! -d "$MYSQL_HOME/mysql" ]; then
  echo "Initializing MySQL database..."
  mariadb-install-db --datadir=$MYSQL_HOME --user=$USER --skip-test-db
  
  echo "Starting temporary server to set up security..."
  mariadbd --datadir=$MYSQL_HOME \
    --socket=$MYSQL_HOME/mysql.sock \
    --pid-file=$MYSQL_HOME/mysql.pid \
    --bind-address=127.0.0.1 \
    --port=3306 \
    --skip-networking &
  
  TEMP_PID=$!
  sleep 5
  
  echo "Creating database and user..."
  DB_PASSWORD="${MYSQL_PASSWORD:-ecommerce_pass_123}"
  mariadb -S $MYSQL_HOME/mysql.sock <<EOF
CREATE DATABASE IF NOT EXISTS ecommerce_db;
CREATE USER IF NOT EXISTS 'ecommerce_user'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'localhost';
FLUSH PRIVILEGES;
EOF
  
  kill $TEMP_PID
  wait $TEMP_PID 2>/dev/null
  sleep 2
fi

echo "Starting MySQL server with authentication..."
exec mariadbd --datadir=$MYSQL_HOME \
  --socket=$MYSQL_HOME/mysql.sock \
  --pid-file=$MYSQL_HOME/mysql.pid \
  --bind-address=127.0.0.1 \
  --port=3306
