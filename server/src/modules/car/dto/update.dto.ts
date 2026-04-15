import z from "zod";
import {createZodDto} from "nestjs-zod";
import {CreateCarValidator} from "./create.dto";
import {getNormalErrorResponse} from "@/common";

/** Update car validator */
export const UpdateCarValidator = CreateCarValidator.omit({
  ownership: true,
  can_rent: true,
}).extend({
  ownership: z.literal(false),
  can_rent: z.boolean(),
}).partial().refine(data =>
    Object.keys(data).length > 0,
  {
    error: "At least one field must be provided to update a car.",
    path: [
      'name',
      'slug',
      'tags',
      'company',
      'can_rent',
      'ownership',
      'category_id',
      'description',
      'price_at_hour',
    ],
  }
);

/** type of update car validator */
export type UpdateCarType = z.infer<typeof UpdateCarValidator>;

/** example swagger body */
export class UpdateCarDto extends createZodDto(UpdateCarValidator) {}

export class NotFoundUpdateCarRes extends getNormalErrorResponse({
  message: 'Car does not exists in database, please make sure and try again',
  error: 'Car not found',
  path: 'cars/id',
  statusCode: 404
}) {}