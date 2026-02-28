export class RedisKey {
  private static prefix: string = process.env.REDIS_KEY_PREFIX || 'app';

  /** Builds a Redis key with the format: {prefix}:{resource}:{...parts} */
  static build(resource: string, ...parts: string[]): string {
    const cleanParts = parts.filter(Boolean).map(p => p.toString().trim());
    return `${RedisKey.prefix}:${resource}:${cleanParts.join(':')}`;
  }

  /** Builds users key or pattern (e.g. app:users:123 or app:users:*) */
  static users(id?: string): string {
    return RedisKey.build("users", id || "*");
  }
}