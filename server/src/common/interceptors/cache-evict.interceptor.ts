import {RedisKey} from "@/lib";
import {map, Observable} from "rxjs";
import type {Request} from "express";
import {Reflector} from "@nestjs/core";
import type {BaseException} from "@/types";
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
            const finalKey = `*${cacheParams.prefix}*`;
            await this.redisService.deletePrefix(finalKey);
          } catch (e) {
            throw new InternalServerErrorException({
              message: (e as Error).message ?? (e as Error).cause ?? 'error in cache-evict.interceptor while deleting a prefix cache',
              error: (e as Error).name ?? 'error in deleting cache',
            } as BaseException);
          }
        }

        if ('findPrefix' in cacheParams) {
          const req = ctx.switchToHttp().getRequest<Request>();
          const keyParam: string = cacheParams.findPrefix.param;
          const rawParam: string | string[] = req.params[keyParam];
          const paramValue: string = Array.isArray(rawParam) ? rawParam[0] : rawParam;

          if ('resource' in cacheParams) {

            if (cacheParams.findPrefix.extraKeys?.length) {
              const extraKeys: string = cacheParams.findPrefix.extraKeys.join(":");

              const finalKey = `*${cacheParams.resource}:${extraKeys}:${keyParam}=${paramValue}:list*`;
              await this.redisService.deletePrefix(finalKey);

            } else {
              const finalKey = `*${cacheParams.resource}:${paramValue}:list*`;
              await this.redisService.deletePrefix(finalKey);
            }

          } else {
            const finalKey = `*${paramValue}*`;
            await this.redisService.deletePrefix(finalKey);
          }
        }

        return data;
      })
    );
  }
}