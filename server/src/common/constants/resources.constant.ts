import {Prisma} from "@/modules/prisma/generated/client";

export type Resource = Uncapitalize<Prisma.ModelName>;

export type PrismaModels = Prisma.TypeMap["meta"]['modelProps'];

export type FindDynamicDelegate = {
  creator_id: string | null;
};

interface DynamicDelegateArgs {
  where: {
    id: string | undefined
  }
  include?: Record<string, unknown>;
}

export type ReturnDynamicDelegate = null | FindDynamicDelegate;

export type DynamicDelegate = {
  findUnique: (args: DynamicDelegateArgs) => Promise<ReturnDynamicDelegate>;
};