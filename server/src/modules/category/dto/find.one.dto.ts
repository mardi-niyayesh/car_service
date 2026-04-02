import {CategoryResponse} from "@/types";
import {categoryExampleRes} from "./create.dto";
import {getBaseOkResponseSchema, getNormalErrorResponse, getZodErrorBody} from "@/common";

/** ok example response */
export class FindOneCategoryOkRes extends getBaseOkResponseSchema<CategoryResponse>({
  path: "categories/id",
  response: {
    message: "category found successfully.",
    data: {
      category: categoryExampleRes
    }
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