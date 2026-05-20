import {ConfigService} from "@nestjs/config";
import type {DeepMockProxy} from "vitest-mock-extended";
import type {PrismaService} from "@/modules/prisma/prisma.service";
import {Mock} from "vitest";

export type PrismaMock = DeepMockProxy<PrismaService> & {
  $transaction: Mock;
};
export type ConfigMock = DeepMockProxy<ConfigService>;