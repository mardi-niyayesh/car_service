import {SetMetadata} from "@nestjs/common";
import {type ParamCacheKeyType} from "@/lib";

export const CACHE_EVICT_KEY = "CACHE_EVICT_KEY";

type CacheEvictDecoratorForce = Omit<ParamCacheKeyType, "ctx"> & {
  force?: boolean;
  prefix?: never;
};

type CacheEvictDecoratorPrefix = Omit<ParamCacheKeyType, "resource" | 'ctx'> & {
  force?: never;
  prefix?: string;
};

interface FindPrefix {
  param: string;
}

type CacheEvictDecoratorFindPrefix = Omit<CacheEvictDecoratorPrefix, "prefix"> & {
  findPrefix: FindPrefix;
};

export type CacheEvictDecorator = CacheEvictDecoratorPrefix | CacheEvictDecoratorForce | CacheEvictDecoratorFindPrefix;

/** Build Key Cache for Delete
 * @example
 - @CacheEvict({
 self: false,
 paramKey: "id",
 resource: "users"
 })

 * @return
 * ["app:users:id"]
 * */
export function CacheEvict(params: CacheEvictDecorator) {
  return SetMetadata(CACHE_EVICT_KEY, params);
}