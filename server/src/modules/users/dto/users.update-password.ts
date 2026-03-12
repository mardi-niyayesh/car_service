import z from "zod";
import {createZodDto} from "nestjs-zod";
import {BaseUserSchema} from "./users.validators";
import {getBaseErrorBodyResponseSchema, getNormalErrorResponse} from "@/common";

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


/** bad request response example */
export class UpdatePasswordBadReqRes extends getBaseErrorBodyResponseSchema({
  path: 'users/password',
  errors: [
    {
      field: "password",
      error: "Invalid input: expected string, received number"
    }
  ]
}) {}

export class UnauthorizedUpdatePasswordRes  extends getNormalErrorResponse({
  path: 'users/password',
  statusCode: 401,
  message: "The provided old password does not match.",
  error: "Invalid old password."
}) {}