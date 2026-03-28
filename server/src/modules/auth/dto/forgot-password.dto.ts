import z from "zod";
import {createZodDto} from "nestjs-zod";
import {BaseUserSchema} from "@/modules/user/dto/validators.dto";
import {getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";

export type ForgotApiResponse = { email: string; time: string; timeNumber: number; };

/** base validator */
export const ForgotPassword = BaseUserSchema.pick({
  email: true
});

/** type base validator */
export type ForgotPasswordType = z.infer<typeof ForgotPassword>;

/** schema for swagger */
export class ForgotPasswordSchema extends createZodDto(ForgotPassword) {}

const path = "/auth/forgot-password";

export class OkForgotPasswordRes extends getBaseOkResponseSchema<ForgotApiResponse>({
  path,
  response: {
    message: "Email sent successfully, Please check your inbox",
    data: {
      email: "user@exmaple.com",
      time: "15 minutes left",
      timeNumber: 15
    }
  }
}) {}

export class NotFoundUserForgotPassRes extends getNormalErrorResponse({
  message: "User not found in database",
  path,
  statusCode: 404,
  error: "User Not Found"
}) {}

export class ConflictForgotPasswordRes extends getNormalErrorResponse({
  message: 'A password reset token is already active. Please check your Inbox Email or spam.',
  path,
  statusCode: 409,
  error: "Email Already Send"
}) {}