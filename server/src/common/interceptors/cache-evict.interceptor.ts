import {Observable, tap} from "rxjs";
import {Reflector} from "@nestjs/core";
import {CACHE_EVICT_KEY} from "@/common";
import {CacheService} from "@/modules/cache/cache.service";
import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";

@Injectable()
export class CacheEvictInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly cache: CacheService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    const key: string = this.reflector.getAllAndOverride<string>(CACHE_EVICT_KEY, [
      context.getClass(),
      context.getHandler()
    ]);

    if (!key) return next.handle();

    return next.handle().pipe(
      tap(() => {
        this.cache.del(key).then(() => {}).catch(() => console.error(`Internal Server Error in: ${CacheEvictInterceptor.name}`, key));
      })
    );
  }
}