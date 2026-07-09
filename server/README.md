# 🚗 **Car Service – Server‑Side API**

[🇮🇷 Read in Persian](./README.FA.md)

**Car Service Server‑Side** is a modular, scalable, and production‑ready API designed for managing a complete car rental
system.  
Built with **NestJS + TypeScript + Prisma + PostgreSQL + Zod + Swagger**, it focuses on clean architecture, long‑term
maintainability, and fully standardized API responses.

---

## 🚀 Features

- User management (full CRUD)
- JWT authentication (Login / Register / Refresh)
- Role‑based access control (User, Admin, Super Admin)
- Car management (create, update, delete, list)
- Car reservation / rental system
- Custom Response Factory for unified API outputs
- Input validation using **Zod + nestjs‑zod**
- Full API documentation with **Swagger**
- Stable PostgreSQL integration via **Prisma**
- Modular and scalable project structure

---

# 📦 Core Packages

| Tech           | Version | Description                   |
|----------------|---------|-------------------------------|
| **typescript** | ^5.7.3  | Schema validation             |
| **nestjs**     | ^11.0.1 | NestJS core utilities         |
| **postgreSQL** | ^16.11  | Modern Database               |
| **pg**         | ^8.18.0 | PostgreSQL driver             |
| **prisma**     | ^7.3.0  | Prisma ORM client             |
| **zod**        | ^4.3.6  | Schema validation             |
| **jwt**        | ^11.0.2 | JWT authentication            |
| **passport**   | ^11.0.5 | Passport authentication layer |
| **bcrypt**     | ^6.0.0  | Password hashing              |
| **swagger**    | ^11.2.6 | API documentation (Swagger)   |
| **vitest**     | ^4.0.8  | Testing Services and app      |

---

## 🏁 Quick Start

1. Clone the repository:

   ```bash
   git clone https://github.com/mardi-niyayesh/car_service.git
   cd car_service/server
   ```

   **or with ssh**

   ```bash
   git clone git@github.com:mardi-niyayesh/car_service.git
   cd car_service/server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   # for config and development
   NODE_ENV="development"
   
   # Port
   PORT="3000"

   # DB URL
   # your_user_name → your database username
   # your_password → your database password
   # car_service   → target database name
   DATABASE_URL="postgresql://your_user_name:your_password@localhost:5432/car_service?pool_timeout=10&connect_timeout=15"
   
   CLIENT_RESET_PASSWORD="http://localhost:5173/reset-password"
   
   # JWT Secret
   # type in terminal for create secres: node -e "console.log(require('crypto').randomBytes(64).toString('hex'));"
   JWT_SECRET="JWT_ACCESS_SECRET"
   
   # JWT Expires
   JWT_EXPIRES="1h"
   
   # Email Config
   EMAIL_SERVICE="service"
   EMAIL_USER="yourmil@service.co"
   EMAIL_PASS="xxxx xxxx xxxx xxxx"
   EMAIL_FROM="Car Service <yourmil@service.co>"
   EMAIL_HOST="email host"
   ```

4. Create Database and Collation:<br><br>

   **automat (recommended):**
   ```bash
   npm run db:setup
   ```
   **Finish. 🏁 (and go to 5th)**<br><br><br>

   **or manually:**
   ```postgresql
   CREATE DATABASE car_service
   ENCODING 'UTF8'
   LC_COLLATE 'en_US.UTF-8'
   LC_CTYPE 'en_US.UTF-8'
   TEMPLATE template0
   OWNER app_owner;
   
   \c car_service;
   
   CREATE COLLATION IF NOT EXISTS "ar_SA.utf8" (LOCALE = 'ar_SA.utf8');
   CREATE COLLATION IF NOT EXISTS "ar_SA" (LOCALE = 'ar_SA.utf8');
   ```

   **and**
   ```bash
   npm run prisma:setup
   npm run seed:roles
   ```
   **Finish.**<br><br><br>

5. Create **owner** Role:

   ```bash
   npm run seed:owner
   ```

6. Start development mode:

   ```bash
   npm run start:dev
   ```

---

## 🏗️ Build (Production)

Compile TypeScript into JavaScript:

```bash
npm run build
```

The compiled output will be generated inside the `dist/` directory.

---

## 🚀 Start (Production)

After building:

```bash
npm start
```

Or run directly:

```bash
node dist/main.js
```

---

## 🔐 Security Note: Script Folder Access

The `scripts/` directory contains development‑only utilities such as the **Prisma Sync Script**.  
These scripts **must not** be executed in production environments.

### ✔️ Recommended Production Setup

- Disable execution permissions for the `scripts` folder on production servers
- Or exclude the folder entirely during CI/CD or Docker builds
- Ensure only trusted developers can run these scripts locally

This prevents accidental or unauthorized execution of sensitive operations.

---

## 🔮 Future Plans

- Invoice and receipt management
- Advanced admin panel
- Reporting and analytics
- Advanced filtering and search for cars

---

[🇮🇷 Read in Persian](./README.FA.md)
