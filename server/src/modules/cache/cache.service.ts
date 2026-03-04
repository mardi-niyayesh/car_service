import {Injectable} from "@nestjs/common";
import {Cache} from "@nestjs/cache-manager";

@Injectable()
export class CacheService {
  constructor(private readonly cache: Cache) {}

  prefix(key: string): string {
    return `${process.env.REDIS_KEY_PREFIX || "app"}:${key}`;
  }

  async get<T>(key: string): Promise<T | undefined> {
    const f = this.cache.stores;
    console.log(f);
    return await this.cache.get(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<T> {
    return await this.cache.set(key, value, ttl);
  }

  async del(key: string): Promise<boolean> {
    return await this.cache.del(key);
  }

  async delMany(keys: string[]): Promise<boolean> {
    return await this.cache.mdel(keys);
  }
}