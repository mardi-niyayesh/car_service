import z from 'zod';

/** base user schema */
export const BaseUserSchema = z.object({
  email: z.email(),
  password: z.string()
    .min(6)
    .max(20)
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]+$/,
      {error: "password must contain at least one letter and one number"}
    ),
  display_name: z.string().min(3).max(40).optional(),
  age: z.number().min(0).max(120).optional(),
});