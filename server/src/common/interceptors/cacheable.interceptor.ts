import {map, Observable} from "rxjs";
import {Reflector} from "@nestjs/core";
import {CACHEABLE_KEY, type CacheableDecoratorType} from "@/common";
import {RedisService} from "@/modules/redis/redis.service";
import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";

@Injectable()
export class CacheableInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    const cacheableKey = this.reflector.getAllAndOverride<CacheableDecoratorType>(CACHEABLE_KEY, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!cacheableKey) return next.handle();

    return next.handle().pipe(
      map(async data => {

        return data;
      })
    );
  }
}