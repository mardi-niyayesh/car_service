import z from "zod";
import {createZodDto} from "nestjs-zod";
import {OwnerShipValidator} from "@/common";

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