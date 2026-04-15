import z from "zod";
import {createZodDto} from "nestjs-zod";
import {CreateCarValidator} from "./create.dto";

/** Update car validator */
export const UpdateCarValidator = CreateCarValidator.omit({
  ownership: true
}).extend({
  ownership: z.literal(false)
}).partial().refine(data =>
    Object.keys(data).length > 0,
  {
    error: issue => issue.message,
    params: [
      'name',
      'slug',
      'tags',
      'company',
      'can_rent',
      'ownership',
      'category_id',
      'description',
      'price_at_hour',
    ]
  }
);

export type UpdateCarType = z.infer<typeof UpdateCarValidator>;

export class UpdateCarDto extends createZodDto(UpdateCarValidator) {}