import {exampleDate} from "@/lib";
import {FindOneRoleRes} from "@/types";
import {getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";

export const testRoleExample: FindOneRoleRes['role'] = {
  id: "0ee2a90b-5ca4-4f83-b3ab-b1a5e2ff7a13",
  name: "test_role",
  updated_at: exampleDate,
  created_at: exampleDate,
  creator: "e537de94-2f4f-4685-8c2b-29809d52bcb2",
  description: "This a Test Role",
  permissions: [
    "product.create",
    "category.create"
  ]
};

/** ok response example */
export class OkDeleteRoleRes extends getBaseOkResponseSchema<FindOneRoleRes>({
  path: "role/id",
  response: {
    message: "role deleted successfully.",
    data: {
      role: testRoleExample
    }
  }
}) {}

/** forbidden example */
export class ForbiddenDeleteRoleRes extends getNormalErrorResponse({
  message: "Access denied. Only the creator of this resource is allowed to perform this action.",
  error: "Ownership Verification Failed",
  statusCode: 404,
  path: "role/:id"
}) {}