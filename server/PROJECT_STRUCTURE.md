# 📁 Project Structure - Car Service (NestJS)

```
server-root/
├── 📁 src/
│   ├── 📁 common/
│   │   ├── 📁 constants/
│   │   │   ├── 📄 common.ts
│   │   │   ├── 📄 event-emitter.constant.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 permission.constant.ts
│   │   │   ├── 📄 resources.constant.ts
│   │   │   ├── 📄 role.constant.ts
│   │   │   └── 📄 routes.constant.ts
│   │   ├── 📁 decorators/
│   │   │   ├── 📄 cacheable.decorator.ts
│   │   │   ├── 📄 cache-evict.decorator.ts
│   │   │   ├── 📄 client-info.decorator.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 permission.decorator.ts
│   │   │   └── 📄 public.decorator.ts
│   │   ├── 📁 dto/
│   │   │   ├── 📄 common.dto.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 pagination.dto.ts
│   │   │   └── 📄 uuidV4.dto.ts
│   │   ├── 📁 filters/
│   │   │   ├── 📄 http.filter.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 guards/
│   │   │   ├── 📄 access.guard.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 permission.guard.ts
│   │   │   └── 📄 refresh.guard.ts
│   │   ├── 📄 index.ts
│   │   ├── 📁 interceptors/
│   │   │   ├── 📄 cacheable.interceptor.ts
│   │   │   ├── 📄 cache-evict.interceptor.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 logging.interceptor.ts
│   │   │   └── 📄 response.interceptor.ts
│   │   ├── 📁 middlewares/
│   │   │   ├── 📄 client-info.middleware.ts
│   │   │   └── 📄 index.ts
│   │   ├── 📁 pipes/
│   │   │   ├── 📄 index.ts
│   │   │   └── 📄 zod.pipe.ts
│   │   └── 📁 swagger/
│   │       ├── 📄 global-response.swagger.ts
│   │       └── 📄 index.ts
│   │
│   ├── 📁 lib/
│   │   ├── 📁 config/
│   │   │   ├── 📄 common.ts
│   │   │   ├── 📄 index.ts
│   │   │   └── 📄 throttler.config.ts
│   │   ├── 📄 index.ts
│   │   └── 📁 utils/
│   │       ├── 📄 build-email-html.ts
│   │       ├── 📄 common.ts
│   │       ├── 📄 crypto.ts
│   │       ├── 📄 date.ts
│   │       ├── 📄 fs.ts
│   │       ├── 📄 index.ts
│   │       ├── 📄 normalize-client-info.ts
│   │       ├── 📄 prisma-error.ts
│   │       ├── 📄 redis.ts
│   │       ├── 📄 response.ts
│   │       ├── 📄 roles.ts
│   │       └── 📄 users.ts
│   │
│   ├── 📁 modules/
│   │   ├── 📁 auth/
│   │   │   ├── 📄 auth.controller.ts
│   │   │   ├── 📄 auth.module.ts
│   │   │   ├── 📄 auth.service.ts
│   │   │   ├── 📁 decorators/
│   │   │   │   ├── 📄 auth.decorator.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 auth.docs.ts
│   │   │   │   ├── 📄 forgot-password.dto.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 login.dto.ts
│   │   │   │   ├── 📄 logout.dto.ts
│   │   │   │   ├── 📄 refresh.dto.ts
│   │   │   │   ├── 📄 register.dto.ts
│   │   │   │   └── 📄 reset-password.dto.ts
│   │   │   ├── 📄 index.ts
│   │   │   └── 📁 strategy/
│   │   │       └── 📄 access.strategy.ts
│   │   │
│   │   ├── 📁 car/
│   │   │   ├── 📄 car.controller.ts
│   │   │   ├── 📄 car.module.ts
│   │   │   ├── 📄 car.service.ts
│   │   │   ├── 📁 configs/
│   │   │   │   ├── 📄 car-upload.config.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 decorators/
│   │   │   │   ├── 📄 car.decorator.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 car.docs.ts
│   │   │   │   ├── 📄 create.dto.ts
│   │   │   │   ├── 📄 find-all.dto.ts
│   │   │   │   ├── 📄 find-one.dto.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 update.dto.ts
│   │   │   │   └── 📄 upload-image.dto.ts
│   │   │   └── 📄 index.ts
│   │   │
│   │   ├── 📁 cart/
│   │   │   ├── 📄 cart.controller.ts
│   │   │   ├── 📄 cart.module.ts
│   │   │   ├── 📄 cart.service.ts
│   │   │   ├── 📁 decorators/
│   │   │   │   ├── 📄 cart.decorator.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 add-to-cart.dto.ts
│   │   │   │   ├── 📄 cart.docs.ts
│   │   │   │   ├── 📄 get-cart.dto.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   └── 📄 remove-from-cart.dto.ts
│   │   │   └── 📄 index.ts
│   │   │
│   │   ├── 📁 category/
│   │   │   ├── 📄 category.controller.ts
│   │   │   ├── 📄 category.module.ts
│   │   │   ├── 📄 category.service.ts
│   │   │   ├── 📁 decorators/
│   │   │   │   ├── 📄 category.decorator.ts
│   │   │   │   └── 📄 index.ts
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 category.docs.ts
│   │   │   │   ├── 📄 create.dto.ts
│   │   │   │   ├── 📄 delete.dto.ts
│   │   │   │   ├── 📄 find-all.dto.ts
│   │   │   │   ├── 📄 find-one.dto.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   └── 📄 update.dto.ts
│   │   │   └── 📄 index.ts
│   │   │
│   │   ├── 📁 cli/
│   │   │   ├── 📄 cli.module.ts
│   │   │   └── 📄 index.ts
│   │   │
│   │   ├── 📁 comment/
│   │   │   ├── 📄 comment.controller.ts
│   │   │   ├── 📄 comment.module.ts
│   │   │   ├── 📄 comment.service.ts
│   │   │   └── 📄 index.ts
│   │   │
│   │   ├── 📁 email/
│   │   │   ├── 📄 email.module.ts
│   │   │   ├── 📄 email.service.ts
│   │   │   └── 📄 index.ts
│   │   │
│   │   ├── 📄 index.ts
│   │   │
│   │   ├── 📁 permission/
│   │   │   ├── 📁 decorators/
│   │   │   │   ├── 📄 index.ts
│   │   │   │   └── 📄 permission.decorator.ts
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 permission.find-all.ts
│   │   │   │   └── 📄 permission.find.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 permission.controller.ts
│   │   │   ├── 📄 permission.module.ts
│   │   │   └── 📄 permission.service.ts
│   │   │
│   │   ├── 📁 prisma/
│   │   │   ├── 📁 generated/
│   │   │   │   └── 📄 prisma-generated-files.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 prisma.module.ts
│   │   │   └── 📄 prisma.service.ts
│   │   │
│   │   ├── 📁 redis/
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 redis.module.ts
│   │   │   └── 📄 redis.service.ts
│   │   │
│   │   ├── 📁 role/
│   │   │   ├── 📁 decorators/
│   │   │   │   ├── 📄 index.ts
│   │   │   │   └── 📄 role.decorator.ts
│   │   │   ├── 📁 dto/
│   │   │   │   ├── 📄 create.dto.ts
│   │   │   │   ├── 📄 delete.dto.ts
│   │   │   │   ├── 📄 find-all.dto.ts
│   │   │   │   ├── 📄 find.dto.ts
│   │   │   │   ├── 📄 index.ts
│   │   │   │   ├── 📄 role.docs.ts
│   │   │   │   └── 📄 update.dto.ts
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 role.controller.ts
│   │   │   ├── 📄 role.module.ts
│   │   │   └── 📄 role.service.ts
│   │   │
│   │   ├── 📁 scheduler/
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📁 jobs/
│   │   │   │   └── 📄 token-cleaner.jobs.ts
│   │   │   └── 📄 scheduler.module.ts
│   │   │
│   │   └── 📁 user/
│   │       ├── 📁 decorators/
│   │       │   ├── 📄 index.ts
│   │       │   └── 📄 user.decorator.ts
│   │       ├── 📁 dto/
│   │       │   ├── 📄 find-all.dto.ts
│   │       │   ├── 📄 find.dto.ts
│   │       │   ├── 📄 index.ts
│   │       │   ├── 📄 role-assigned.dto.ts
│   │       │   ├── 📄 role-revoked.dto.ts
│   │       │   ├── 📄 update-password.dto.ts
│   │       │   ├── 📄 update-profile.dto.ts
│   │       │   ├── 📄 user.docs.ts
│   │       │   └── 📄 validators.dto.ts
│   │       ├── 📄 index.ts
│   │       ├── 📄 user.controller.ts
│   │       ├── 📄 user.module.ts
│   │       ├── 📄 user.service.spec.ts
│   │       └── 📄 user.service.ts
│   │
│   ├── 📁 types/
│   │   ├── 📄 auth.types.ts
│   │   ├── 📄 car.types.ts
│   │   ├── 📄 cart.types.ts
│   │   ├── 📄 category.types.ts
│   │   ├── 📄 express.d.ts
│   │   ├── 📄 index.ts
│   │   ├── 📄 permission.types.ts
│   │   ├── 📄 request.types.ts
│   │   ├── 📄 response.types.ts
│   │   ├── 📄 role.types.ts
│   │   └── 📄 user.types.ts
│   │
│   ├── 📄 app.module.ts
│   └── 📄 main.ts
│
├── 📁 prisma/
│   ├── 📁 migrations/
│   │   └── 📁 prisma_migrations/
│   └── 📄 schema.prisma
│
├── 📁 public/
│   ├── 📁 html/
│   │   ├── 📄 email.html
│   │   ├── 📄 forgot-password.html
│   │   └── 📄 welcome.html
│   ├── 📁 styles/
│   │   └── 📄 swagger.css
│   └── 📁 uploads/
│       └── 📁 car/
│           └── 🖼️ car-upload-images
│
├── 📁 scripts/
│   ├── 📄 create-database.ts
│   ├── 📄 prisma-sync.ts
│   ├── 📄 prisma-truncate.ts
│   ├── 📄 seed-owner.ts
│   ├── 📄 seed-roles.ts
│   └── 📄 truncate-tables.sql
│
├── 📁 test/
│   └── 📄 vitest.setup.ts
│
├── 📄 PROJECT_STRUCTURE.md
├── 📄 README.FA.md
├── 📄 README.md
├── 📄 eslint.config.mjs
├── 📄 nest-cli.json
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 prisma.config.ts
├── 📄 tsconfig.build.json
├── 📄 tsconfig.json
└── 📄 vitest.config.ts
```