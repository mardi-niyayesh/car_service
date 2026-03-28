import {LoginUserSchemaType} from "@/types";
import {loginResponseSchema} from "./auth.login";
import {getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";

const path = "auth/refresh";

/** 200 response */
export class RefreshUsersOkResponse extends getBaseOkResponseSchema<LoginUserSchemaType>({
  path,
  create: false,
  response: {
    message: "accessToken successfully created.",
    data: loginResponseSchema,
  }
}) {}

/** 401 response */
export class RefreshUsersUnAuthResponse extends getNormalErrorResponse({
  message: 'Invalid or expired refresh token',
  error: 'Invalid refreshToken',
  path,
  statusCode: 401
}) {}

/** 403 response */
export class RefreshForbiddenResponse extends getNormalErrorResponse({
  message: "Refresh token already revoked",
  error: "RefreshToken is Revoked",
  statusCode: 403,
  path
}) {}