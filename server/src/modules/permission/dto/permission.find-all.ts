import {getBaseOkResponseSchema} from "@/common";
import {findOnePermissionExample} from "./permission.find";
import {type PermissionsResponse} from "../permission.service";

export class FindAllPermissionsOkRes extends getBaseOkResponseSchema<PermissionsResponse>({
  path: "permission?orderBy=desc&limit=5&page=1",
  response: {
    message: "permission successfully found",
    data: {
      count: 30,
      permissions: Array.from({length: 5}, () => findOnePermissionExample),
    }
  }
}) {}