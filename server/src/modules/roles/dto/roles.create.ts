import z from "zod";
import {createZodDto} from "nestjs-zod";
import {getZodErrorBody} from "@/common";

/** validator */
export const CreateRoleValidator = z.object({
  permissions: z.array(z.uuidv4({message: "Invalid permission ID format. Please provide a valid UUID."}))
    .nonempty({message: "Permissions field cannot be empty. Please add at least one permission ID."})
    .transform(ids => [...new Set(ids)]),

  name: z.string()
    .regex(/^[a-zA-Z0-9_]+$/, {message: "Name can only contain English letters, numbers, and underscores."})
    .min(2, {message: "Name must be at least 2 characters long."})
    .max(100, {message: "Name cannot exceed 100 characters."})
});

/** Type of validator */
export type CreateRoleType = z.infer<typeof CreateRoleValidator>;

/** example body for swagger */
export class CreateRoleDto extends createZodDto(CreateRoleValidator) {}

/** bad request example */
export class CreateRoleBadRequest extends getZodErrorBody({
  path: 'roles',
  errors: [
    {
      field: "permissions",
      error: "Permissions field cannot be empty. Please add at least one permission ID."
    },
    {
      field: "name",
      error: "Name can only contain English letters, numbers, and underscores."
    },
    {
      field: "name",
      error: "Name must be at least 2 characters long."
    }
  ]
}) {}