# 📁 Project Structure - Car Service (NestJS)

```
📁 server-root/
├── 📁 src/
│   ├── 📁 common/
│   │   ├── 📁 constants/          # App constants, permissions, roles
│   │   ├── 📁 decorators/         # Custom decorators (Public, Permission, Cacheable)
│   │   ├── 📁 dto/                # Shared DTOs (Pagination, UUID)
│   │   ├── 📁 filters/            # Global exception filter
│   │   ├── 📁 guards/             # Auth & Permission guards
│   │   ├── 📁 interceptors/       # Response, Cache, Logging
│   │   ├── 📁 middlewares/        # Client info middleware
│   │   ├── 📁 pipes/              # Zod validation pipe
│   │   └── 📁 swagger/            # Global Swagger responses
│   │
│   ├── 📁 lib/
│   │   ├── 📁 config/             # App configs (throttler, common)
│   │   └── 📁 utils/              # Helpers (crypto, prisma-error, redis, response)
│   │
│   ├── 📁 modules/
│   │   ├── 📁 auth/               # Authentication module
│   │   ├── 📁 car/                # Car module (example)
│   │   │   ├── 📁 dto/
│   │   │   ├── 📁 decorators/
│   │   │   ├── 📄 car.controller.ts
│   │   │   ├── 📄 car.service.ts
│   │   │   └── 📄 car.module.ts
│   │   ├── 📁 user/               # User module
│   │   ├── 📁 comment/            # Comment module
│   │   └── ...                    # Other modules (cart, category, role, permission, etc.)
│   │
│   ├── 📁 types/                  # Global TypeScript types
│   │
│   ├── 📄 app.module.ts
│   └── 📄 main.ts
│
├── 📁 prisma/
│   ├── 📁 migrations/             # Prisma migration files
│   └── 📄 schema.prisma           # Database schema
│
├── 📁 public/
│   ├── 📁 html/                   # Email templates
│   ├── 📁 styles/                 # Static CSS
│   └── 📁 uploads/                # Uploaded car images
│
├── 📁 scripts/                    # Database seeding & utility scripts
├── 📁 test/                       # Test setup
│
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 nest-cli.json
├── 📄 prisma.config.ts
├── 📄 eslint.config.mjs
└── 📄 vitest.config.ts
```