import {Prisma} from "@/modules/prisma/generated/client";

export type Resource = Uncapitalize<Prisma.ModelName>;