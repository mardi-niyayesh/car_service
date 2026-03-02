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
}

/** @schema Validate Pagination in Query Params */
export function paginationDto(params: PaginationDtoType): ApiQueryOptions {
  const {default: d, required, type, description, name} = params;
  return {
    default: d,
    name,
    type,
    required,
    description,
  };
}