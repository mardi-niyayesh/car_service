import {SetMetadata} from "@nestjs/common";
import {type ParamCacheKeyType} from "@/lib";

export const CACHE_EVICT_KEY = "CACHE_EVICT_KEY";

type CacheEvictDecoratorBaseType = Omit<ParamCacheKeyType, "ctx"> & {
  force?: boolean;
}

export type CacheEvictDecoratorType = CacheEvictDecoratorBaseType[];

/** Build Key Cache for Delete
 * @example
 - @CacheEvict({
 self: false,
 paramKey: "id",
 resource: "users"
 })

 * @return
 * "app:users:id"
 * */
export function CacheEvict(params: CacheEvictDecoratorType) {
  return SetMetadata(CACHE_EVICT_KEY, params);
}