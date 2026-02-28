import {ONE_MINUTE_MS, isProduction} from "@/lib";
import type {ThrottlerModuleOptions} from "@nestjs/throttler";

const BLOCK_DURATION: number = ONE_MINUTE_MS * 5;

export const throttlerConfig: ThrottlerModuleOptions = {
  throttlers: [{
    ttl: isProduction ? ONE_MINUTE_MS : ONE_MINUTE_MS / 2,
    limit: isProduction ? 10 : 15,
    blockDuration: isProduction ? ONE_MINUTE_MS * 5 : ONE_MINUTE_MS * 10,
  }],
  errorMessage: (): string => `Too many requests. Try again ${BLOCK_DURATION / ONE_MINUTE_MS} minutes later.`,
};