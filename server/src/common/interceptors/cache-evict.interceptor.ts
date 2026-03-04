import {paramCacheKey} from "@/lib";
import {map, Observable} from "rxjs";
import {Reflector} from "@nestjs/core";
import {CacheService} from "@/modules/cache/cache.service";
import {CACHE_EVICT_KEY, type CacheEvictDecoratorType} from "@/common";
import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";

@Injectable()
export class CacheEvictInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly cache: CacheService,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    const cacheParams: CacheEvictDecoratorType = this.reflector.getAllAndOverride<CacheEvictDecoratorType>(CACHE_EVICT_KEY, [
      ctx.getClass(),
      ctx.getHandler()
    ]);

    if (!cacheParams) return next.handle();

    return next.handle().pipe(
      map(async data => {
        const keys: string[] = cacheParams.filter(k => !k.force).map(k => paramCacheKey({
          ctx, self: k.self, paramsKey: k.paramsKey, resource: k.resource
        }));

        const forceKeys = cacheParams.filter(k => k.force);

        console.log(await this.cache.get("users"));

        await this.cache.delMany(keys);

        return data;
      })
    );
  }
}