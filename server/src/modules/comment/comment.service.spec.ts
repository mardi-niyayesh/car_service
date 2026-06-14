import type {PrismaMock} from "@/types";
import {CommentService} from "./comment.service";
import {EventEmitter2} from "@nestjs/event-emitter";
import {afterEach, beforeEach, describe} from "vitest";
import {RedisService} from "@/modules/redis/redis.service";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {DeepMockProxy, mockDeep, mockReset} from "vitest-mock-extended";

describe('CommentService', (): void => {
  let prisma: PrismaMock;
  let service: CommentService;
  let event: DeepMockProxy<EventEmitter2>;
  let redis: DeepMockProxy<RedisService>;

  beforeEach((): void => {
    redis = mockDeep<RedisService>();
    event = mockDeep<EventEmitter2>();
    prisma = mockDeep<PrismaService>();

    service = new CommentService(redis, prisma, event);
  });

  afterEach((): void => {
    mockReset(redis);
    mockReset(event);
    mockReset(prisma);
  });
});