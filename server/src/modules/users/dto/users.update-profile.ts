import z from "zod";
import {UserResponse} from "@/types";
import {createZodDto} from "nestjs-zod";
import {BaseUserSchema} from "./users.validators";
import {createUserResponse} from "@/modules/auth/dto";
import {getBaseErrorBodyResponseSchema, getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";

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
export class UpdateProfileOkResponse extends getBaseOkResponseSchema<UserResponse>({
  path: "users/profile",
  create: false,
  response: {
    message: "User profile updated successfully.",
    data: createUserResponse.data
  }
}) {}

/** bad Request response in update profile */
export class UpdateProfileBadReqRes extends getBaseErrorBodyResponseSchema({
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