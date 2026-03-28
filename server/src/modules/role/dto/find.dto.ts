import {z} from 'zod';
import {exampleDate} from "@/lib";
import {FindOneRoleRes} from "@/types";
import {ApiQueryOptions} from "@nestjs/swagger";
import {getZodErrorBody, getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";

/** validator for one role query */
export const FindOneRoleValidator = z.object({
  id: z.uuidv4().optional(),
  name: z.string().optional(),
}).refine(data => data.name || data.id, {
  error: 'Either name or id must be provided',
  path: ['name', 'id'],
});

/** typeof Validator for one role query */
export type FindOneRoleValidatorType = z.infer<typeof FindOneRoleValidator>;

/** name query for find one role */
export const FindOneRoleNameQuery: ApiQueryOptions = {
  type: "string",
  required: false,
  name: 'name',
};

/** example response data for find one role */
export const findOneRoleResponse: FindOneRoleRes = {
  role: {
    id: "133e0257-bd87-4d30-9a8f-4026296f5498",
    name: "role_manager",
    updated_at: exampleDate,
    created_at: exampleDate,
    creator: null,
    description: "Full administrative access to manage all role in the system",
    permissions: [
      "role.view",
      "role.delete",
      "role.update",
      "role.create"
    ]
  }
};

/** ok response example */
export class FindOneOkResponse extends getBaseOkResponseSchema<FindOneRoleRes>({
  path: 'role/find?name=role_manager',
  response: {
    message: 'role successfully found.',
    data: findOneRoleResponse
  }
}) {}

/** bad request example */
export class FindOneRoleBadReq extends getZodErrorBody({
  path: 'role/find',
  errors: [{
    field: "name, id",
    error: "Either name or id must be provided"
  }]
}) {}

/** not found example */
export class NotFoundRoleRes extends getNormalErrorResponse({
  path: "roles",
  statusCode: 404,
  message: "this Role does not exist in database",
  error: "Role not found"
}) {}