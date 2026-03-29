import {Prisma} from "@/modules/prisma/generated/client";

export type Resource = Uncapitalize<Prisma.ModelName>;

export type PrismaModels = Prisma.TypeMap["meta"]['modelProps'];

export type FindDynamicDelegate = {
  creator: string | null;
};

interface DynamicDelegateArgs {
  where: {
    id: string | undefined
  }
}

export type DynamicDelegate = {
  findUnique: (args: DynamicDelegateArgs) => Promise<undefined | FindDynamicDelegate>;
};