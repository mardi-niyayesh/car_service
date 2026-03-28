import {ListWithCount} from "@/types/response.types";
import type {Role} from "@/modules/prisma/generated/client";

/** role with permission[] type */
export type RoleResponse = Role & {
  permissions: string[];
};

/** type for find one role response */
export interface FindOneRoleRes {
  role: RoleResponse;
}

export type FindAllRolesRes = ListWithCount<{
  roles: RoleResponse[];
  count: number;
}>;