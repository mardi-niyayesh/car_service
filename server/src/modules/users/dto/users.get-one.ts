import z from "zod";
import {ApiQueryOptions} from "@nestjs/swagger";

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

export const GetOneUserEmailQuery: ApiQueryOptions = {
  type: "string",
  required: false,
  name: 'email',
  format: 'email',
  pattern: GetOneUserValidator.shape.email._zod.pattern.source
};

export const GetOneUserIdQuery: ApiQueryOptions = {
  type: "string",
  required: false,
  name: 'id',
  format: 'uuid',
  pattern: GetOneUserValidator.shape.id._zod.pattern.source
};