import z from "zod";

export const CreateRoleValidator = z.object({
  permissions: z.array(z.uuidv4({error: "Invalid permission ID format"}))
    .nonempty()
    .transform(ids => [...new Set(...ids)]),
  name: z.string()
    .regex(/^[a-zA-Z0-9_]+$/, "Name can only contain English letters, numbers, and underscores.")
    .min(2),
});

export type CreateRoleType = z.infer<typeof CreateRoleValidator>;