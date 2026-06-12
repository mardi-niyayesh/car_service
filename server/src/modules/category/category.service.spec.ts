import type {PrismaMock} from "@/types";
import {CategoryService} from "./category.service";
import {afterEach, beforeEach, describe} from "vitest";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";

describe('CategoryService', () => {
  let prisma: PrismaMock;
  let service: CategoryService;

  beforeEach((): void => {
    prisma = mockDeep<PrismaService>();
    service = new CategoryService(prisma);
    prisma.$transaction.mockImplementation(async fn => fn(prisma));
  });

  afterEach((): void => {
    mockReset(prisma);
  });
});