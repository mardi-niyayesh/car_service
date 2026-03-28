import z from "zod";
import {createZodDto} from "nestjs-zod";
import {BaseUserSchema} from "./users.validators";
import {getZodErrorBody, getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";

/** update password body */
export const UpdatePasswordValidator = z.object({
  oldPassword: BaseUserSchema.shape.password,
  newPassword: BaseUserSchema.shape.password,
}).refine( data => data.newPassword !== data.oldPassword, {
  error: "New password must be different from old password",
  path: ['newPassword'],
});

/** update password body type */
export type UpdatePasswordType = z.infer<typeof UpdatePasswordValidator>;

/** update password swagger schema */
export class UpdatePasswordDto extends createZodDto(UpdatePasswordValidator) {}

const path = 'users/password';

/** ok example response */
export class OkUpdatePasswordRes extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: 'User password updated successfully.'
  }
}) {}

/** bad request response example */
export class UpdatePasswordBadReqRes extends getZodErrorBody({
  path,
  errors: [
    {
      field: "password",
      error: "Invalid input: expected string, received number"
    }
  ]
}) {}

/** unauthorized response example */
export class UnauthorizedUpdatePasswordRes  extends getNormalErrorResponse({
  path,
  statusCode: 401,
  message: "The provided old password does not match.",
  error: "Invalid old password."
}) {}