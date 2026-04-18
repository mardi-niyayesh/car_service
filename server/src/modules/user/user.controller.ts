import {
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  HttpCode,
  HttpStatus,
  Controller,
} from '@nestjs/common';

import {
  ZodPipe,
  UUID4Dto,
  Cacheable,
  CacheEvict,
  Permission,
  PERMISSIONS,
  UUIDv4Validator,
  pagePaginationDto,
  limitPaginationDto,
  PaginationValidator,
  getForbiddenResponse,
  orderByPaginationDto,
  getUnauthorizedResponse,
  type PaginationValidatorType,
} from "@/common";

import {
  ApiBody,
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import * as UserDto from "./dto";
import {ONE_MINUTE_MS} from "@/lib";
import {UserService} from "./user.service";
import type {UsersListResponse, AccessRequest, ApiResponse, UserResponse, SafeUser, BaseApiResponse} from "@/types";

/**
 * User management endpoints for retrieving user information.
 *
 * This controller handles:
 * - Retrieving the authenticated user's own profile
 * - Fetching specific user details by ID (for admin users)
 * - Securing endpoints with permission-based access control
 * - UUID validation for all ID parameters
 * - Assigning or Revoked roles to users by 'owner' or 'role_manager' roles
 *
 * All endpoints require authentication via Bearer token.
 */
@ApiTags("Users")
@Controller('users')
@ApiBearerAuth("accessToken")
export class UserController {
  constructor(private readonly usersService: UserService) {}

  /**
   * Get current user profile.
   * Requires authentication and "user.self" permission.
   */
  @Permission({
    permissions: [PERMISSIONS.USER_SELF]
  })
  @Get("profile")
  @HttpCode(HttpStatus.OK)
  @Cacheable({
    resource: "user",
    self: true,
    ttl: ONE_MINUTE_MS * 30
  })
  @ApiOperation(UserDto.userGetProfileOperation)
  @ApiOkResponse({type: UserDto.GetMeOkResponse})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse("users/getProfile")})
  getProfile(
    @Req() req: AccessRequest
  ): Promise<ApiResponse<UserResponse>> {
    return this.usersService.findOne(req.user.userId);
  }

  /**
   * Update user profile by self.
   * - Requires authentication and "user.self" permission.
   */
  @Permission({
    permissions: [PERMISSIONS.USER_SELF]
  })
  @Patch("profile")
  @CacheEvict({
    self: true,
    resource: "user",
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation(UserDto.userUpdateProfileOperation)
  @ApiBody({type: UserDto.UpdateProfileDto})
  @ApiOkResponse({type: UserDto.UpdateProfileOkResponse})
  @ApiBadRequestResponse({type: UserDto.UpdateProfileBadReqRes})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('users/updateProfile')})
  @ApiConflictResponse({type: UserDto.UpdateProfileConflictRes})
  updateProfile(
    @Req() req: AccessRequest,
    @Body(new ZodPipe(UserDto.UpdateProfileValidator)) data: UserDto.UpdateProfileType
  ): Promise<ApiResponse<{ user: SafeUser }>> {
    return this.usersService.updateProfile(req.user.userId, data);
  }

  /**
   * Update Current Password.
   * - **Requires authentication and "user.self" permission.**
   */
  @Permission({
    permissions: [PERMISSIONS.USER_SELF]
  })
  @Patch("password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation(UserDto.userUpdatePasswordOperation)
  @ApiBody({type: UserDto.UpdatePasswordDto})
  @ApiOkResponse({type: UserDto.OkUpdatePasswordRes})
  @ApiBadRequestResponse({type: UserDto.UpdatePasswordBadReqRes})
  @ApiUnauthorizedResponse({type: UserDto.UnauthorizedUpdatePasswordRes})
  updatePassword(
    @Req() req: AccessRequest,
    @Body(new ZodPipe(UserDto.UpdatePasswordValidator)) data: UserDto.UpdatePasswordType
  ): Promise<BaseApiResponse> {
    return this.usersService.updatePassword(req.user.userId, data);
  }

  @Delete(":id")
  delete() {
    return 'user deleted successfully.';
  }

  /**
   * Get user by ID or Email.
   * - **Admin only endpoint. Validates UUID format.**
   * - **Access restricted to users with permission: (owner.all or user.view) only.**
   */
  @Permission({
    permissions: [PERMISSIONS.USER_VIEW]
  })
  @Get('find')
  @HttpCode(HttpStatus.OK)
  @Cacheable({
    resource: "user",
    ttl: ONE_MINUTE_MS * 30,
    query: ['id', 'email'],
  })
  @ApiOperation(UserDto.userFindOneOperation)
  @ApiQuery(UserDto.ExampleIdQuery)
  @ApiQuery(UserDto.GetOneUserEmailQuery)
  @ApiOkResponse({type: UserDto.GetUserOkResponse})
  @ApiBadRequestResponse({
    type: UserDto.GetOneUserBadReqRes,
    description: 'Validation failed. Ensure the ID is a valid UUIDv4 and email.'
  })
  @ApiUnauthorizedResponse({
    type: getUnauthorizedResponse("users/:id"),
    description: 'Invalid or missing authentication token.'
  })
  @ApiForbiddenResponse({
    type: getForbiddenResponse("users/:id"),
    description: 'when target user not access to get user'
  })
  @ApiNotFoundResponse({
    type: UserDto.NotFoundGetUserResponse,
    description: 'The requested user does not exist in the database.'
  })
  findOne(
    @Query(new ZodPipe(UserDto.GetOneUserValidator)) query: UserDto.GetOneUserType,
  ): Promise<ApiResponse<UserResponse>> {
    return this.usersService.findOne(query.id, query.email);
  }

  /** get all user info.
   * - **Access restricted to users with permission: (owner.all or user.view) only.**
   * */
  @Permission({
    permissions: [PERMISSIONS.USER_VIEW]
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  @Cacheable({
    resource: "user",
    pagination: true,
    ttl: ONE_MINUTE_MS * 30
  })
  @ApiOperation(UserDto.userFindAllOperation)
  @ApiQuery(pagePaginationDto)
  @ApiQuery(limitPaginationDto)
  @ApiQuery(orderByPaginationDto)
  @ApiOkResponse({type: UserDto.FindAllUsersOKRes})
  @ApiUnauthorizedResponse({
    type: getUnauthorizedResponse("users"),
    description: 'Invalid or missing authentication token.'
  })
  @ApiForbiddenResponse({
    type: getForbiddenResponse("users"),
    description: 'when target user not access to get all users'
  })
  async findAll(
    @Query(new ZodPipe(PaginationValidator)) query: PaginationValidatorType
  ): Promise<ApiResponse<UsersListResponse>> {
    return this.usersService.findAll(query);
  }

  /**
   * Assign Role to Users ID.
   * Admins only endpoint. Validates UUID format.
   */
  @Permission({
    permissions: [PERMISSIONS.ROLE_ASSIGN]
  })
  @Post(":id/roles")
  @HttpCode(HttpStatus.OK)
  @CacheEvict({
    findPrefix: {param: 'id'}
  })
  @ApiOperation(UserDto.userRoleAssignOperation)
  @ApiParam(UUID4Dto("user"))
  @ApiBody({type: UserDto.UserRoleAssignedDto})
  @ApiOkResponse({type: UserDto.RoleAssignOkRes})
  @ApiBadRequestResponse({
    type: UserDto.UserRoleAssignBadReqRes,
    description: 'Conflict User Roles'
  })
  @ApiUnauthorizedResponse({
    type: getUnauthorizedResponse(":id/roles"),
    description: 'Invalid or missing authentication token.'
  })
  @ApiForbiddenResponse({
    type: UserDto.UserRoleAssignedForbiddenRes,
    description: 'Access denied: Target user or new role is a manager/owner or requester lacks sufficient rank.'
  })
  @ApiNotFoundResponse({
    type: UserDto.NotFoundGetUserResponse,
    description: 'The requested user or role does not exist in the database.'
  })
  @ApiConflictResponse({
    type: UserDto.UserRoleAssignedConflictRes,
    description: 'Conflict: The user already possesses this role.'
  })
  assignRole(
    @Req() req: AccessRequest,
    @Body(new ZodPipe(UserDto.UserRoleAssigned)) body: UserDto.UserRoleAssignedType,
    @Param('id', new ZodPipe(UUIDv4Validator)) id: string,
  ): Promise<ApiResponse<UserResponse>> {
    return this.usersService.modifyRole({
      rolesId: body.rolesId,
      userId: id,
      action: "assign",
      actionPayload: req.user
    });
  }

  @Permission({
    permissions: [PERMISSIONS.ROLE_REVOKE]
  })
  @Delete(":id/roles")
  @HttpCode(HttpStatus.OK)
  @CacheEvict({
    findPrefix: {param: 'id'}
  })
  @ApiOperation(UserDto.userRoleRevokeOperation)
  @ApiParam(UUID4Dto("user"))
  @ApiBody({type: UserDto.UserRoleAssignedDto})
  @ApiOkResponse({type: UserDto.RoleRevokeOkRes})
  @ApiBadRequestResponse({
    type: UserDto.UserRevokeBadReqRes,
    description: "Roles Not Found in Target Roles"
  })
  @ApiUnauthorizedResponse({
    type: getUnauthorizedResponse(":id/roles"),
    description: 'Invalid or missing authentication token.'
  })
  @ApiForbiddenResponse({
    type: UserDto.UserRoleRevokedForbiddenRes,
    description: 'Access denied: Target user or new role is a manager/owner or requester lacks sufficient rank.'
  })
  @ApiNotFoundResponse({
    type: UserDto.NotFoundGetUserResponse,
    description: 'The requested user or role does not exist in the database.'
  })
  revokeRole(
    @Req() req: AccessRequest,
    @Body(new ZodPipe(UserDto.UserRoleAssigned)) body: UserDto.UserRoleAssignedType,
    @Param('id', new ZodPipe(UUIDv4Validator)) id: string,
  ): Promise<ApiResponse<UserResponse>> {
    return this.usersService.modifyRole({
      rolesId: body.rolesId,
      userId: id,
      action: "revoke",
      actionPayload: req.user
    });
  }
}