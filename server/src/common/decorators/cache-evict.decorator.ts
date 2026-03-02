import {SetMetadata} from "@nestjs/common";
import {type ParamCacheKeyType} from "@/lib";

export const CACHE_EVICT_KEY = "CACHE_EVICT_KEY";

export type CacheEvictDecoratorType = Omit<ParamCacheKeyType, "ctx">;

/** Build Key Cache for Delete
 * @example
 - @CacheEvict("users", "id")
 * */
export function CacheEvict(params: CacheEvictDecoratorType) {
  return SetMetadata(CACHE_EVICT_KEY, params);
}