import type {PrismaMock} from "@/types";
import {CarService} from "@/modules/car/car.service";
import {beforeEach, describe, afterEach} from "vitest";
import {exampleSafeCarRecord} from "@/modules/car/dto";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";

describe('CarService', (): void => {
  let prisma: PrismaMock;
  let service: CarService;

  beforeEach((): void => {
    prisma = mockDeep<PrismaService>();
    service = new CarService(prisma);
    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
  });

  afterEach((): void => {
    mockReset(prisma);
  });

  /** ================================================
   * Find One
   *  ================================================
   */
  describe('findOne()', (): void => {
    const mockSlug = 'bmw-x5-2024';
    const mockDate = new Date();
    const mockCarWithCategory = exampleSafeCarRecord;
  });
});