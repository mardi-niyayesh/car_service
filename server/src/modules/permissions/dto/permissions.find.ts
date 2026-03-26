import {exampleDate} from "@/lib";
import {getBaseOkResponseSchema} from "@/common";
import {FindOnePermission} from "@/modules/permissions/permissions.service";

export const findOnePermissionExample: FindOnePermission['permission'] = {
  id: "7f1c2a3b-8d4e-4a6f-9c21-5e8b3f0a2d11",
  created_at: exampleDate,
  updated_at: exampleDate,
  name: "permission.view",
  description: "this permission allows view on permission"
};

export class FindOnePermissionOkRes extends getBaseOkResponseSchema<FindOnePermission>({
  path: 'permissions/:id',
  response: {
    message: 'permission successfully found',
    data: {
      permission: findOnePermissionExample
    }
  }
}) {}