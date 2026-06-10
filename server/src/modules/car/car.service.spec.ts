import type {PrismaMock} from "@/types";
import {CarService} from "@/modules/car/car.service";
import {beforeEach, describe, afterEach} from "vitest";
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
});