import {RedisKey} from "@/lib";
import {map, Observable} from "rxjs";
import type {Request} from "express";
import {BaseException} from "@/types";
import {Reflector} from "@nestjs/core";
import {RedisService} from "@/modules/redis/redis.service";
import {CACHE_EVICT_KEY, type CacheEvictDecorator} from "@/common";
import {CallHandler, ExecutionContext, Injectable, InternalServerErrorException, NestInterceptor} from "@nestjs/common";

@Injectable()
export class CacheEvictInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  intercept(ctx: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    const cacheParams = this.reflector.getAllAndOverride<CacheEvictDecorator>(CACHE_EVICT_KEY, [
      ctx.getClass(),
      ctx.getHandler()
    ]);

    if (!cacheParams) return next.handle();

    return next.handle().pipe(
      map(async data => {

        if ('resource' in cacheParams && !('findPrefix' in cacheParams)) {
          if (cacheParams?.force) {
            try {
              await this.redisService.deletePrefix(`*${cacheParams.resource}*`);
              return data;
            } catch (e) {
              throw new InternalServerErrorException({
                message: (e as Error).message ?? (e as Error).cause ?? 'error in cache-evict.interceptor while deleting a resource cache',
                error: (e as Error).name ?? 'error in deleting cache',
              } as BaseException);
            }
          }

          const key: string = RedisKey.keyPrefix({
            ctx,
            resource: cacheParams.resource,
            pagination: cacheParams.pagination,
            query: cacheParams.query,
            self: cacheParams.self,
            paramsKey: cacheParams.paramsKey,
            extraKeys: cacheParams.extraKeys,
          });

          try {
            await this.redisService.delete(key);
          } catch (e) {
            throw new InternalServerErrorException({
              message: (e as Error).message ?? (e as Error).cause ?? 'error in cache-evict.interceptor while deleting a cache key',
              error: (e as Error).name ?? 'error in deleting cache',
            } as BaseException);
          }
        }

        if ('prefix' in cacheParams && cacheParams.prefix?.trim()) {
          try {
            await this.redisService.deletePrefix(`*${cacheParams.prefix}*`);
          } catch (e) {
            throw new InternalServerErrorException({
              message: (e as Error).message ?? (e as Error).cause ?? 'error in cache-evict.interceptor while deleting a prefix cache',
              error: (e as Error).name ?? 'error in deleting cache',
            } as BaseException);
          }
        }

        if ('findPrefix' in cacheParams) {
          const req = ctx.switchToHttp().getRequest<Request>();
          const rawReqPrefix = req.params[cacheParams.findPrefix.param];
          const reqPrefix: string = Array.isArray(rawReqPrefix) ? rawReqPrefix[0] : rawReqPrefix;

          await this.redisService.deletePrefix(`*${reqPrefix}*`);

          if ('resource' in cacheParams) {
            await this.redisService.deletePrefix(`*${cacheParams.resource}:list*`);
          }
        }

        return data;
      })
    );
  }
}