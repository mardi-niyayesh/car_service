import type {AccessRequest} from "@/types";
import {ExecutionContext} from "@nestjs/common";

export class RedisKey {
  private static readonly prefix: string = process.env.REDIS_KEY_PREFIX?.trim() || 'app';

  /**
   * Builds a Redis key with the format: {prefix}:{resource}:{part1}:{part2}:...
   * If no meaningful parts are provided, returns the pattern {prefix}:{resource}:*
   *
   * @example
   * RedisKey.build('users')           → "app:users:*"
   * RedisKey.build('users', '123')    → "app:users:123"
   * RedisKey.build('users', '')       → "app:users:*"   (empty after trim)
   */
  static build(resource: string, ...parts: (string | undefined | number)[]): string {
    const cleanParts = parts
      .filter(p => p !== undefined && p !== null)
      .map(p => p.toString().trim())
      .filter(Boolean);

    const base: string = `${this.prefix}:${resource}`;

    return cleanParts.length === 0
      ? `${base}:*`
      : `${base}:${cleanParts.join(':')}`;
  }

  /** Builds users key or pattern
   * @example
   * RedisKey.users()        → "app:users:*"
   * RedisKey.users("123")   → "app:users:123"
   * RedisKey.users("123", " ")   → "app:users:123"
   */
  static users(id?: string): string {
    return this.build("users", id);
  }
}

interface ParamCacheKeyType {
  ctx: ExecutionContext;
  resource: string;
  self: boolean;
  paramKey: string | null;
}

export function paramCacheKey(params: ParamCacheKeyType) {
  const {ctx, resource, self, paramKey} = params;

  const req = ctx.switchToHttp().getRequest<AccessRequest>();

  if (self) return RedisKey.build(resource, req.user.userId);

  if (paramKey === null) return RedisKey.build(resource);

  const rawParam: string | string[] = req.params[paramKey];

  const param: string = Array.isArray(rawParam) ? rawParam[0] : rawParam;

  return RedisKey.build(resource, param);
}