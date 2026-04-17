import z from "zod";
import type {CarsResponse} from "@/types";
import {exampleCarRecord} from "./create.dto";
import type {ApiQueryOptions} from "@nestjs/swagger";
import {getBaseOkResponseSchema, BasePaginationValidator, getSafePaginationValidator} from "@/common";

const minPrice = 0;

function checkStringBoolean(value?: string): undefined | boolean {
  if (!value) return undefined;
  return value === 'true';
}

export const FindAllCarValidator = getSafePaginationValidator(z.object({
  price_at_hour: z.coerce.number()
    .int()
    .min(minPrice)
    .optional()
    .catch(minPrice),

  in_rent: z
    .string()
    .optional()
    .transform(v => checkStringBoolean(v)),

  can_rent: z
    .string()
    .optional()
    .transform(v => checkStringBoolean(v)),
}).extend(BasePaginationValidator.shape));

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
  minimum: minPrice,
  required: false,
  name: 'price_at_hour',
  description: 'filter query for car of price_at_hour',
  schema: {
    type: 'integer',
    minimum: minPrice
  }
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