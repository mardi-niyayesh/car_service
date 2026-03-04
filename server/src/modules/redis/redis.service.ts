import Redis from "ioredis";
import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  onModuleInit(): void {
    this.client = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      db: Number(process.env.REDIS_DB) || 0,
      port: Number(process.env.REDIS_PORT) || 6379,
      keyPrefix: process.env.REDIS_KEY_PREFIX?.trim() + ":" || "app:",
    });

    this.client.on("connect", () => {
      console.log("Redis Connected Successfully✅");
    });

    this.client.on("error", e => {
      console.log("Redis Error⛔: ", e);
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }

  /** set cache value with key */
  async set<T>(key: string, value: T, ttl?: number): Promise<"OK"> {
    const stringValue: string = JSON.stringify(value);
    if (ttl === undefined) return await this.client.set(key, stringValue);
    return await this.client.set(key, stringValue, "PX", ttl);
  }

  /** get cache value with key */
  async get<T>(key: string): Promise<T | null> {
    const value: string | null = await this.client.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  /** delete many cache value with key */
  async delete(...keys: string[]): Promise<number> {
    return await this.client.del(...keys);
  }

  /** get all keys with prefix */
  async getKeyPrefix(keyPrefix: string): Promise<string[] | null> {
    return await this.client.keys(`${keyPrefix}*`);
  }

  /** delete many values with key prefix */
  async deletePrefix(prefix: string): Promise<number | null> {
    const keys: string[] | null = await this.getKeyPrefix(prefix);
    if (keys === null) return keys;
    return await this.client.del(...keys);
  }
}