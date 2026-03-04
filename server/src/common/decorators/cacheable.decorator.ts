import {SetMetadata} from "@nestjs/common";
import {type ParamCacheKeyType} from "@/lib";

export const CACHEABLE_KEY = "CACHEABLE_KEY";

export type CacheableDecoratorType = Omit<ParamCacheKeyType, "ctx"> & {
  ttl?: number;
};

/** Build Key Cache for set a new cache
 * @example
 - @Cacheable({
 self: false,
 paramKey: "id",
 resource: "users",
 ttl: 60_000 in millisecond
 })

 * @return
 * "app:users:id"
 * */
export function Cacheable(params: CacheableDecoratorType) {
  return SetMetadata(CACHEABLE_KEY, params);
}