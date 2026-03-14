import {RoleResponse} from "@/types";
import {getBaseOkResponseSchema} from "@/common";

export class FindAllRolesOkRes extends getBaseOkResponseSchema<{ roles: RoleResponse[] }>({
  path: "roles?orderBy=desc&limit=5&page=1",
  response: {
    message: "roles successfully found.",
    data: {
      roles: []
    }
  }
}) {}