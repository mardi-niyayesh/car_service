import z from "zod";

/** get one user validator */
export const GetOneUserValidator = z.object({
  id: z.uuidv4().optional(),
  email: z.email().optional(),
}).refine(data => data.email || data.id, {
  error: 'Either email or id must be provided',
  path: ['email', 'id'],
});

/** get one user validator types */
export type GetOneUserType = z.infer<typeof GetOneUserValidator>;