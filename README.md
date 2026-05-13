# 🚗 **Car Service – Full‑Stack Car Rental Platform**

[🇮🇷 نسخه فارسی](./README.FA.md)
[🇮🇷 Read in Persian](./README.FA.md)

A complete full‑stack car rental platform built with a modern, scalable, and modular architecture.  
This project includes both:

- **Backend:** NestJS + Prisma + PostgreSQL + Zod + Swagger
- **Frontend:** React + Vite + TypeScript + TailwindCSS

Designed for long‑term maintainability, clean architecture, and production‑ready development.

---

# 🌐 Project Structure

```
car_service/
│
├── backend/        # Car Service – Server‑Side API (NestJS + Redis + PosrgresQL)
│   └── server/
│
└── frontend/       # Client application (React + Vite)
    └── client/
```

# 📟 How to Work?

```mermaid
graph TB
    A["🌐 End User"] -->|HTTP Request|B["⚛️ React.js Client"]
B -->|API Call|C["🟢 NestJS Server"]

C -->|Cache Hit/Miss|D["📡 Redis Cache"]
D -->|Cached Data|C

C -->|CRUD Operation|E["🐘 PostgreSQL DB"]
E -->|Raw Data|C

C -->|HTTP Response| B
B -->|UI Update|A
```

---

# 🛠️ **Backend – Car Service Server‑Side API**

A modular, scalable API for managing the entire car rental system.

### 🚀 Backend Features

- User management (full CRUD)
- JWT authentication (Login / Register / Refresh)
- Role‑based access control (User, Admin, Super Admin)
- Car management (create, update, delete, list)
- Car reservation / rental system
- Custom Response Factory for unified API outputs
- Input validation using **Zod + nestjs‑zod**
- Full API documentation with **Swagger**
- PostgreSQL integration via **Prisma**
- Clean, modular architecture

---

## 📦 Backend Core Packages

| Tech         | Version | Description         |
|--------------|---------|---------------------|
| **nestjs**   | ^11.0.1 | Backend framework   |
| **jwt**      | ^11.0.2 | JWT authentication  |
| **passport** | ^11.0.5 | Auth strategy layer |
| **swagger**  | ^11.2.6 | API documentation   |
| **prisma**   | ^7.3.0  | ORM for PostgreSQL  |
| **pg**       | ^8.18.0 | PostgreSQL driver   |
| **bcrypt**   | ^6.0.0  | Password hashing    |
| **zod**      | ^4.3.6  | Schema validation   |

---

## Clone repo

```bash
git clone https://github.com/mardi-niyayesh/car_service.git
cd car_service
```

**or with ssh**

```bash
git clone git@github.com:mardi-niyayesh/car_service.git
cd car_service
```

## 🏁 Backend Quick Start

```bash
cd server
npm install
```

Create `.env`:

```env
PORT="3000"
DATABASE_URL="postgresql://user:password@localhost:5432/car_service"
JWT_SECRET="your_secret_key"
JWT_EXPIRES="1h"
```

Create Database and migrate prisma (required once):

```bash
npm run seed:database
```

Run dev:

```bash
npm run start:dev
```

---

# 🎨 **Frontend – MyCar Client App**

A modern, fast, responsive frontend built with **React + Vite + TypeScript + TailwindCSS**.

### 🚀 Frontend Features

- Modern UI with TailwindCSS
- Fast development with Vite
- Fully typed React components (TypeScript)
- Car listing UI
- Car details & reservation flow (future)
- User authentication pages (future)
- Admin dashboard (future)
- Swiper integration for car sliders

---

## 📦 Frontend Core Packages

| Tech            | Version | Description                 |
|-----------------|---------|-----------------------------|
| **react**       | ^19.2.0 | UI library                  |
| **react‑dom**   | ^19.2.0 | DOM renderer                |
| **vite**        | 7.2.5   | Frontend build tool         |
| **typescript**  | ~5.9.3  | TypeScript support          |
| **tailwindcss** | ^4.1.17 | Utility‑first CSS framework |
| **swiper**      | ^12.0.3 | Carousels & sliders         |

---

## 🏁 Frontend Quick Start

```bash
cd client
npm install
npm run dev
```

Build:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

---

# 🔗 **Running Full‑Stack**

Backend:

```bash
cd server
npm run start:dev
```

Frontend:

```bash
cd client
npm run dev
```

Frontend will communicate with the backend via:

```
http://localhost:3000/api
```

(Adjust based on your backend BASE_URL.)

---

# 🔐 Security Notes

- Backend `scripts/` folder contains development utilities (e.g., Prisma sync)  
  → **Do NOT enable in production**
- Use environment variables for all secrets
- Never commit `.env` files

---

# 🔮 Full‑Stack Future Plans

- Online payment integration
- Reservation calendar UI
- Admin dashboard (cars, users, reservations)
- User profile & rental history
- Advanced filtering & search
- Multi‑language support (i18n)
- Webhooks for important events
- Mobile‑friendly UI redesign

---

## **Contributors**

### 👨‍💻 Project Contributors

A clean and modern full‑stack collaboration.

<br>

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/homow.png" width="90" style="border-radius: 50%;" /><br>
      <b>homow</b><br>
      <sub>Backend Developer · Server‑Side</sub><br>
      <a href="https://github.com/homow">github.com/homow</a>
    </td>
    <td align="center">
      <img src="https://github.com/mardi-niyayesh.png" width="90" style="border-radius: 50%;" /><br>
      <b>mardi‑niyayesh</b><br>
      <sub>Frontend Developer · Client‑Side</sub><br>
      <a href="https://github.com/mardi-niyayesh">github.com/mardi-niyayesh</a>
    </td>
  </tr>
</table>

---

[🇮🇷 نسخه فارسی](./README.FA.md)
[🇮🇷 Read in Persian](./README.FA.md)
