import z from "zod";
import {ApiQueryOptions} from "@nestjs/swagger";

const maxLimit = 100;
const minLimit = 1;
const defaultLimit = 10;
const minPage = 1;

/** Validate Pagination in Query Params */
export const PaginationValidator = z.object({
  page: z
    .coerce.number()
    .int()
    .min(minPage)
    .optional()
    .default(minPage)
    .catch(minPage),
  limit: z
    .coerce.number()
    .int()
    .min(minLimit)
    .max(maxLimit)
    .optional()
    .default(defaultLimit)
    .catch(defaultLimit),
  order: z
    .enum(["asc", "desc"])
    .optional()
    .default("desc"),
}).transform(data => ({
  page: data.page,
  limit: data.limit,
  orderByLower: data.order,
  orderByUpper: data.order === 'asc' ? 'ASC' : 'DESC',
  offset: data.limit * (data.page - 1)
}));

/** @typeof Validate Pagination in Query Params */
export type PaginationValidatorType = z.infer<typeof PaginationValidator>;

interface PaginationDtoType {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default: number;
  maximum?: number;
  minimum?: number;
}

/** @schema Validate Pagination in Query Params */
export function paginationDto(params: PaginationDtoType): ApiQueryOptions {
  const {minimum, maximum, default: d, required, type, description, name} = params;
  return {
    default: d,
    name,
    type,
    required,
    description,
    maximum,
    minimum,
    schema: {
      type: "integer",
      default: d,
      maximum,
      minimum
    }
  };
}

/** page query param example schema for swagger */
export const pagePaginationDto: ApiQueryOptions = paginationDto({
  type: "number",
  default: minPage,
  name: "page",
  description: "current page",
  required: false,
  minimum: minPage
});

/** limit query param example schema for swagger */
export const limitPaginationDto: ApiQueryOptions = paginationDto({
  type: "number",
  default: defaultLimit,
  name: "limit",
  description: "limit of pages",
  required: false,
  minimum: minLimit,
  maximum: maxLimit
});

/** orderBy query param example schema for swagger */
export const orderByPaginationDto: ApiQueryOptions = {
  type: "string",
  enum: ["asc", "desc"],
  required: false,
  name: "order",
  description: "order by created_at",
  default: "desc",
  schema: {
    default: "desc",
    type: "string",
    enum: ["asc", "desc"],
    description: "order by created_at",
  }
};