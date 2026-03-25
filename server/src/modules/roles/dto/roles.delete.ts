import {getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";
import {FindOneRoleRes} from "@/types";
import {exampleDate} from "@/lib";

/** ok response example */
export class OkDeleteRoleRes extends getBaseOkResponseSchema<FindOneRoleRes>({
  path: "roles/id",
  response: {
    message: "role deleted successfully.",
    data: {
      role: {
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
      }
    }
  }
}) {}

/** forbidden example */
export class ForbiddenDeleteRoleRes extends getNormalErrorResponse({
  message: "Basic roles are essential to the system and cannot be deleted.",
  error: "Deletion Denied",
  statusCode: 404,
  path: "roles/:id"
}) {}