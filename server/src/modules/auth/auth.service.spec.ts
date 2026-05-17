import {DeepMockProxy} from "vitest-mock-extended";
import {PrismaService} from "@/modules/prisma/prisma.service";

type PrismaMock = DeepMockProxy<PrismaService>;