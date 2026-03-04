import {Resource} from "@/common";
import type {AccessRequest, BaseException} from "@/types";
import {ExecutionContext, InternalServerErrorException} from "@nestjs/common";

export class RedisKey {
  private static readonly prefix: string = process.env.REDIS_KEY_PREFIX?.trim() || 'app';

  /**
   * Builds a Redis key with the format: {prefix}:{resource}:{part1}:{part2}:...
   * If no meaningful parts are provided, returns the pattern {prefix}:{resource}:list
   *
   * @example
   * RedisKey.build('users')           → "app:users:list"
   * RedisKey.build('users', '123')    → "app:users:123"
   * RedisKey.build('users', '')       → "app:users:list"   (empty after trim)
   */
  static build(resource: string, ...parts: (string | undefined | number)[]): string {
    const cleanParts = parts
      .filter(p => p !== undefined && p !== null)
      .map(p => p.toString().trim())
      .filter(Boolean);

    const base: string = `${this.prefix}:${resource}`;

    return cleanParts.length === 0
      ? `${base}:list`
      : `${base}:${cleanParts.join(':')}`;
  }

  /** Builds users key or pattern
   * @example
   * RedisKey.users()        → "app:users:list"
   * RedisKey.users("123")   → "app:users:123"
   * RedisKey.users("123", " ")   → "app:users:123"
   */
  static users(id?: string): string {
    return this.build("users", id);
  }
}

export interface ParamCacheKeyType {
  ctx: ExecutionContext;
  resource: Resource;
  self?: boolean;
  paramsKey?: string[] | null;
  pagination?: boolean;
}

export function paramCacheKey({ctx, resource, self = false, paramsKey = null, pagination = false}: ParamCacheKeyType): string {
  const parts: string[] = [];

  const req = ctx.switchToHttp().getRequest<AccessRequest>();

  if (self) {
    const selfId: string = req.user.userId;

    if (!selfId) throw new InternalServerErrorException({
      message: "userId not found in request",
      error: "in paramCacheKey function. when create a cache key",
    } as BaseException);

    parts.push(selfId);
    return RedisKey.build(resource, ...parts);
  }

  if (Array.isArray(paramsKey) && paramsKey.length > 0) {
    const params: string[] = paramsKey.map(p => Array.isArray(req.params[p])
      ? `${p}=${req.params[p][0]}`
      : `${p}=${req.params[p]}`
    );
    parts.push(...params);
  }

  if (pagination) {
    const page = (req.query.page === undefined || req.query.page === null) ? "1" : req.query.page as string;
    const limit = (req.query.limit === undefined || req.query.limit === null) ? "10" : req.query.limit as string;
    const orderBy = (req.query.orderBy === undefined || req.query.orderBy === null) ? "desc" : req.query.orderBy as string;
    parts.push(`p=${page}`, `l=${limit}`, `o=${orderBy}`);
  }

  const key = RedisKey.build(resource, ...parts);

  console.log(key);

  return key;
}