import z from "zod";
import {createZodDto} from "nestjs-zod";
import {CarSlugValidator} from "../../car/dto";

/** add to cart validator */
export const AddToCartValidator = z.object({
  car_slug: CarSlugValidator,

  description: z
    .string()
    .min(5)
    .max(500)
    .optional(),

  start_date: z.date(),

  end_date: z.date(),
});

/** typeof add to cart validator */
export type AddToCartType = z.infer<typeof AddToCartValidator>;

/** add to cart swagger dto */
export class AddToCartDto extends createZodDto(AddToCartValidator) {}