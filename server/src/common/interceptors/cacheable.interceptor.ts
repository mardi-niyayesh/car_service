import {RedisKey} from "@/lib";
import {Reflector} from "@nestjs/core";
import {map, Observable, from} from "rxjs";
import {RedisService} from "@/modules/redis/redis.service";
import {CACHEABLE_KEY, type CacheableDecoratorType} from "@/common";
import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";

@Injectable()
export class CacheableInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async intercept(ctx: ExecutionContext, next: CallHandler<unknown>): Promise<Observable<unknown>> {
    const cacheableKey = this.reflector.getAllAndOverride<CacheableDecoratorType>(CACHEABLE_KEY, [
      ctx.getClass(),
      ctx.getHandler(),
    ]);

    if (!cacheableKey) return next.handle();

    // build key pattern
    const key: string = RedisKey.keyPrefix({
      ctx,
      paramsKey: cacheableKey.paramsKey,
      extraKeys: cacheableKey.extraKeys,
      resource: cacheableKey.resource,
      pagination: cacheableKey.pagination,
      self: cacheableKey.self,
    });

    // check exist cached
    const cacheValue = await this.redisService.get(key);

    // exist cached
    if (cacheValue !== null) return from([cacheValue]);

    return next.handle().pipe(
      map(async data => {

        // set value with key
        await this.redisService.set(key, data, cacheableKey.ttl);

        return data;
      })
    );
  }
}