import z from 'zod';
import {UserResponse} from "@/types";
import {createZodDto} from "nestjs-zod";
import {createUserResponse} from "@/modules/auth/dto";
import {getBaseOkResponseSchema, getNormalErrorResponse} from "@/common";

/** request body */
export const UsersRoleAssigned = z.object({
  rolesId: z
    .array(z.uuidv4({error: "Invalid role ID format"}))
    .nonempty({error: "roles id Cannot be empty"})
    .max(4, {error: "Cannot assign more than 4 roles at once"})
    .transform(ids => [...new Set(ids)])
});

/** request body type */
export type UserRoleAssignedType = z.infer<typeof UsersRoleAssigned>;

/** request body swagger schema */
export class UserRoleAssignedDto extends createZodDto(UsersRoleAssigned) {}

/** data response */
export const userResponse = structuredClone(createUserResponse);

userResponse.data.user.roles = [
  "self",
  "user_manager"
];

userResponse.data.user.permissions = [
  "user.self",
  "user.view",
  "user.update",
  "user.delete",
  "role.assign",
  "role.revoke",
  "role.create",
  "role.view",
  "role.update",
  "role.delete"
];

/** ok response */
export class RoleAssignOkRes extends getBaseOkResponseSchema<UserResponse>({
  path: "/users/:id/roles",
  create: false,
  response: {
    message: "Roles successfully assign to this user.",
    data: userResponse.data
  }
}) {}

export class UserRoleAssignBadReqRes extends getNormalErrorResponse({
  message: "User already has these roles: category_manager, product_manager",
  error: "Conflict User Roles",
  path: "users/:id/roles",
  statusCode: 400
}) {}

/** forbidden response */
export class UserRoleAssignedForbiddenRes extends getNormalErrorResponse({
  message: "High-level role protection: You don't have OWNER privileges required to assign permissions affecting management-level roles (owner.all, user.view, user.delete, role.assign, role.revoke, role.create, role.view, role.update, role.delete).",
  statusCode: 403,
  error: "Permission Denied",
  path: "users/:id/roles"
}) {}

/** conflict body */
export class UserRoleAssignedConflictRes extends getNormalErrorResponse({
  message: 'User already has some of these roles',
  statusCode: 409,
  path: "users/:id/roles",
  error: "Conflict User Roles",
}) {}