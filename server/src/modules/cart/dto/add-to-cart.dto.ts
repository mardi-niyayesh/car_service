import z from "zod";
import dayjs from "dayjs";
import {createZodDto} from "nestjs-zod";
import {CarSlugValidator} from "../../car/dto";
import IsSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(IsSameOrAfter);

const today = dayjs().startOf('day');
const tomorrow = dayjs(today).add(1, 'day');

/** add to cart validator */
export const AddToCartValidator = z.object({
  car_slug: CarSlugValidator,

  description: z
    .string()
    .min(5)
    .max(500)
    .optional(),

  start_date: z.iso
    .date()
    .refine((dateStr) => dayjs(dateStr).isSameOrAfter(today), {
      error: 'start_date must be today or later'
    }),

  end_date: z.iso
    .date()
    .refine((dateStr) => dayjs(dateStr).isSameOrAfter(tomorrow), {
      error: 'end_date must be at least one day after today'
    }),
});

/** typeof add to cart validator */
export type AddToCartType = z.infer<typeof AddToCartValidator>;

/** add to cart swagger dto */
export class AddToCartDto extends createZodDto(AddToCartValidator) {}