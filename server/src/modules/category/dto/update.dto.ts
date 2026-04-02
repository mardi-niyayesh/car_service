import {getNormalErrorResponse} from "@/common";

/** forbidden example response */
export class ForbiddenUpdateCategoryRes extends getNormalErrorResponse({
  statusCode: 403,
  path: "categories/id",
  message: "Access denied. Only the creator of this resource is allowed to perform this action.",
  error: "Ownership Verification Failed"
}) {}