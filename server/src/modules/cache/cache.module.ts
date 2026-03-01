import {ONE_MINUTE_MS} from "@/lib";
import {Module} from "@nestjs/common";
import {redisStore} from "cache-manager-ioredis-yet";
import {CacheModule as RedisCache} from "@nestjs/cache-manager";

@Module({
  imports: [
    RedisCache.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          host: '127.0.0.1',
          port: process.env.REDIS_PORT!,
          ttl: ONE_MINUTE_MS * 5 // 5 minutes
        })
      })
    }),
  ]
})
export class CacheModule {}