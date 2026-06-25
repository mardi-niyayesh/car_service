import {mockDeep, mockReset} from "vitest-mock-extended";
import {describe, afterEach, beforeEach} from "vitest";
import {PrismaMock} from "@/types";
import {FavoriteService} from "./favorite.service";
import {PrismaService} from "@/modules/prisma/prisma.service";

describe('FavoriteService', (): void => {
  let prisma: PrismaMock;
  let service: FavoriteService;

  beforeEach((): void => {
    prisma = mockDeep<PrismaService>();
    service = new FavoriteService(prisma);
    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
  });

  afterEach((): void => {
    mockReset(prisma);
  });
});
