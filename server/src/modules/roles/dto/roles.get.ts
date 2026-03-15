import {z} from 'zod';

/** validator for one role query */
export const FindOneRoleValidator = z.object({
  id: z.uuidv4(),
  name: z.string()
});

/** typeof Validator for one role query */
export type FindOneRoleValidatorType = z.infer<typeof FindOneRoleValidator>;
