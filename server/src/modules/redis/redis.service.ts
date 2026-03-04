import Redis from "ioredis";
import {ONE_MINUTE_MS} from "@/lib";
import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private static readonly ttl: number = ONE_MINUTE_MS;

  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      db: Number(process.env.REDIS_DB) || 0,
      port: Number(process.env.REDIS_PORT) || 6379,
      keyPrefix: process.env.REDIS_KEY_PREFIX?.trim() || "app",
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

  /** set cache value with key */
  async set<T>(key: string, value: T, ttl?: number): Promise<"OK"> {
    const stringValue: string = JSON.stringify(value);
    return await this.client.set(key, stringValue, "PX", ttl || RedisService.ttl);
  }

  /** get cache value with key */
  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  /** delete many cache value with key */
  async delete(...key: string[]): Promise<number> {
    return await this.client.del(...key);
  }

  /** get all keys with prefix */
  async getKeyPrefix(keyPrefix: string): Promise<string[] | null> {
    return await this.client.keys(`${keyPrefix}*`);
  }
}