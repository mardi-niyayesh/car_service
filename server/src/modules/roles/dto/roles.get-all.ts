import {RoleResponse} from "@/types";
import {findOneRoleResponse} from "./roles.get";
import {getBaseOkResponseSchema} from "@/common";

/** ok example for find all roles */
export class FindAllRolesOkRes extends getBaseOkResponseSchema<{ roles: RoleResponse[] }>({
  path: "roles?orderBy=desc&limit=5&page=1",
  response: {
    message: "roles successfully found.",
    data: {
      roles: Array.from({length: 5}, () => findOneRoleResponse.role)
    }
  }
}) {}