import z from "zod";
import type {CarsResponse} from "@/types";
import {ApiQueryOptions} from "@nestjs/swagger";
import {exampleSafeCarRecord} from "./find-one.dto";
import {minPriceAtDayCar, maxPriceAtDayCar} from "./create.dto";
import {SlugCategoryRegex, CategorySlugValidator} from "@/modules/category/dto";
import {getBaseOkResponseSchema, BasePaginationValidator, getSafePaginationValidator} from "@/common";

function checkStringBoolean(value?: string): undefined | boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

const orderByFieldEnum = ['created_at', 'price_per_day'] as const;

export const FindAllCarValidator = getSafePaginationValidator(z.object({
  category: CategorySlugValidator.optional(),

  price_per_day_gte: z.coerce.number()
    .int()
    .min(minPriceAtDayCar)
    .max(maxPriceAtDayCar)
    .optional()
    .catch(minPriceAtDayCar),

  price_per_day_lte: z.coerce.number()
    .int()
    .min(minPriceAtDayCar)
    .max(maxPriceAtDayCar)
    .optional()
    .catch(maxPriceAtDayCar),

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
  'category',
  'in_rent',
  'can_rent',
  'order_by_field',
  'price_per_day_gte',
  'price_per_day_lte',
];

/** ok example response for find all cars */
export class FindAllCarOkRes extends getBaseOkResponseSchema<CarsResponse>({
  path: 'cars',
  response: {
    message: 'cars successfully found.',
    data: {
      count: 5,
      cars: Array.from({length: 5}, () => exampleSafeCarRecord)
    }
  }
}) {}

export const categoryFindAllCarQuery: ApiQueryOptions = {
  type: 'string',
  required: false,
  name: 'category',
  description: 'Filter cars by category slug',
  pattern: SlugCategoryRegex.source,
  schema: {
    type: 'string',
    pattern: SlugCategoryRegex.source
  }
};

export const priceGteFindAllCarQuery: ApiQueryOptions = {
  type: 'integer',
  minimum: minPriceAtDayCar,
  maximum: maxPriceAtDayCar,
  required: false,
  name: 'price_per_day_gte',
  description: 'Filter cars with price per hour greater than or equal to this value',
  schema: {
    type: 'integer',
    minimum: minPriceAtDayCar,
    maximum: maxPriceAtDayCar,
  }
};

export const priceLteFindAllCarQuery: ApiQueryOptions = {
  ...priceGteFindAllCarQuery,
  description: 'Filter cars with price per hour less than or equal to this value',
  name: 'price_per_day_lte',
};

export const inRentFindAllCarQuery: ApiQueryOptions = {
  type: 'boolean',
  required: false,
  name: 'in_rent',
  description: 'Filter cars by rental status (currently rented or not)',
  schema: {
    type: 'boolean',
  }
};

export const canRentFindAllCarQuery: ApiQueryOptions = {
  type: 'boolean',
  required: false,
  name: 'can_rent',
  description: 'Filter cars by availability for rent',
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
  description: 'Sort results by field (created_at or price_per_day)',
  schema: {
    type: 'string',
    enum: [...orderByFieldEnum],
    default: 'created_at',
  }
};