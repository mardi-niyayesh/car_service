import type {CategoryResponse} from "@/types";
import {categoryExampleRes} from "./create.dto";
import {getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";

const path = 'categories/id';

/** ok example response */
export class DeleteCategoryOkRes extends getBaseOkResponseSchema<CategoryResponse>({
  path,
  response: {
    message: "category deleted successfully",
    data: {
      category: categoryExampleRes
    }
  }
}) {}

/** forbidden example response */
export class DeleteForbiddenResponse extends getNormalErrorResponse({
  message: "Access denied. Only the creator of this resource is allowed to perform this action.",
  error: "Ownership Verification Failed",
  path,
  statusCode: 403
}) {}

/** not found example response */
export class DeleteCategoryNotFound extends getNormalErrorResponse({
  message: 'Category not found in database',
  error: 'category does not exist',
  path,
  statusCode: 404
}) {}

/** Conflict example response */
export class DeleteCategoryConflict extends getNormalErrorResponse({
  message: "Failed, Cannot delete category because it has associated cars. Please delete or reassign the cars first.",
  error: "Failed to delete category",
  path,
  statusCode: 409
}) {}
