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

  async deleteAction(key: string, action: 'delete' | 'deletePrefix') {
    try {
      if (action === 'delete') {
        await this.redisService.delete(key);
      } else {
        await this.redisService.deletePrefix(key);
      }
    } catch (e) {
      throw new InternalServerErrorException({
        message: (e as Error).message ?? (e as Error).cause ?? 'error in cache-evict.interceptor while deleting a cache key',
        error: (e as Error).name ?? 'error in deleting cache',
      } as BaseException);
    }
  }

  intercept(ctx: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    const cacheParams = this.reflector.getAllAndOverride<CacheEvictDecorator>(CACHE_EVICT_KEY, [
      ctx.getClass(),
      ctx.getHandler()
    ]);

    if (!cacheParams) return next.handle();

    return next.handle().pipe(
      map(async data => {

        if ('resource' in cacheParams && !('findPrefix' in cacheParams)) {

          // if cache params exist
          if (cacheParams?.force) {
            const finalKey = `*${cacheParams.resource}*`;
            await this.deleteAction(finalKey, 'deletePrefix');
            return data;
          }

          if (cacheParams?.forcePagination) {
            const finalKey = `*${cacheParams.resource}:list*`;
            await this.deleteAction(finalKey, 'deletePrefix');
            return data;
          }

          const key: string = RedisKey.keyPrefix({
            ctx,
            self: cacheParams.self,
            query: cacheParams.query,
            resource: cacheParams.resource,
            paramsKey: cacheParams.paramsKey,
            extraKeys: cacheParams.extraKeys,
          });

          if (cacheParams.prefixAfterBuildKey) {
            const finalKey = `*${key}*`;
            await this.deleteAction(finalKey, 'deletePrefix');
            return data;
          } else {
            await this.deleteAction(key, 'delete');
            return data;
          }
        }

        if ('prefix' in cacheParams && cacheParams.prefix?.trim()) {
          const finalKey = `*${cacheParams.prefix}*`;
          await this.deleteAction(finalKey, 'deletePrefix');
          return data;
        }

        if ('findPrefix' in cacheParams) {
          const req = ctx.switchToHttp().getRequest<Request>();
          const keyParam: string = cacheParams.findPrefix.param;
          const rawParam: string | string[] = req.params[keyParam];
          const paramValue: string = Array.isArray(rawParam) ? rawParam[0] : rawParam;

          if ('resource' in cacheParams) {

            if (cacheParams.findPrefix.extraKeys?.length) {
              const extraKeys: string = cacheParams.findPrefix.extraKeys.join(":");

              const finalKey = `*${cacheParams.resource}:${extraKeys}:${keyParam}=${paramValue}*`;
              await this.deleteAction(finalKey, 'deletePrefix');
              return data;

            } else {
              const replaceKey = cacheParams.findPrefix.paramKeyReplace;

              if (replaceKey) {
                const finalKey = cacheParams.findPrefix?.listOrSingle === 'single'
                  ? `*${cacheParams.resource}:${replaceKey}=${paramValue}*`
                  : `*${cacheParams.resource}:${replaceKey}=${paramValue}*:list`;

                await this.deleteAction(finalKey, 'deletePrefix');
                return data;
              }

              const finalKey = `*${cacheParams.resource}:${paramValue}:list*`;
              await this.deleteAction(finalKey, 'deletePrefix');
              return data;
            }

          } else {
            const finalKey = `*${paramValue}*`;
            await this.deleteAction(finalKey, 'delete');
            return data;
          }
        }

        return data;
      })
    );
  }
}
