import z from "zod";
import {createZodDto} from "nestjs-zod";
import {BaseUserSchema} from "./users.validators";

/** update password body */
export const UpdatePasswordValidator = BaseUserSchema.pick({
  password: true
});

/** update password body type */
export type UpdatePasswordType = z.infer<typeof UpdatePasswordValidator>;

/** update password swagger schema */
export class  UpdatePasswordDto extends createZodDto(UpdatePasswordValidator) {}