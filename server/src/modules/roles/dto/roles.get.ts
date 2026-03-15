import {z} from 'zod';
import {ApiQueryOptions} from "@nestjs/swagger";

/** validator for one role query */
export const FindOneRoleValidator = z.object({
  id: z.uuidv4(),
  name: z.string()
}).refine(data => data.name || data.id, {
  error: 'Either name or id must be provided',
  path: ['name', 'id'],
});

/** typeof Validator for one role query */
export type FindOneRoleValidatorType = z.infer<typeof FindOneRoleValidator>;

/** name query for find one role */
export const FindOneRoleNameQuery: ApiQueryOptions = {
  type: "string",
  required: false,
  name: 'name',
};