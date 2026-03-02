import {paramCacheKey} from "@/lib";
import {Observable, tap} from "rxjs";
// import {AccessRequest} from "@/types";
import {Reflector} from "@nestjs/core";
// import {CacheService} from "@/modules/cache/cache.service";
import {CACHEABLE_METADATA, type CacheableDecoratorTypes} from "@/common";
import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";

@Injectable()
export class CacheableInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    // private readonly cache: CacheService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    // const req = context.switchToHttp().getRequest<AccessRequest>();

    const cacheableData = this.reflector.getAllAndOverride<CacheableDecoratorTypes>(CACHEABLE_METADATA, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!cacheableData) return next.handle();

    return next.handle().pipe(
      tap(() => {
        const {self, resource, paramKey, ttl} = cacheableData;

        const key: string = paramCacheKey({ctx: context, paramKey, resource, self});

        const body = context.switchToHttp().getResponse<Response>().body;

        console.log(ttl);
        console.log(key);
        console.log(body);

        // this.cache.set(key, );
      })
    );
  }
}