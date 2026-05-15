import {PERMISSIONS} from "@/common";
import {ApiOperationOptions} from "@nestjs/swagger";

export const createCommentOperation: ApiOperationOptions = {
  summary: "Create new Comment",
  operationId: "create_comment",
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.USER_SELF}\`\n
  | Property | Description |
  |----------|-------------|
  | **content** | Text of the comment (2-500 characters) |
  | **rate** | Optional rating from 1 to 5 (defaults to 5) |
  | **car_id** | UUID of the target car |
  | **parent_id** | UUID of parent comment (null for top-level) |

  > **📌 Workflow:** Comments start as "**is_confirmed = false**" and require admin approval before public visibility. Nested replies automatically link to the same car as their parent.`
};

export const findAllUnconfirmedCommentsOperation: ApiOperationOptions = {
  summary: "Get unconfirmed comments",
  operationId: "get_all_unconfirmed_comments",
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.COMMENT_VIEW}\`\n
  | Query Parameter | Type | Description |
  |----------------|------|-------------|
  | **page** | number | Current page (default: 1, min: 1) |
  | **limit** | number | Items per page (default: 10, min: 1, max: 100) |
  | **order** | enum | Sort by created_at: "asc" or "desc" (default: "desc") |

  > **📌 Workflow:** This endpoint returns only comments that are **not confirmed yet** (is_confirmed = false). Only users with the "${PERMISSIONS.COMMENT_VIEW}" permission can access this endpoint. Results are paginated and can be sorted by creation date.`
};

export const confirmCommentOperation: ApiOperationOptions = {
  summary: "Confirm exist Comment",
  operationId: "confirm_comment",
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.COMMENT_CONFIRM}\`\n
  | Property | Description |
  |----------|-------------|
  | **id** | UUID of the target comment (path parameter) |

  > **📌 Workflow:** After confirmation, the comment becomes publicly visible. This operation is **irreversible** — confirmed comments must be soft-deleted (not reverted to pending). Only users with the "**comment.confirm**" permission can execute this endpoint.`
};

export const rejectCommentOperation: ApiOperationOptions = {
  summary: "Reject exist Comment",
  operationId: "reject_comment",
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.COMMENT_REJECT}\`\n
  | Property | Description |
  |----------|-------------|
  | **id** | UUID of the target comment (path parameter) |

  > **📌 Workflow:** After rejection, the comment is immediately deleted from the database. This operation is **irreversible**. Only users with the "**comment.reject**" permission can execute this endpoint.`
};

export const findOneCommentOperation: ApiOperationOptions = {
  operationId: 'find_one_comment',
  summary: "Retrieve a single comment by its ID",
  description: `
  - ## Accessible to authenticated users only
  - # **🔐 AUTHENTICATED ENDPOINT** (Bearer token required)\n
  | Parameter | Type | Description |
  |-----------|------|-------------|
  | **id** | path | Valid UUID of the comment to retrieve |

  > **📌 Note:** Returns comment with user details, car info, and reply count. Only confirmed comments are accessible.`
};