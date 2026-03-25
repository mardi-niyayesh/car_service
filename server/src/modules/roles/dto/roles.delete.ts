import {getNormalErrorResponse} from "@/common";

/** forbidden example */
export class ForbiddenDeleteRoleRes extends getNormalErrorResponse({
  message: "Basic roles are essential to the system and cannot be deleted.",
  error: "Deletion Denied",
  statusCode: 404,
  path: "roles/:id"
}) {}