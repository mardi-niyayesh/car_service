import type {PrismaMock} from "@/types";
import {CategoryService} from "./category.service";
import {afterEach, beforeEach, describe} from "vitest";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";

describe('CategoryService', (): void => {
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

  /** ================================================
   * Find One
   * ================================================
   */
  describe('findOne()', (): void => {
    const mockCategoryId = 'cat-456';
    const mockDate = new Date();

    const mockCategory = {
      id: mockCategoryId,
      created_at: mockDate,
      updated_at: mockDate,
      name: 'SUV',
      slug: 'suv',
      description: 'Sport Utility Vehicle category',
      creator_id: 'user-123',
    };

  });
});