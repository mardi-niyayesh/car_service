import z from "zod";
import {UserResponse} from "@/types";
import {ApiQueryOptions} from "@nestjs/swagger";
import {createUserResponse} from "@/modules/auth/dto";
import {getBaseErrorBodyResponseSchema, getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";

/** get one user validator */
export const GetOneUserValidator = z.object({
  id: z.uuidv4().optional(),
  email: z.email().optional(),
}).refine(data => data.email || data.id, {
  error: 'Either email or id must be provided',
  path: ['email', 'id'],
});

/** get one user validator types */
export type GetOneUserType = z.infer<typeof GetOneUserValidator>;

/** email query example for swagger */
export const GetOneUserEmailQuery: ApiQueryOptions = {
  type: "string",
  required: false,
  name: 'email',
  format: 'email',
  pattern: GetOneUserValidator.shape.email._zod.pattern.source
};

/** id query example for swagger */
export const GetOneUserIdQuery: ApiQueryOptions = {
  type: "string",
  required: false,
  name: 'id',
  format: 'uuid',
  pattern: GetOneUserValidator.shape.id._zod.pattern.source
};

/** ok example for get one user by id */
export class GetUserOkResponse extends getBaseOkResponseSchema<UserResponse>({
  path: "users/d228cc19-b8c9-41c4-8c70-c2c6effb05ca",
  create: false,
  response: {
    message: "User found successfully",
    data: createUserResponse.data
  }
}) {}

/** bad request example swagger for get one user */
export const GetOneUserBadReqRes = getBaseErrorBodyResponseSchema({
  path: 'users/get?email=email&id=id',
  errors: [
    {
      field: "id",
      error: "Invalid UUID"
    },
    {
      field: "email",
      error: "Invalid email address"
    }
  ]
});

/** not found example swagger for get one user */
export class NotFoundGetUserResponse extends getNormalErrorResponse({
  path: "/users/:id",
  message: "User not found in database",
  error: "User Not Found",
  statusCode: 404
}) {}