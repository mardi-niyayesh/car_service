import {RedisKey} from "@/lib";
import {Reflector} from "@nestjs/core";
import {map, Observable, from} from "rxjs";
import {RedisService} from "@/modules/redis/redis.service";
import {CACHEABLE_KEY, type CacheableDecoratorType} from "@/common";
import {CallHandler, ExecutionContext, Injectable, InternalServerErrorException, NestInterceptor} from "@nestjs/common";
import {BaseException} from "@/types";

@Injectable()
export class CacheableInterceptor<T> implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async intercept(ctx: ExecutionContext, next: CallHandler<T>): Promise<Observable<T> | Observable<Promise<T>>> {
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
      query: cacheableKey.query,
    });

    // check exist cached
    const cacheValue = await this.redisService.get<T>(key);

    // exist cached
    if (cacheValue !== null) return from([cacheValue]);

    return next.handle().pipe(
      map(async data => {

        try {
          // set value with key
          await this.redisService.set(key, data, cacheableKey.ttl);
        } catch (e) {
          throw new InternalServerErrorException({
            message: (e as Error).message ?? (e as Error).cause ?? 'error in cacheable.interceptor',
            error: (e as Error).name ?? 'error in setting cache',
          } as BaseException);
        }

        return data;
      })
    );
  }
}