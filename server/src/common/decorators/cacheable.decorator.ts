import {ParamCacheKeyType} from "@/lib";
import {SetMetadata} from "@nestjs/common";

export const CACHEABLE_METADATA = "CACHEABLE_METADATA";

export type CacheableDecoratorTypes = Omit<ParamCacheKeyType, "ctx"> & {
  ttl: number;
};

/** get key and set or get cacheKey */
export function Cacheable(params: CacheableDecoratorTypes) {
  return SetMetadata(CACHEABLE_METADATA, params);
}