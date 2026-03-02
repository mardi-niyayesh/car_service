import {SetMetadata} from "@nestjs/common";
import {RedisKey} from "@/lib";

export const CACHE_EVICT_KEY = "CACHE_EVICT_KEY";

/** Build Key Cache for Delete
 * @example
 - @CacheEvict("users", "id")
 * */
export function CacheEvict(resource: string, ...args: string[]) {
  const key: string = RedisKey.build(resource, ...args);
  return SetMetadata(CACHE_EVICT_KEY, key);
}