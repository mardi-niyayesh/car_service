import {RoleResponse} from "@/types";
import {getBaseOkResponseSchema} from "@/common";

export class FindAllRolesOkRes extends getBaseOkResponseSchema<{ roles: RoleResponse[] }>({
  path: "roles",
  response: {
    message: "roles successfully found.",
    data: {
      roles: []
    }
  }
}) {}