import {UserAccess, BaseTokens} from "@/types";
import {User} from "@/modules/prisma/generated/client";

/** User type without password */
export type SafeUser = Omit<User, "password">;

/** user safe type responses in db */
export type UserResponse = {
  user: SafeUser & BaseTokens;
}

/** login response type */
export interface LoginResponse extends UserResponse {
  accessToken: string;
}

/** login user type */
export type LoginUserSchemaType = { user: SafeUser & BaseTokens; accessToken: string; };

/** modify roles types in users services */
export interface ModifyRoleServiceParams {
  actionPayload: UserAccess;
  userId: string;
  rolesId: string[];
  action: "revoke" | "assign";
}