import {getNormalErrorResponse} from "@/common";

/** forbidden example response */
export class DeleteForbiddenResponse extends getNormalErrorResponse({
  message: "Access denied. Only the creator of this resource is allowed to perform this action.",
  error: "Ownership Verification Failed",
  path: 'categories/:id',
  statusCode: 403
}) {}

/** not found example response */
export class DeleteCategoryNotFound extends getNormalErrorResponse({
  message: 'Category not found in database',
  error: 'category does not exist',
  path: 'categories/:id',
  statusCode: 404
}) {}