import {RedisKey} from "@/lib";
import {map, Observable} from "rxjs";
import {Reflector} from "@nestjs/core";
import {RedisService} from "@/modules/redis/redis.service";
import {CACHE_EVICT_KEY, type CacheEvictDecoratorType} from "@/common";
import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";

@Injectable()
export class CacheEvictInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    const cacheParams: CacheEvictDecoratorType = this.reflector.getAllAndOverride<CacheEvictDecoratorType>(CACHE_EVICT_KEY, [
      ctx.getClass(),
      ctx.getHandler()
    ]);

    if (!cacheParams || cacheParams.length === 0) return next.handle();

    return next.handle().pipe(
      map(async data => {
        const keys: string[] = cacheParams.filter(k => !k.force).map(k => RedisKey.keyPrefix({
          ctx, self: k.self, paramsKey: k.paramsKey, extraKeys: k.extraKeys, resource: k.resource, pagination: k.pagination
        }));

        const forceKeys = cacheParams.filter(k => k.force).map(k => k.resource);

        if (forceKeys.length > 0) {
          for (const f of forceKeys) await this.redisService.deletePrefix(f);
        }

        if (keys.length > 0) await this.redisService.delete(...keys);

        return data;
      })
    );
  }
}