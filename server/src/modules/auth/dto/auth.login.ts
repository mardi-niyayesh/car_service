import z from "zod";
import {exampleDate} from "@/lib";
import {createZodDto} from "nestjs-zod";
import {LoginUserSchemaType} from "@/types";
import {BaseUserSchema} from "@/modules/users/dto/users.validators";
import {getZodErrorBody, getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";

/** login users schema */
export const LoginUser = BaseUserSchema.pick({
  email: true,
  password: true,
}).extend({
  remember: z.boolean().optional().default(false),
});

/** login users schema type */
export type LoginUserInput = z.infer<typeof LoginUser>;

/** login users schema example */
export class LoginUserSchema extends createZodDto(LoginUser) {}

export const loginResponseSchema: LoginUserSchemaType = {
  user: {
    id: "7b0cfb3e-34fd-4607-bf49-2c99bd46698a",
    email: "john@example.com",
    display_name: "john",
    age: 20,
    created_at: exampleDate,
    updated_at: exampleDate,
    roles: ["self"],
    permissions: ["user.self"]
  },
  accessToken: "accessToken",
};

const path = "auth/login";

export class LoginUserOkResponse extends getBaseOkResponseSchema<LoginUserSchemaType>({
  path,
  response: {
    message: "user logged in successfully",
    data: loginResponseSchema,
  }
}) {}

/** bad request example for login user */
export class LoginUserBadRequestResponse extends getZodErrorBody({
  path,
  errors: [
    {
      field: "email",
      error: "Invalid email address"
    },
    {
      field: "password",
      error: "Too small: expected string to have >=6 characters"
    },
    {
      field: "password",
      error: "password must contain at least one letter and one number"
    },
    {
      field: "remember",
      error: "Invalid input: expected boolean, received string",
    }
  ],
}) {}

export class LoginUserInvalidAuthResponse extends getNormalErrorResponse({
  message: "Invalid user credentials",
  error: "Invalid Credentials",
  path,
  statusCode: 401
}) {}