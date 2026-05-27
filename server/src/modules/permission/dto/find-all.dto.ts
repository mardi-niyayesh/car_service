import {PermissionsResponse} from "@/types";
import {getBaseOkResponseSchema} from "@/common";
import {findOnePermissionExample} from "./find.dto";

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