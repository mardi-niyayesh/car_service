import {paramCacheKey} from "@/lib";
import {Observable, tap} from "rxjs";
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
      tap(() => {
        const {self, paramKey, resource} = cacheParams;
        const key: string = paramCacheKey({ctx, self, paramKey, resource});
        this.cache.del(key).then(() => {}).catch(() => console.error(`Internal Server Error in: ${CacheEvictInterceptor.name}`, key));
      })
    );
  }
}