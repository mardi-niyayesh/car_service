import {categoryExampleRes} from "./create.dto";
import type {SafeCategoryResponse} from "@/types";
import {getBaseOkResponseSchema, getNormalErrorResponse, getZodErrorBody} from "@/common";

export const {creator_id, ...safeCategoryExampleRes} = categoryExampleRes;

void creator_id;

/** ok example response */
export class FindOneCategoryOkRes extends getBaseOkResponseSchema<SafeCategoryResponse>({
  path: "categories/id",
  response: {
    message: "category found successfully.",
    data: {category: safeCategoryExampleRes}
  }
}) {}

/** bad request example */
export class FindOneBadRequest extends getZodErrorBody({
  path: "/categories/-iuo",
  errors: [
    {
      field: "slug",
      error: "Slug can only contain lowercase letters, numbers, and hyphens (-)."
    }
  ]
}) {}

/** not found example */
export class FindOneCategoryNotFound extends getNormalErrorResponse({
  statusCode: 404,
  path: "/categories/test",
  message: "Category does not exist in database",
  error: "Category not found"
}) {}