import z from "zod";
import {createZodDto} from "nestjs-zod";
import {BaseUserSchema} from "./users.validators";

export const UpdateProfileValidator = BaseUserSchema.pick({
  age: true,
  display_name: true
});

export type UpdateProfileType = z.infer<typeof UpdateProfileValidator>;

export class UpdateProfileDto extends createZodDto(UpdateProfileValidator) {}