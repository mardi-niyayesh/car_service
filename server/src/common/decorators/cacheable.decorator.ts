import {SetMetadata} from "@nestjs/common";
import {type ParamCacheKeyType} from "@/lib";

export const CACHEABLE_KEY = "CACHEABLE_KEY";

export type CacheableDecoratorType = Omit<ParamCacheKeyType, "ctx">;

/** Build Key Cache for set a new cache
 * @example
 - @CacheEvict({
 self: false,
 paramKey: "id",
 resource: "users"
 })

 * @return
 * "app:users:id"
 * */
export function Cacheable(params: CacheableDecoratorType) {
  return SetMetadata(CACHEABLE_KEY, params);
}