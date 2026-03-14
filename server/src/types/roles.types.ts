import type {Role} from "@/modules/prisma/generated/client";

export interface RoleResponse {
  role: Role & {
    permissions: string[];
  };
}