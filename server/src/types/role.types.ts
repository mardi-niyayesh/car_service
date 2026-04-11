import {UserAccess} from "@/types/request.types";
import {ListWithCount} from "@/types/response.types";
import {Prisma, Role} from "@/modules/prisma/generated/client";

/** role with permission[] type */
export type RoleResponse = Role & {
  permissions: { id: string; name: string }[];
};

/** type for find one role response */
export interface FindOneRoleRes {
  role: RoleResponse;
}

export type FindAllRolesRes = ListWithCount<{
  roles: RoleResponse[];
  count: number;
}>;

type RolePolicyMode = 'update' | 'delete';

/** role modified policy params type */
export interface RolePolicyParams {
  role: RoleResponse;
  actionPermissions: UserAccess['permissions']
  mode: RolePolicyMode;
}

/** role permissions modified policy params type */
export interface RolePermissionPolicyParams {
  mode: RolePolicyMode | 'create';
  permissions: string[];
  actionPermissions: UserAccess['permissions'];
}

/** role include payload in prisma */
export type RoleIncludePayload = {
  include: {
    rolePermissions: {
      include: { permission: true }
    }
  }
}

/** role full include type in prisma */
export type RoleIncludeType = Prisma.RoleGetPayload<RoleIncludePayload>;