import {Redis} from "ioredis";
import {Injectable} from "@nestjs/common";
import {Cache} from "@nestjs/cache-manager";

@Injectable()
export class CacheService {
  constructor(private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cache.get(key);
  }

  getPrefix(key: string) {
    return this.cache.stores.keys();
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

  // async delForce(key: string): Promise<boolean> {
  //   return await this.cache.stores.map(s => s.useKeyPrefix())
  // }
}