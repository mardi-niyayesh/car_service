import {Prisma, User} from "@/modules/prisma/generated/client";
import {UserAccess, RolesAndPermissions, ListWithCount} from "@/types";

/** User type without password */
export type SafeUser = Omit<User, "password">;

/** user with role[] and permission[] */
export type UserRolePermission = SafeUser & RolesAndPermissions;

/** user safe type responses in db */
export type UserResponse = {
  user: UserRolePermission;
}

/** login response type */
export interface LoginResponse extends UserResponse {
  accessToken: string;
}

/** login user type */
export type LoginUserSchemaType = { user: SafeUser & RolesAndPermissions; accessToken: string; };

/** role include payload in prisma */
type RoleIncludePayload = {
  include: {
    rolePermissions: {
      include: { permission: true }
    }
  }
}

/** role full include type in prisma */
export type RoleIncludeType = Prisma.RoleGetPayload<RoleIncludePayload>;

/** user full role type in prisma */
export type UserRoleIncludeType = Prisma.UserGetPayload<{
  include: {
    userRoles: {
      include: {
        role: RoleIncludePayload
      }
    }
  };
  omit: {
    password: true;
  }
}>;

/** modify roles types in users services */
export interface ModifyRoleServiceParams {
  actionPayload: UserAccess;
  userId: string;
  rolesId: string[];
  action: "revoke" | "assign";
}

/** users list reponse */
export type UsersListResponse = ListWithCount<{ users: UserRolePermission[] }>;