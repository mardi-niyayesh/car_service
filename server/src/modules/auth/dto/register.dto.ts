import z from "zod";
import {exampleDate} from "@/lib";
import {createZodDto} from "nestjs-zod";
import type {UserResponse} from "@/types";
import {BaseUserSchema} from "@/modules/user/dto/user.validators";
import {getBaseOkResponseSchema, getZodErrorBody, getNormalErrorResponse} from "@/common";

/** create user schema */
export const CreateUser = BaseUserSchema.overwrite(data => ({
  ...data,
  display_name: data.display_name?.trim()
}));

/** Create User Type */
export type CreateUserInput = z.infer<typeof BaseUserSchema>;

/** Create User DTO for Swagger */
export class CreateUserSchema extends createZodDto(BaseUserSchema) {}

const path = "auth/register";

/** object for ok response */
export const createUserResponse = {
  path,
  message: "user created successfully",
  create: true,
  data: {
    user: {
      id: "d228cc19-b8c9-41c4-8c70-c2c6effb05ca",
      email: "john@example.com",
      display_name: "John",
      age: 24,
      password: undefined,
      created_at: exampleDate,
      updated_at: exampleDate,
      roles: ["self"],
      permissions: ["user.self"],
    }
  }
};

/** ok example for create user */
export class CreateUserOkResponse extends getBaseOkResponseSchema<UserResponse>({
  path: createUserResponse.path,
  create: createUserResponse.create,
  response: {
    message: createUserResponse.message,
    data: createUserResponse.data
  }
}) {}

/** conflict example for create user */
export class CreateUserConflictResponse extends getNormalErrorResponse({
  message: 'User already exists in database',
  path,
  statusCode: 409,
  error: "Conflict Users"
}) {}

/** bad request example for create user */
export class CreateUserBadRequestResponse extends getZodErrorBody({
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
      field: "display_name",
      error: "Too small: expected string to have >=3 characters"
    },
    {
      field: "age",
      error: "Too big: expected number to be <=120"
    }
  ],
  path,
}) {}