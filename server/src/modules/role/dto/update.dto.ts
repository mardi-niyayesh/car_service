import z from "zod";
import {createZodDto} from "nestjs-zod";
import {getZodErrorBody} from "@/common";
import {CreateRoleValidator} from "./create.dto";

/** Update role validator */
export const UpdateRoleValidator = CreateRoleValidator
  .pick({
    description: true,
    name: true,
  })
  .extend({
    ownership: z.literal(false),
    deletePermissions: z.array(z.uuidv4({message: "Invalid permission ID format. Please provide a valid UUID."}))
      .transform(ids => [...new Set(ids)]),

    additionalPermissions: z.array(z.uuidv4({message: "Invalid permission ID format. Please provide a valid UUID."}))
      .transform(ids => [...new Set(ids)]),
  })
  .partial()
  .refine(data =>
      data.name ||
      data.description ||
      data.ownership === false ||
      data.deletePermissions?.length ||
      data.additionalPermissions?.length,
    {
      path: ['name', 'ownership', 'description', 'deletePermissions', 'additionalPermissions'],
      error: 'Either name, ownership, description, deletePermissions or additionalPermissions must be provided',
    }
  );

/** Update role validator */
export type UpdateRoleType = z.infer<typeof UpdateRoleValidator>;

/** Update role dto for swagger */
export class UpdateRoleDto extends createZodDto(UpdateRoleValidator) {}

/** bad request example response */
export class UpdateRoleBadReq extends getZodErrorBody({
  path: "roles/id",
  errors: [
    {
      field: "description",
      error: "Invalid input: expected string, received boolean"
    },
    {
      field: "name",
      error: "Invalid input: expected string, received number"
    },
    {
      field: "deletePermissions",
      error: "Invalid input: expected array, received string"
    },
    {
      field: "additionalPermissions",
      error: "Invalid input: expected array, received number"
    }
  ]
}) {}