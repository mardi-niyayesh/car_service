import {getBaseOkResponseSchema} from "@/common";

export class LogoutOkResponse extends getBaseOkResponseSchema<void>({
  path: "auth/logout",
  response: {
    message: "user logout successfully"
  }
}) {}