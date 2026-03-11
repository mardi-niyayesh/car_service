import z from "zod";
import {createZodDto} from "nestjs-zod";
import {BaseUserSchema} from "./users.validators";
import {getBaseErrorBodyResponseSchema} from "@/common";

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