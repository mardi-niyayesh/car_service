import {Inject, Injectable} from "@nestjs/common";
import {Cache, CACHE_MANAGER} from "@nestjs/cache-manager";

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cache.get(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<T> {
    return await this.cache.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }
}