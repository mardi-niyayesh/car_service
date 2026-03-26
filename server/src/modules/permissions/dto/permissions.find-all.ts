import {getBaseOkResponseSchema} from "@/common";
import {findOnePermissionExample} from "./permissions.find";
import {type PermissionsResponse} from "../permissions.service";

export class FindAllPermissionsOkRes extends getBaseOkResponseSchema<PermissionsResponse>({
  path: "permissions?orderBy=desc&limit=5&page=1",
  response: {
    message: "permissions successfully found",
    data: {
      permissions: Array.from({length: 5}, () => findOnePermissionExample)
    }
  }
}) {}