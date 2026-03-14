import type {Role} from "@/modules/prisma/generated/client";

/** role with permission[] type */
export type RoleResponse = Role & {
  permissions: string[];
};