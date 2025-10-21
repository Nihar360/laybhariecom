#!/bin/bash
cd backend/demo

# Build if jar doesn't exist
if [ ! -f "target/spice-house-backend-1.0.0.jar" ]; then
    echo "Building backend..."
    ./mvnw clean package -DskipTests
fi

exec java -jar target/spice-house-backend-1.0.0.jar --spring.profiles.active=replit
