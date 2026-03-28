import z from "zod";
import {SafeUser} from "@/types";
import {createZodDto} from "nestjs-zod";
import {BaseUserSchema} from "./user.validators";
import {createUserResponse} from "@/modules/auth/dto";
import {getZodErrorBody, getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";

/** body in update profile */
export const UpdateProfileValidator = BaseUserSchema.pick({
  age: true,
  display_name: true
}).partial().refine(data => data.age || data.display_name, {
  error: 'Either age or display_name must be provided',
  path: ['age', 'display_name'],
});

/** type body update profile */
export type UpdateProfileType = z.infer<typeof UpdateProfileValidator>;

/** body schema in update profile */
export class UpdateProfileDto extends createZodDto(UpdateProfileValidator) {}

/** ok example for get one user by id */
export class UpdateProfileOkResponse extends getBaseOkResponseSchema<{user: SafeUser}>({
  path: "users/profile",
  create: false,
  response: {
    message: "User profile updated successfully.",
    data: {
      user: {
        id: createUserResponse.data.user.id,
        updated_at: createUserResponse.data.user.updated_at,
        created_at: createUserResponse.data.user.created_at,
        age: createUserResponse.data.user.age,
        email: createUserResponse.data.user.email,
        display_name: createUserResponse.data.user.display_name,
      }
    }
  }
}) {}

/** bad Request response in update profile */
export class UpdateProfileBadReqRes extends getZodErrorBody({
  path: 'users/profile',
  errors: [
    {
      field: "age",
      error: "Invalid input: expected number, received string"
    },
    {
      field: "display_name",
      error: "Invalid input: expected string, received number"
    }
  ]
}) {}

/** conflict response in update profile */
export class UpdateProfileConflictRes extends getNormalErrorResponse({
  path: 'users/profile',
  statusCode: 409,
  message: "No changes detected in the provided data. Please update at least one field.",
  error: "Data Unchanged (age, display_name)"
}) {}