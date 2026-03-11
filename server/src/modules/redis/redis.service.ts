import Redis from "ioredis";
import {ConfigService} from "@nestjs/config";
import {ONE_MINUTE_MS} from "@/lib/utils/date";
import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private readonly db: number;
  private readonly port: number;
  private readonly host: string;
  private readonly prefix: string;
  private readonly defaultTTL: number;

  constructor(readonly config: ConfigService) {
    this.db = Number(this.config.get<string>("REDIS_DB")) || 0;
    this.host = this.config.get<string>("REDIS_HOST") || '127.0.0.1';
    this.prefix = (config.get<string>("REDIS_KEY_PREFIX") ?? "app") + ":";
    this.port = Number(this.config.get<string>("REDIS_PORT")) || 6379;
    this.defaultTTL = ONE_MINUTE_MS * 5;
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
    return this.client.set(key, JSON.stringify(value), "PX", ttl ?? this.defaultTTL);
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

  async getKeyPrefix(prefix: string): Promise<string[]> {
    const [_nextCursor, keys] = await this.client.scan(0, 'MATCH', `*${prefix}*`);
    return keys;
  }

  /** delete many values with key prefix */
  async deletePrefix(prefix: string): Promise<number | null> {
    const keys: string[] = await this.getKeyPrefix(prefix);

    if (!keys.length) return null;

    return await this.delete(...keys);
  }
}