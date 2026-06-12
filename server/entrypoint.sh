#!/bin/bash

echo "Running Prisma Migrations..."
(
    npx prisma migrate deploy && 
    npx prisma generate
) >> /app/migrations.log 2>&1

(
    npm run seed:roles && 
    npm run seed:users 
) >> /app/seed.log 2>&1

echo "Migrations and seed Completed."

npm run start:dev