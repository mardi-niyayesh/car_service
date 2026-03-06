import {SafeUser} from "@/types/users.types";
import {RefreshToken} from "@/modules/prisma/generated/client";

/** base token types */
export interface BaseTokens {
  roles: string[];
  permissions: string[];
}

/** AccessToken payload on JWT */
export interface AccessTokenPayload extends BaseTokens {
  sub: string;
  display_name?: string;
  iat?: number;
  exp?: number;
  jti?: string;
}

/** refreshToken Type */
export interface RefreshTokenPayload extends BaseTokens {
  refreshRecord: RefreshToken;
  user: SafeUser;
}