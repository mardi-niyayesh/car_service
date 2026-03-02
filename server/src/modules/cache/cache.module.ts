import {ONE_MINUTE_MS} from "@/lib";
import {Module} from "@nestjs/common";
import {CacheService} from "./cache.service";
import {redisStore} from "cache-manager-ioredis-yet";
import {CacheModule as RedisCache} from "@nestjs/cache-manager";

@Module({
  imports: [
    RedisCache.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          host: process.env.REDIS_HOST!,
          db: Number(process.env.REDIS_DB) || undefined,
          port: Number(process.env.REDIS_PORT!),
          ttl: ONE_MINUTE_MS * 5 // 5 minutes
        })
      })
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}