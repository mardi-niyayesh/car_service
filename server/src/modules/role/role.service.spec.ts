import type {PrismaMock} from "@/types";
import {describe, beforeEach, afterEach} from "vitest";
import {RoleService} from "@/modules/role/role.service";
import {mockDeep, mockReset} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";

describe('RoleService', (): void => {
  let prisma: PrismaMock;
  let service: RoleService;

  // Start All
  beforeEach((): void => {
    prisma = mockDeep<PrismaService>();
    service = new RoleService(prisma);

    prisma.$transaction.mockImplementation(async (fn) => fn(prisma));
  });

  // Reset All
  afterEach((): void => {
    mockReset(prisma);
  });
});