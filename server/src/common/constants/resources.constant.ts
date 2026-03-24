import {Prisma} from "@/modules/prisma/generated/client";

export type Resource = Uncapitalize<Prisma.ModelName>;

export type PrismaModels = Prisma.TypeMap["meta"]['modelProps'];

export type FindDynamicDelegate = {
  creator: string;
};

export type DynamicDelegate = {
  findUnique: (args: { where: { id: string | undefined } }) => Promise<undefined | FindDynamicDelegate>;
};