import {UserAccess, RolesAndPermissions} from "@/types";
import {Prisma, User} from "@/modules/prisma/generated/client";

/** User type without password */
export type SafeUser = Omit<User, "password">;

/** user safe type responses in db */
export type UserResponse = {
  user: SafeUser & RolesAndPermissions;
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