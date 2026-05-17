import {ConfigService} from "@nestjs/config";
import type {DeepMockProxy} from "vitest-mock-extended";
import type {PrismaService} from "@/modules/prisma/prisma.service";

export type PrismaMock = DeepMockProxy<PrismaService>;
export type ConfigMock = DeepMockProxy<ConfigService>;