import z from "zod";
import {createZodDto} from "nestjs-zod";
import {CreateRoleValidator} from "./create.dto";

/** Update role validator */
export const UpdateRoleValidator = CreateRoleValidator
  .pick({
    ownership: true,
    description: true,
    name: true,
  })
  .extend({
    deletePermissions: z.array(z.uuidv4({message: "Invalid permission ID format. Please provide a valid UUID."}))
      .transform(ids => [...new Set(ids)]),

    additionalPermissions: z.array(z.uuidv4({message: "Invalid permission ID format. Please provide a valid UUID."}))
      .transform(ids => [...new Set(ids)]),
  })
  .partial()
  .refine(data =>
      data.name ||
      data.ownership ||
      data.description ||
      data.deletePermissions ||
      data.additionalPermissions,
    {
      path: ['name', 'ownership', 'description', 'deletePermissions', 'additionalPermissions'],
      error: 'Either name, ownership, description, deletePermissions or additionalPermissions must be provided',
    }
  );

/** Update role validator */
export type UpdateRoleType = z.infer<typeof UpdateRoleValidator>;

/** Update role dto for swagger */
export class UpdateRoleDto extends createZodDto(UpdateRoleValidator) {}