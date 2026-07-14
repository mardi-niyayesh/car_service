import type {PrismaMock} from "@/types";
import {PaymentService} from "./payment.service";
import {describe, beforeEach, afterEach} from "vitest";
import {RedisService} from "@/modules/redis/redis.service";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {type DeepMockProxy, mockDeep, mockReset} from "vitest-mock-extended";

describe('PaymentService', (): void => {
  let prisma: PrismaMock;
  let service: PaymentService;
  let redis: DeepMockProxy<RedisService>;

  // Start All
  beforeEach((): void => {
    redis = mockDeep<RedisService>();
    prisma = mockDeep<PrismaService>();
    service = new PaymentService(prisma, redis);

    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
  });

  afterEach((): void => {
    mockReset(redis);
    mockReset(prisma);
  });
});
