import {afterEach, beforeEach, describe} from "vitest";
import type {PrismaMock} from "@/types";
import {CartService} from "@/modules/cart/cart.service";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";

describe('CartService', (): void => {
  let prisma: PrismaMock;
  let service: CartService;

  beforeEach((): void => {
    prisma = mockDeep<PrismaService>();
    service = new CartService(prisma);
  });

  afterEach((): void => {
    mockReset(prisma);
  });
});