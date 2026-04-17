import z from "zod";
import type {CarsResponse} from "@/types";
import type {ApiQueryOptions} from "@nestjs/swagger";
import {exampleCarRecord, minPriceAtHourCar, maxPriceAtHourCar} from "./create.dto";
import {getBaseOkResponseSchema, BasePaginationValidator, getSafePaginationValidator} from "@/common";

function checkStringBoolean(value?: string): undefined | boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

const orderByFieldEnum = ['created_at', 'price_at_hour'] as const;

export const FindAllCarValidator = getSafePaginationValidator(z.object({
  price_at_hour_gte: z.coerce.number()
    .int()
    .min(minPriceAtHourCar)
    .max(maxPriceAtHourCar)
    .optional()
    .catch(minPriceAtHourCar),

  price_at_hour_lte: z.coerce.number()
    .int()
    .min(minPriceAtHourCar)
    .max(maxPriceAtHourCar)
    .optional()
    .catch(maxPriceAtHourCar),

  in_rent: z
    .string()
    .optional()
    .transform(v => checkStringBoolean(v)),

  can_rent: z
    .string()
    .optional()
    .transform(v => checkStringBoolean(v)),

  order_by_field: z
    .enum(orderByFieldEnum)
    .optional()
    .default('created_at')
    .catch('created_at')
}).extend(BasePaginationValidator.shape));

export type FindAllCarValidatorType = z.infer<typeof FindAllCarValidator>;

export const findAllCarsQuery = [
  'in_rent',
  'can_rent',
  'order_by_field',
  'price_at_hour_gte',
  'price_at_hour_lte',
];

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

export const priceGteFindAllCarQuery: ApiQueryOptions = {
  type: 'integer',
  minimum: minPriceAtHourCar,
  maximum: maxPriceAtHourCar,
  required: false,
  name: 'price_at_hour_gte',
  description: 'filter query for car of great than equal price_at_hour',
  schema: {
    type: 'integer',
    minimum: minPriceAtHourCar,
    maximum: maxPriceAtHourCar,
  }
};

export const priceLteFindAllCarQuery: ApiQueryOptions = {
  ...priceGteFindAllCarQuery,
  description: 'filter query for car of lessen than equal price_at_hour',
  name: 'price_at_hour_lte',
};

export const inRentFindAllCarQuery: ApiQueryOptions = {
  type: 'boolean',
  required: false,
  name: 'in_rent',
  description: 'filter query for car of in_rent',
  schema: {
    type: 'boolean',
  }
};

export const canRentFindAllCarQuery: ApiQueryOptions = {
  type: 'boolean',
  required: false,
  name: 'can_rent',
  description: 'filter query for car of can_rent',
  schema: {
    type: 'boolean',
  }
};

export const orderByFieldFindAllCarQuery: ApiQueryOptions = {
  deprecated: false,
  type: 'string',
  required: false,
  name: 'order_by_field',
  enum: [...orderByFieldEnum],
  default: 'created_at',
  description: 'sorted by created_at or price_at_hour field',
  schema: {
    type: 'string',
    enum: [...orderByFieldEnum],
    default: 'created_at',
  }
};