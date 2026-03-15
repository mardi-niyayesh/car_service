import {z} from 'zod';
import {ApiQueryOptions} from "@nestjs/swagger";

/** validator for one role query */
export const FindOneRoleValidator = z.object({
  id: z.uuidv4(),
  name: z.string()
});

/** typeof Validator for one role query */
export type FindOneRoleValidatorType = z.infer<typeof FindOneRoleValidator>;

export const FindOneRoleNameQuery: ApiQueryOptions = {
  type: "string",
  required: false,
  name: 'name',
};