import z from "zod";
import {ApiQueryOptions} from "@nestjs/swagger";

/** Validate Pagination in Query Params */
export const PaginationValidator = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
  orderBy: z.enum(["asc", "desc"]).optional().default("desc"),
});

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
    minimum
  };
}

export const pagePaginationDto: ApiQueryOptions = paginationDto({
  type: "number", default: 1, name: "page", description: "current page", required: false, minimum: 1
});

export const limitPaginationDto: ApiQueryOptions = paginationDto({
  type: "number", default: 10, name: "limit", description: "limit of pages", required: false, minimum: 1, maximum: 100
});

export const orderByPaginationDto: ApiQueryOptions = {
  type: "string",
  enum: ["asc", "desc"],
  required: false,
  name: "orderBy",
  description: "order by created_at",
  default: "desc",
};