import {Inject, Injectable} from "@nestjs/common";
import {Cache, CACHE_MANAGER} from "@nestjs/cache-manager";

@Injectable()
export class CacheService {
  private static readonly key: string = process.env.REDIS_KEY_PREFIX?.trim() || "app";

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  prefix(key: string): string {
    if (key.startsWith(CacheService.key)) return key;
    return `${process.env.REDIS_KEY_PREFIX || "app"}:${key}`;
  }

  async get<T>(key: string): Promise<T | undefined> {
    console.log(this.prefix(key));
    return await this.cache.get(this.prefix(key));
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<T> {
    return await this.cache.set(this.prefix(key), value, ttl);
  }

  async del(key: string): Promise<boolean> {
    return await this.cache.del(this.prefix(key));
  }

  async delMany(keys: string[]): Promise<boolean> {
    const prefixKeys: string[] = keys.map(k => this.prefix(k));
    return await this.cache.mdel(prefixKeys);
  }
}