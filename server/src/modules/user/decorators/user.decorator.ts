import {
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import {
  UUID4Dto,
  Cacheable,
  CacheEvict,
  Permission,
  PERMISSIONS,
  pagePaginationDto,
  limitPaginationDto,
  orderByPaginationDto,
  getForbiddenResponse,
  getUnauthorizedResponse,
} from "@/common";

import * as UserDto from "../dto";
import {ONE_MINUTE_MS} from "@/lib";
import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";

export const GetProfileDecorators = () => {
  return applyDecorators(
    Permission({
      permissions: [PERMISSIONS.USER_SELF]
    }),
    HttpCode(HttpStatus.OK),
    Cacheable({
      resource: "user",
      self: true,
      ttl: ONE_MINUTE_MS * 30
    }),
    ApiOperation(UserDto.userGetProfileOperation),
    ApiOkResponse({type: UserDto.GetMeOkResponse}),
    ApiUnauthorizedResponse({type: getUnauthorizedResponse("users/getProfile")}),
  );
};

export const UpdateProfileDecorators = () => {
  return applyDecorators(
    Permission({
      permissions: [PERMISSIONS.USER_SELF]
    }),
    CacheEvict({
      self: true,
      resource: "user",
    }),
    HttpCode(HttpStatus.OK),
    ApiOperation(UserDto.userUpdateProfileOperation),
    ApiBody({type: UserDto.UpdateProfileDto}),
    ApiOkResponse({type: UserDto.UpdateProfileOkResponse}),
    ApiBadRequestResponse({type: UserDto.UpdateProfileBadReqRes}),
    ApiUnauthorizedResponse({type: getUnauthorizedResponse('users/updateProfile')}),
    ApiConflictResponse({type: UserDto.UpdateProfileConflictRes}),
  );
};

export const UpdatePasswordDecorators = () => {
  return applyDecorators(
    Permission({
      permissions: [PERMISSIONS.USER_SELF]
    }),
    HttpCode(HttpStatus.OK),
    ApiOperation(UserDto.userUpdatePasswordOperation),
    ApiBody({type: UserDto.UpdatePasswordDto}),
    ApiOkResponse({type: UserDto.OkUpdatePasswordRes}),
    ApiBadRequestResponse({type: UserDto.UpdatePasswordBadReqRes}),
    ApiUnauthorizedResponse({type: UserDto.UnauthorizedUpdatePasswordRes}),
  );
};

export const FindOneDecorators = () => {
  return applyDecorators(
    Permission({
      permissions: [PERMISSIONS.USER_VIEW]
    }),
    HttpCode(HttpStatus.OK),
    Cacheable({
      resource: "user",
      ttl: ONE_MINUTE_MS * 30,
      query: ['id', 'email'],
    }),
    ApiOperation(UserDto.userFindOneOperation),
    ApiQuery(UserDto.ExampleIdQuery),
    ApiQuery(UserDto.GetOneUserEmailQuery),
    ApiOkResponse({type: UserDto.GetUserOkResponse}),
    ApiBadRequestResponse({
      type: UserDto.GetOneUserBadReqRes,
      description: 'Validation failed. Ensure the ID is a valid UUIDv4 and email.'
    }),
    ApiUnauthorizedResponse({
      type: getUnauthorizedResponse("users/:id"),
      description: 'Invalid or missing authentication token.'
    }),
    ApiForbiddenResponse({
      type: getForbiddenResponse("users/:id"),
      description: 'when target user not access to get user'
    }),
    ApiNotFoundResponse({
      type: UserDto.NotFoundGetUserResponse,
      description: 'The requested user does not exist in the database.'
    }),
  );
};

export const FindAllDecorators = () => {
  return applyDecorators(
    Permission({
      permissions: [PERMISSIONS.USER_VIEW]
    }),
    HttpCode(HttpStatus.OK),
    Cacheable({
      resource: "user",
      pagination: true,
      ttl: ONE_MINUTE_MS * 30
    }),
    ApiOperation(UserDto.userFindAllOperation),
    ApiQuery(pagePaginationDto),
    ApiQuery(limitPaginationDto),
    ApiQuery(orderByPaginationDto),
    ApiOkResponse({type: UserDto.FindAllUsersOKRes}),
    ApiUnauthorizedResponse({
      type: getUnauthorizedResponse("users"),
      description: 'Invalid or missing authentication token.'
    }),
    ApiForbiddenResponse({
      type: getForbiddenResponse("users"),
      description: 'when target user not access to get all users'
    }),
  );
};

export const AssignRoleDecorators = () => {
  return applyDecorators(
    Permission({
      permissions: [PERMISSIONS.ROLE_ASSIGN]
    }),
    HttpCode(HttpStatus.OK),
    CacheEvict({
      findPrefix: {param: 'id'}
    }),
    ApiOperation(UserDto.userRoleAssignOperation),
    ApiParam(UUID4Dto("user")),
    ApiBody({type: UserDto.UserRoleAssignedDto}),
    ApiOkResponse({type: UserDto.RoleAssignOkRes}),
    ApiBadRequestResponse({
      type: UserDto.UserRoleAssignBadReqRes,
      description: 'Conflict User Roles'
    }),
    ApiUnauthorizedResponse({
      type: getUnauthorizedResponse(":id/roles"),
      description: 'Invalid or missing authentication token.'
    }),
    ApiForbiddenResponse({
      type: UserDto.UserRoleAssignedForbiddenRes,
      description: 'Access denied: Target user or new role is a manager/owner or requester lacks sufficien,t rank.'
    }),
    ApiNotFoundResponse({
      type: UserDto.NotFoundGetUserResponse,
      description: 'The requested user or role does not exist in the database.'
    }),
    ApiConflictResponse({
      type: UserDto.UserRoleAssignedConflictRes,
      description: 'Conflict: The user already possesses this role.'
    }),
  );
};

export const RevokeRoleDecorator = () => {
  return applyDecorators(
    Permission({
      permissions: [PERMISSIONS.ROLE_REVOKE]
    }),
    HttpCode(HttpStatus.OK),
    CacheEvict({
      findPrefix: {param: 'id'}
    }),
    ApiOperation(UserDto.userRoleRevokeOperation),
    ApiParam(UUID4Dto("user")),
    ApiBody({type: UserDto.UserRoleAssignedDto}),
    ApiOkResponse({type: UserDto.RoleRevokeOkRes}),
    ApiBadRequestResponse({
      type: UserDto.UserRevokeBadReqRes,
      description: "Roles Not Found in Target Roles"
    }),
    ApiUnauthorizedResponse({
      type: getUnauthorizedResponse(":id/roles"),
      description: 'Invalid or missing authentication token.'
    }),
    ApiForbiddenResponse({
      type: UserDto.UserRoleRevokedForbiddenRes,
      description: 'Access denied: Target user or new role is a manager/owner or requester lacks sufficien,t rank.'
    }),
    ApiNotFoundResponse({
      type: UserDto.NotFoundGetUserResponse,
      description: 'The requested user or role does not exist in the database.'
    }),
  );
};