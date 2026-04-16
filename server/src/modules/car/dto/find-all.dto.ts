import z from "zod";
import type {CarsResponse} from "@/types";
import {exampleCarRecord} from "./create.dto";
import type {ApiQueryOptions} from "@nestjs/swagger";
import {getBaseOkResponseSchema, BasePaginationValidator} from "@/common";

const minPrice = 0;

export const FindAllCarValidator = z.object({
  price_at_hour: z.coerce.number()
    .int()
    .min(minPrice)
    .optional()
    .default(minPrice)
    .catch(minPrice),

  in_rent: z.coerce.boolean()
    .default(false)
    .optional()
    .catch(false),

  can_rent: z.coerce.boolean()
    .default(true)
    .optional()
    .catch(true),
}).extend(BasePaginationValidator.shape);

export type FindAllCarValidatorType = z.infer<typeof FindAllCarValidator>;

/** ok example response for find all cars */
export class FindAllCarOkRes extends getBaseOkResponseSchema<CarsResponse>({
  path: 'cars',
  response: {
    message: 'cars successfully found.',
    data: {
      count: 5,
      cars: Array.from({length: 5}, () => exampleCarRecord)
    }
  }
}) {}

export const priceFindAllCarQuery: ApiQueryOptions = {
  type: 'integer',
  default: minPrice,
  minimum: minPrice,
  required: false,
  name: 'price_at_hour',
  description: 'filter query for car of price_at_hour',
  schema: {
    type: 'integer',
    default: minPrice,
    minimum: minPrice
  }
};

export const inRentFindAllCarQuery: ApiQueryOptions = {
  type: 'boolean',
  default: false,
  required: false,
  name: 'in_rent',
  description: 'filter query for car of in_rent',
  schema: {
    type: 'boolean',
    default: false,
  }
};

export const canRentFindAllCarQuery: ApiQueryOptions = {
  type: 'boolean',
  default: true,
  required: false,
  name: 'can_rent',
  description: 'filter query for car of can_rent',
  schema: {
    type: 'boolean',
    default: true,
  }
};