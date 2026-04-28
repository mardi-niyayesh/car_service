import z from "zod";
import dayjs from "dayjs";
import {exampleDate} from "@/lib";
import {createZodDto} from "nestjs-zod";
import type {CarRentResponse} from "@/types";
import IsSameOrAfter from "dayjs/plugin/isSameOrAfter";
import IsSameOrBefore from "dayjs/plugin/isSameOrBefore";
import {CarSlugValidator, exampleCarRecord} from "../../car/dto";
import {getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";

dayjs.extend(IsSameOrAfter);
dayjs.extend(IsSameOrBefore);

const today = dayjs().startOf('day');
const tomorrow = dayjs(today).add(1, 'day');
const maxEndDate = dayjs(today).add(30, 'day');

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
    })
    .refine((dateStr) => dayjs(dateStr).isSameOrBefore(maxEndDate), {
      error: `end_date cannot be more than 30 days from today (max: ${maxEndDate.format('YYYY-MM-DD')})`
    }),
}).transform((data) => {
  const end = dayjs(data.end_date);
  const start = dayjs(data.start_date);

  return {
    ...data,
    daysCount: end.diff(start, 'days'),
  };
});

/** typeof add to cart validator */
export type AddToCartType = z.infer<typeof AddToCartValidator>;

/** add to cart swagger dto */
export class AddToCartDto extends createZodDto(AddToCartValidator) {}

/** success example response for add to cart */
export class AddToCartOk extends getBaseOkResponseSchema<CarRentResponse>({
  create: true,
  path: '/carts',
  statusCode: 201,
  response: {
    message: 'car rent successfully add to your cart',
    data: {
      carRent: {
        id: "8cabf0eb-ecae-4fe9-a90d-81ed671fb26c",
        created_at: exampleDate,
        updated_at: exampleDate,
        description: "string",
        price: 40000000,
        status: "PENDING",
        start_date: exampleDate,
        end_date: exampleDate,
        car_id: "c8217255-b4b2-4734-a10c-76a1b752693b",
        cart_id: "33d944e3-480b-49d5-82d9-644d288347b0",
        car: exampleCarRecord
      }
    }
  }
}) {}

/** not found example response for add to cart */
export class AddToCartNotFound extends getNormalErrorResponse({
  statusCode: 404,
  path: "/carts",
  message: "This car slug does not exist in database",
  error: "Car slug not found."
}) {}

/** conflict example response for add to cart */
export class AddToCartConflict extends getNormalErrorResponse({
  statusCode: 409,
  path: "/carts",
  message: "The selected car is already rented for all or part of the requested period. Please choose different dates or another car.",
  error: "Car Rental Conflict"
}) {}