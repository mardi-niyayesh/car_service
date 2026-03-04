import {Injectable} from "@nestjs/common";
import {Cache} from "@nestjs/cache-manager";

@Injectable()
export class CacheService {
  private static readonly key: string = process.env.REDIS_KEY_PREFIX || "app";

  constructor(private readonly cache: Cache) {}

  prefix(key: string): string {
    if (key.startsWith(CacheService.key)) return key;
    return `${process.env.REDIS_KEY_PREFIX || "app"}:${key}`;
  }

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cache.get(this.prefix(key));
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<T> {
    return await this.cache.set(th, value, ttl);
  }

  async del(key: string): Promise<boolean> {
    return await this.cache.del(key);
  }

  async delMany(keys: string[]): Promise<boolean> {
    return await this.cache.mdel(keys);
  }
}