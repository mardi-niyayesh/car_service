import * as Modules from "./modules";
import {APP_GUARD} from "@nestjs/core";
import {ScheduleModule} from "@nestjs/schedule";
import {CacheModule} from "@nestjs/cache-manager";
import {redisStore} from "cache-manager-ioredis-yet";
import {throttlerConfig, ONE_MINUTE_MS} from "@/lib";
import {EventEmitterModule} from "@nestjs/event-emitter";
import {ThrottlerModule, ThrottlerGuard} from "@nestjs/throttler";
import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AccessTokenGuard, PermissionGuard, ClientInfoMiddleware} from "./common";

@Module({
  imports: [
    // Throttler Module -Rate Limits
    ThrottlerModule.forRoot(throttlerConfig),

    // Cache Manager
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          host: '127.0.0.1',
          port: process.env.REDIS_PORT!,
          ttl: ONE_MINUTE_MS * 5 // 5 minutes
        })
      })
    }),

    // Event Emitter -Events
    EventEmitterModule.forRoot(),

    // Scheduler Module -Corn Jobs
    ScheduleModule.forRoot(),
    Modules.SchedulerModule,

    // Cli Modules -for scripts
    Modules.CliModule,

    // Email Module
    Modules.EmailModule,

    // Core App Modules
    Modules.PrismaModule,
    Modules.AuthModule,
    Modules.UsersModule,
    Modules.RolesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClientInfoMiddleware).forRoutes("*");
  }
}