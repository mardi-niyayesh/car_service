import z from "zod";
import {ApiParamOptions, ApiQueryOptions} from "@nestjs/swagger";

/** validate for uuid4 in params */
export const UUID4Schema = z.object({
  id: z.uuidv4()
}).overwrite(data => ({id: data.id.trim()}));

/** type for validate uuidV4 in Params */
export type UUID4Type = z.infer<typeof UUID4Schema>;

/** Swagger Params UUIDv4 */
export function UUID4Dto(name: string): ApiParamOptions {
  return {
    name: "id",
    type: String,
    description: `${name} UUID version 4`,
    example: "d228cc19-b8c9-41c4-8c70-c2c6effb05ca",
    required: true,
  };
}

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