import {findOneRoleResponse} from "./roles.find";
import {getBaseOkResponseSchema} from "@/common";
import {FindAllRolesRes} from "@/modules/roles/roles.service";

/** ok example for find all roles */
export class FindAllRolesOkRes extends getBaseOkResponseSchema<FindAllRolesRes>({
  path: "roles?orderBy=desc&limit=5&page=1",
  response: {
    message: "roles successfully found.",
    data: {
      count: 20,
      roles: Array.from({length: 5}, () => findOneRoleResponse.role),
    }
  }
}) {}