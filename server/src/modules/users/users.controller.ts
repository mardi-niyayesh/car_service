import {
  Req,
  Get,
  Post,
  Body,
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
  CacheEvict,
  PERMISSIONS,
  Permission,
  UUID4Schema,
  type UUID4Type,
  pagePaginationDto,
  limitPaginationDto,
  PaginationValidator,
  getForbiddenResponse,
  orderByPaginationDto,
  getUnauthorizedResponse,
  getBadRequestUUIDParams,
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
import {UsersService} from "./users.service";
import {paramCacheKey, ONE_MINUTE_MS} from "@/lib";
import {CacheKey, CacheTTL} from "@nestjs/cache-manager";
import type {AccessRequest, ApiResponse, UserResponse} from "@/types";

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
@ApiTags("User")
@Controller('users')
@ApiBearerAuth("accessToken")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get current user profile.
   * Requires authentication and "user.self" permission.
   */
  @Permission({
    permissions: [PERMISSIONS.USER_SELF]
  })
  @Get("profile")
  @HttpCode(HttpStatus.OK)
  @CacheKey(c => paramCacheKey({
    resource: "users",
    self: true,
    ctx: c,
  }))
  @CacheTTL(ONE_MINUTE_MS * 122)
  @ApiOperation({
    summary: 'get user info by self',
    description: 'get user info accessToken. **Access restricted to users with role: (self) only.**',
    operationId: 'get_profile',
    tags: ["User"],
  })
  @ApiOkResponse({type: UserDto.GetMeOkResponse})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse("users/profile")})
  getProfile(
    @Req() req: AccessRequest
  ): Promise<ApiResponse<UserResponse>> {
    return this.usersService.findOne(req.user.userId);
  }

  /**
   * Get user by ID.
   * Admin only endpoint. Validates UUID format.
   */
  @Permission({
    permissions: [PERMISSIONS.USER_VIEW]
  })
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @CacheKey(c => paramCacheKey({
    ctx: c,
    resource: "users",
    paramsKey: ["id"],
  }))
  @CacheTTL(ONE_MINUTE_MS * 122)
  @ApiOperation({
    summary: 'get user info',
    description: 'get user info with id. **Access restricted to users with permission: (owner or user.view) only.**',
    operationId: 'get_user',
    tags: ["User"],
  })
  @ApiParam(UUID4Dto("user"))
  @ApiOkResponse({type: UserDto.GetUserOkResponse})
  @ApiBadRequestResponse({
    type: getBadRequestUUIDParams("users/:id"),
    description: 'Validation failed. Ensure the ID is a valid UUIDv4.'
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
    @Param(new ZodPipe(UUID4Schema)) params: UUID4Type,
  ): Promise<ApiResponse<UserResponse>> {
    return this.usersService.findOne(params.id);
  }

  @Permission({
    permissions: [PERMISSIONS.USER_VIEW]
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  @CacheKey(ctx => paramCacheKey({
    ctx,
    resource: "users",
    pagination: true
  }))
  @CacheTTL(ONE_MINUTE_MS * 122)
  @ApiOperation({
    summary: 'get all users info',
    description: 'get all users info. **Access restricted to users with permission: (owner or user.view) only.**',
    operationId: 'get_users',
    tags: ["User"],
  })
  @ApiQuery(pagePaginationDto)
  @ApiQuery(limitPaginationDto)
  @ApiQuery(orderByPaginationDto)
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
  ): Promise<ApiResponse<{ users: UserResponse[] }>> {
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
  @CacheEvict([
    {resource: "users", force: true},
    {paramsKey: ["id"], resource: "users"},
  ])
  @ApiOperation({
    summary: 'Assign roles to a user',
    description: `
  Assigns one or more roles to a target user with strict validation rules:

  - **Self-assignment is forbidden** (a user cannot assign roles to themselves).
  - **Restricted roles** ("owner", "self") cannot be assigned under any circumstances.
  - **Duplicate prevention**: roles already held by the user cannot be reassigned.
  - **Management-level protection**: assigning or modifying critical management roles 
  ("role_manager", "user_manager") is exclusively reserved for the "owner". 
  Other managers cannot grant these specific privileges to prevent peer-level 
  escalation, though they may assign other authorized management roles.
  - All roles must exist; invalid role IDs will result in a 404 error.

  This endpoint ensures role integrity, prevents privilege escalation, 
  and enforces organizational security policies.
  `,
    operationId: 'assign_role',
    tags: ["User"],
  })
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
    @Param(new ZodPipe(UUID4Schema)) params: UUID4Type,
  ): Promise<ApiResponse<UserResponse>> {
    return this.usersService.modifyRole({
      rolesId: body.rolesId,
      userId: params.id,
      action: "assign",
      actionPayload: req.user
    });
  }

  @Permission({
    permissions: [PERMISSIONS.ROLE_REVOKE]
  })
  @Delete(":id/roles")
  @HttpCode(HttpStatus.OK)
  @CacheEvict([
    {resource: "users", force: true},
    {paramsKey: ["id"], resource: "users"},
  ])
  @ApiOperation({
    summary: 'Revoke roles from a user',
    description: `
  Removes one or more roles from a target user with strict security enforcement:
  
  - **Self-revocation is forbidden**: Users cannot remove their own roles to prevent 
    accidental lockout or "account suicide."
  - **Restricted roles protection**: The "owner" and "self" roles cannot be revoked 
    via this endpoint to maintain system stability and root-level access.
  - **Existence validation**: Only roles currently held by the user can be revoked; 
    attempting to remove a role the user doesn't have will be ignored or flagged.
  - **Management-level protection**: Revoking critical management roles 
    ("role_manager", "user_manager") is exclusively reserved for the "owner". 
    This prevents unauthorized managers from de-authorizing their peers or superiors.
  - **Atomic updates**: The system ensures that role removal is reflected immediately 
    across all associated permissions.
  
  This endpoint maintains the principle of least privilege and prevents 
  unauthorized restructuring of the organizational hierarchy.
  `,
    operationId: 'revoke_role',
    tags: ["User"],
  })
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
    @Param(new ZodPipe(UUID4Schema)) params: UUID4Type,
  ) {
    return this.usersService.modifyRole({
      rolesId: body.rolesId,
      userId: params.id,
      action: "revoke",
      actionPayload: req.user
    });
  }
}