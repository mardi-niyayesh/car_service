import Redis from "ioredis";
import {ConfigService} from "@nestjs/config";
import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private readonly db: number;
  private readonly port: number;
  private readonly host: string;
  private readonly prefix: string;

  constructor(readonly config: ConfigService) {
    this.db = Number(this.config.get<string>("REDIS_DB")) || 0;
    this.host = this.config.get<string>("REDIS_HOST") || '127.0.0.1';
    this.prefix = (config.get<string>("REDIS_KEY_PREFIX") ?? "app") + ":";
    this.port = Number(this.config.get<string>("REDIS_PORT")) || 6379;
  }

  onModuleInit(): void {
    this.client = new Redis({
      db: this.db,
      host: this.host,
      port: this.port,
      keyPrefix: this.prefix,
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
  set<T>(key: string, value: T, ttl?: number): Promise<"OK"> {
    const stringValue: string = JSON.stringify(value);

    if (ttl === undefined) return this.client.set(key, stringValue);

    return this.client.set(key, stringValue, "PX", ttl);
  }

  /** get cache value with key */
  async get<T>(key: string): Promise<T | null> {
    const value: string | null = await this.client.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  /** delete many cache value with key */
  delete(...keys: string[]): Promise<number> {
    return this.client.del(...keys);
  }

  /** get all keys with prefix */
  getKeyPrefix(keyPrefix: string): Promise<string[] | null> {
    return this.client.keys(`${this.prefix}${keyPrefix}*`);
  }

  /** delete many values with key prefix */
  async deletePrefix(prefix: string): Promise<number | null> {
    const keys: string[] | null = await this.getKeyPrefix(prefix);

    if (keys === null || keys.length === 0) return null;

    // clean prefix in start
    const cleanKeys: string[] = this.cleanPrefix(...keys);

    return await this.delete(...cleanKeys);
  }

  cleanPrefix(...keys: string[]): string[] {
    return keys.map(k => k.startsWith(this.prefix) ? k.split(this.prefix)[1] : k);
  }
}