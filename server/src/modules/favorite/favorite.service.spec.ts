import type {PrismaMock} from "@/types";
import {FavoriteService} from "./favorite.service";
import {describe, afterEach, beforeEach} from "vitest";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";

describe('FavoriteService', (): void => {
  let prisma: PrismaMock;
  let service: FavoriteService;

  beforeEach((): void => {
    prisma = mockDeep<PrismaService>();
    service = new FavoriteService(prisma);
  });

  afterEach((): void => {
    mockReset(prisma);
  });
});
