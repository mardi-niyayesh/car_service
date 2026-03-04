import Redis from "ioredis";
import {ONE_MINUTE_MS} from "@/lib";
import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import {asyncWrapProviders} from "node:async_hooks";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      db: Number(process.env.REDIS_DB) || 0,
      port: Number(process.env.REDIS_PORT) || 6379,
    });

    this.client.on("connect", () => {
      console.log("Redis Connected Successfully✅");
    });

    this.client.on("error", e => {
      console.log("Redis Error⛔: ", e);
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}