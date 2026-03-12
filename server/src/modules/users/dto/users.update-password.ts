import z from "zod";
import {createZodDto} from "nestjs-zod";
import {BaseUserSchema} from "./users.validators";
import {getBaseErrorBodyResponseSchema} from "@/common";

/** update password body */
export const UpdatePasswordValidator = z.object({
  oldPassword: BaseUserSchema.shape.password,
  newPassword: BaseUserSchema.shape.password,
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