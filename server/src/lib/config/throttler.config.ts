import {ONE_MINUTE_MS} from "@/lib";
import type {ThrottlerModuleOptions} from "@nestjs/throttler";

const isProduction: boolean = process.env.NODE_ENV === "production";

const blockDuration: number = isProduction ? ONE_MINUTE_MS * 5 : ONE_MINUTE_MS;

export const throttlerConfig: ThrottlerModuleOptions = {
  throttlers: [{
    ttl: isProduction ? ONE_MINUTE_MS : ONE_MINUTE_MS / 6,
    limit: isProduction ? 10 : 20,
    blockDuration
  }],
  errorMessage: (): string => `Too many requests. Try again ${blockDuration / ONE_MINUTE_MS} minutes later.`,
};