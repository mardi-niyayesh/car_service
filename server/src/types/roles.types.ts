import type {Role} from "@/modules/prisma/generated/client";

export type RoleResponse = Role & {
  permissions: string[];
};