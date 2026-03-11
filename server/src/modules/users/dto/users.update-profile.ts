import z from "zod";
import {createZodDto} from "nestjs-zod";
import {BaseUserSchema} from "./users.validators";

export const UpdateProfileValidator = BaseUserSchema.pick({
  age: true,
  display_name: true
}).partial().refine(data => data.age || data.display_name, {
  error: 'Either age or display_name must be provided',
  path: ['age', 'display_name'],
});

export type UpdateProfileType = z.infer<typeof UpdateProfileValidator>;

export class UpdateProfileDto extends createZodDto(UpdateProfileValidator) {}