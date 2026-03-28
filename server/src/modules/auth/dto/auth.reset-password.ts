import z from "zod";
import {createZodDto} from "nestjs-zod";
import {BaseUserSchema} from "@/modules/user/dto/user.validators";
import {getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";

export const ResetPassword = BaseUserSchema.pick({
  password: true
}).extend({
  token: z.string().length(128, {error: 'Token must be exactly 128 characters long'}),
});

export type ResetPasswordType = z.infer<typeof ResetPassword>;

export class ResetPasswordSchema extends createZodDto(ResetPassword) {}

const path = "auth/reset-password";

export class OkResetPasswordRes extends getBaseOkResponseSchema<void>({
  path,
  response: {
    message: "Password reset successfully",
  }
}) {}

export class BadRequestResetPasswordRes extends getNormalErrorResponse({
  message: "The reset password token has expired. Please request a new one.",
  path,
  statusCode: 400,
  error: "Token Expired",
}) {}

export class NotFoundResetPasswordRes extends getNormalErrorResponse({
  message: "Reset password token is invalid or has expired.",
  error: "Token Not Found",
  path,
  statusCode: 404,
}) {}