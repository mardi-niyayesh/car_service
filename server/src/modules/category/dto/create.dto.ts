import z from "zod";
import {createZodDto} from "nestjs-zod";
import {getZodErrorBody, OwnerShipValidator} from "@/common";

/** base category validator */
export const CreateCategoryValidator = OwnerShipValidator.extend({
  name: z.string().min(2).max(100),

  slug: z
    .string()
    .min(2)
    .max(150)
    .regex(/^[a-zA-Z0-9_]+$/, {message: "Name can only contain English letters, numbers, and underscores."}),

  description: z.string().min(10).max(500).optional(),
});

/** type of create category validator */
export type CreateCategoryType = z.infer<typeof CreateCategoryValidator>;

/** swagger body example */
export class CreateCategoryDto extends createZodDto(CreateCategoryValidator) {}

/** bad request example */
export class CreateCategoryBadReq extends getZodErrorBody({
  path: 'categories',
  errors: [
    {
      field: "ownership",
      error: "Invalid input: expected boolean, received number"
    },
    {
      field: "name",
      error: "Invalid input: expected string, received number"
    },
    {
      field: "slug",
      error: "Invalid input: expected string, received number"
    },
    {
      field: "description",
      error: "Invalid input: expected string, received number"
    }
  ]
}) {}