# 🚗 **Car Service – پلتفرم فول‌استک کرایه خودرو**

[🇬🇧 نسخه انگلیسی](./README.md)
[🇬🇧 Read in English](./README.md)

**CarService** یک پلتفرم کامل و مدرن برای مدیریت سیستم کرایه خودرو است که از دو بخش تشکیل شده:

- **بک‌اند:** NestJS + Prisma + PostgreSQL + Zod + Swagger
- **فرانت‌اند:** React + Vite + TypeScript + TailwindCSS

این پروژه با معماری ماژولار، توسعه‌پذیر و استاندارد طراحی شده و مناسب محیط‌های Production است.

---

# 🌐 ساختار کلی پروژه

```
car_service/
│
├── backend/        # Car Service – Server‑Side API (NestJS + Redis + PosrgresQL)
│   └── server/
│
└── frontend/       # Client application (React + Vite)
    └── client/
```

# 📟 چطوری کار میکنه؟

```mermaid
graph TB
    A["🌐 کاربر"] -->|HTTP Request|B["⚛️ کلاینت"]
B -->|API Call|C["🟢 سرور"]

C -->|Cache Hit/Miss|D["📡 ردیس"]
D -->|Cached Data|C

C -->|CRUD Operation|E["🐘 دیتابیس"]
E -->|Raw Data|C

C -->|HTTP Response| B
B -->|UI Update|A
```

---

# 🛠️ **بک‌اند – Car Service Server‑Side API**

یک API ماژولار و مقیاس‌پذیر برای مدیریت کامل سیستم کرایه خودرو.

## 🚀 قابلیت‌های بک‌اند

- مدیریت کاربران (CRUD کامل)
- احراز هویت JWT (ورود / ثبت‌نام / رفرش)
- مدیریت نقش‌ها (User, Admin, Super Admin)
- مدیریت خودروها (افزودن، ویرایش، حذف، لیست)
- سیستم رزرو / کرایه خودرو
- **Response Factory** اختصاصی برای خروجی‌های استاندارد
- اعتبارسنجی ورودی‌ها با **Zod + nestjs‑zod**
- مستندسازی کامل API با **Swagger**
- اتصال پایدار به PostgreSQL با **Prisma**
- معماری ماژولار و قابل‌گسترش

---

## 📦 پکیج‌های اصلی بک‌اند

| تکنولوژی     | نسخه    | توضیح                    |
|--------------|---------|--------------------------|
| **nestjs**   | ^11.0.1 | فریم‌ورک بک‌اند          |
| **jwt**      | ^11.0.2 | احراز هویت JWT           |
| **passport** | ^11.0.5 | لایه استراتژی احراز هویت |
| **swagger**  | ^11.2.6 | مستندسازی API            |
| **prisma**   | ^7.3.0  | ORM برای PostgreSQL      |
| **pg**       | ^8.18.0 | درایور PostgreSQL        |
| **bcrypt**   | ^6.0.0  | هش کردن رمز عبور         |
| **zod**      | ^4.3.6  | اعتبارسنجی اسکیمای ورودی |

---

## کلون کردن رپو

```bash
git clone https://github.com/mardi-niyayesh/CarService.git
cd CarService
```

**با ssh**

```bash
git clone git@github.com:mardi-niyayesh/CarService.git
cd CarService
```

## 🏁 راه‌اندازی سریع بک‌اند

```bash
cd server
npm install
```

ساخت فایل `.env`:

```env
PORT="3000"
DATABASE_URL="postgresql://user:password@localhost:5432/car_service"
JWT_SECRET="your_secret_key"
JWT_EXPIRES="1h"
```

تولید Prisma Client (ضروری بعد از نصب):

```bash
npm run seed:database
```

> Prisma Client داخل ریپو قرار نمی‌گیرد و باید روی سیستم شما ساخته شود.

اجرای حالت توسعه:

```bash
npm run start:dev
```

---

# 🎨 **فرانت‌اند – MyCar Client App**

یک فرانت‌اند مدرن، سریع و واکنش‌گرا ساخته‌شده با **React + Vite + TypeScript + TailwindCSS**.

## 🚀 قابلیت‌های فرانت‌اند

- رابط کاربری مدرن با TailwindCSS
- توسعه سریع با Vite
- کامپوننت‌های تایپ‌شده با TypeScript
- نمایش لیست خودروها
- اسلایدر خودروها با Swiper
- صفحات احراز هویت (در آینده)
- صفحه رزرو خودرو (در آینده)
- داشبورد ادمین (در آینده)

---

## 📦 پکیج‌های اصلی فرانت‌اند

| تکنولوژی        | نسخه    | توضیح                |
|-----------------|---------|----------------------|
| **react**       | ^19.2.0 | کتابخانه رابط کاربری |
| **react‑dom**   | ^19.2.0 | رندر DOM             |
| **vite**        | 7.2.5   | ابزار ساخت فرانت‌اند |
| **typescript**  | ~5.9.3  | پشتیبانی TypeScript  |
| **tailwindcss** | ^4.1.17 | فریم‌ورک CSS مدرن    |
| **swiper**      | ^12.0.3 | اسلایدر و کاروسل     |

---

## 🏁 راه‌اندازی سریع فرانت‌اند

```bash
cd client
npm install
npm run dev
```

ساخت نسخه Production:

```bash
npm run build
```

پیش‌نمایش:

```bash
npm run preview
```

---

# 🔗 اجرای فول‌استک

### اجرای بک‌اند:

```bash
cd server
npm run start:dev
```

### اجرای فرانت‌اند:

```bash
cd client
npm run dev
```

فرانت‌اند به بک‌اند متصل می‌شود از طریق:

```
http://localhost:3000/api
```

(در صورت نیاز BASE_URL را تغییر دهید.)

---

# 🔐 نکات امنیتی

- پوشه `scripts/` شامل ابزارهای توسعه است  
  → **در محیط Production نباید اجرا شود**
- از متغیرهای محیطی برای تمام اطلاعات حساس استفاده کنید
- فایل `.env` را هرگز در ریپو قرار ندهید

---

# 🔮 برنامه‌های آینده (Full‑Stack)

- سیستم پرداخت آنلاین
- تقویم رزرو خودرو
- داشبورد ادمین (کاربران، خودروها، رزروها)
- پروفایل کاربر و تاریخچه رزرو
- فیلتر و جستجوی پیشرفته خودروها
- پشتیبانی چندزبانه (i18n)
- Webhook برای رویدادهای مهم
- طراحی UI موبایل‌فرندلی

---

## **سازندگان**

### 👨‍💻 سازندگان پروژه

یک همکاری تمیز، مدرن و فول‌استک.

<br>

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/homow.png" width="90" style="border-radius: 50%;" /><br>
      <b>Humayun</b><br>
      <sub>توسعه‌دهنده بک‌اند · سمت سرور</sub><br>
      <a href="https://github.com/homow">github.com/homow</a>
    </td>
    <td align="center">
      <img src="https://github.com/mardi-niyayesh.png" width="90" style="border-radius: 50%;" /><br>
      <b>mardi‑niyayesh</b><br>
      <sub>توسعه‌دهنده فرانت‌اند · سمت کلاینت</sub><br>
      <a href="https://github.com/mardi-niyayesh">github.com/mardi-niyayesh</a>
    </td>
  </tr>
</table>

---

[🇬🇧 نسخه انگلیسی](./README.md)
[🇬🇧 Read in English](./README.md)
