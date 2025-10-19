#!/bin/bash

export MYSQL_HOME=$PWD/mysql
mkdir -p $MYSQL_HOME

if [ ! -d "$MYSQL_HOME/mysql" ]; then
  echo "Initializing MySQL database..."
  mariadb-install-db --datadir=$MYSQL_HOME --user=$USER --skip-test-db
fi

echo "Starting MySQL server..."
mariadbd --datadir=$MYSQL_HOME \
  --socket=$MYSQL_HOME/mysql.sock \
  --pid-file=$MYSQL_HOME/mysql.pid \
  --bind-address=127.0.0.1 \
  --port=3306 \
  --skip-grant-tables &

sleep 8

echo "Waiting for MySQL to start..."
until mariadb -S $MYSQL_HOME/mysql.sock -e "SELECT 1" &>/dev/null; do
  sleep 1
done

echo "Creating ecommerce_db database..."
mariadb -S $MYSQL_HOME/mysql.sock -e "CREATE DATABASE IF NOT EXISTS ecommerce_db;"
mariadb -S $MYSQL_HOME/mysql.sock -e "SHOW DATABASES;"

echo "Database setup complete!"
echo "MySQL is running on port 3306"
echo "Socket: $MYSQL_HOME/mysql.sock"
