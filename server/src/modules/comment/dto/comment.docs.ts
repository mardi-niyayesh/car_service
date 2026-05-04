import {PERMISSIONS} from "@/common";
import {ApiOperationOptions} from "@nestjs/swagger";

export const createCommentOperation: ApiOperationOptions = {
  summary: "Create new Comment",
  operationId: "create_comment",
  description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.USER_SELF}\`\n
  Create a Comment for a car record only roles with permission (user.self) can accessibility to this route`
};
