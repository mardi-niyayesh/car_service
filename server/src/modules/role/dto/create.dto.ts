import z from "zod";
import {FindOneRoleRes} from "@/types";
import {createZodDto} from "nestjs-zod";
import {testRoleExample} from "./role.delete";
import {OwnerShipValidator, getBaseOkResponseSchema, getNormalErrorResponse, getZodErrorBody} from "@/common";

/** validator */
export const CreateRoleValidator = OwnerShipValidator.extend({
  permissions: z.array(z.uuidv4({message: "Invalid permission ID format. Please provide a valid UUID."}))
    .nonempty({message: "Permissions field cannot be empty. Please add at least one permission ID."})
    .transform(ids => [...new Set(ids)]),

  name: z.string()
    .regex(/^[a-zA-Z0-9_]+$/, {message: "Name can only contain English letters, numbers, and underscores."})
    .min(2, {message: "Name must be at least 2 characters long."})
    .max(100, {message: "Name cannot exceed 100 characters."}),

  description: z.string().min(10).max(500).optional(),
});

/** Type of validator */
export type CreateRoleType = z.infer<typeof CreateRoleValidator>;

/** example body for swagger */
export class CreateRoleDto extends createZodDto(CreateRoleValidator) {}

export class OkCreateRoleRes extends getBaseOkResponseSchema<FindOneRoleRes>({
  path: "roles",
  create: true,
  response: {
    message: "role successfully created.",
    data: {
      role: testRoleExample
    }
  }
}) {}

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

/** forbidden exception example for swagger */
export class CreateRoleForbidden extends getNormalErrorResponse({
  path: 'roles',
  statusCode: 403,
  message: "you cannot create a new role with base Permissions(owner.all, user.self)",
  error: "Permission Denied, base permission"
}) {}