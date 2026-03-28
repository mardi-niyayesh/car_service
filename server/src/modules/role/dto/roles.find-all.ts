import {findOneRoleResponse} from "./roles.find";
import {getBaseOkResponseSchema} from "@/common";
import {FindAllRolesRes} from "@/modules/role/role.service";

/** ok example for find all role */
export class FindAllRolesOkRes extends getBaseOkResponseSchema<FindAllRolesRes>({
  path: "role?orderBy=desc&limit=5&page=1",
  response: {
    message: "role successfully found.",
    data: {
      count: 20,
      roles: Array.from({length: 5}, () => findOneRoleResponse.role),
    }
  }
}) {}