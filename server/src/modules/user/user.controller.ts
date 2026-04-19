import * as UserDto from "./dto";
import {UserService} from "./user.service";
import * as UserDecorator from "./decorators";
import {ApiTags, ApiBearerAuth} from "@nestjs/swagger";
import {Req, Get, Post, Body, Patch, Param, Query, Delete, Controller} from '@nestjs/common';
import {ZodPipe, UUIDv4Validator, PaginationValidator, type PaginationValidatorType} from "@/common";
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
  @Get("profile")
  @UserDecorator.GetProfileDecorators()
  getProfile(
    @Req() req: AccessRequest
  ): Promise<ApiResponse<UserResponse>> {
    return this.usersService.findOne(req.user.userId);
  }

  /**
   * Update user profile by self.
   * - Requires authentication and "user.self" permission.
   */
  @Patch("profile")
  @UserDecorator.UpdateProfileDecorators()
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
  @Patch("password")
  @UserDecorator.UpdatePasswordDecorators()
  updatePassword(
    @Req() req: AccessRequest,
    @Body(new ZodPipe(UserDto.UpdatePasswordValidator)) data: UserDto.UpdatePasswordType
  ): Promise<BaseApiResponse> {
    return this.usersService.updatePassword(req.user.userId, data);
  }

  /**
   * Get user by ID or Email.
   * - **Admin only endpoint. Validates UUID format.**
   * - **Access restricted to users with permission: (owner.all or user.view) only.**
   */
  @Get('find')
  @UserDecorator.FindOneDecorators()
  findOne(
    @Query(new ZodPipe(UserDto.GetOneUserValidator)) query: UserDto.GetOneUserType,
  ): Promise<ApiResponse<UserResponse>> {
    return this.usersService.findOne(query.id, query.email);
  }

  /** get all user info.
   * - **Access restricted to users with permission: (owner.all or user.view) only.**
   * */
  @Get()
  @UserDecorator.FindAllDecorators()
  async findAll(
    @Query(new ZodPipe(PaginationValidator)) query: PaginationValidatorType
  ): Promise<ApiResponse<UsersListResponse>> {
    return this.usersService.findAll(query);
  }

  /**
   * Delete exist User.
   * - **Requires authentication and "user.delete" or "owner.all" permission.**
   */
  @Delete(":id")
  @UserDecorator.DeleteDecorators()
  delete(
    @Param("id", new ZodPipe(UUIDv4Validator)) id: string,
    @Req() req: AccessRequest
  ) {
    console.log(id);
    console.log(req.user);
    return 'user deleted successfully.';
  }

  /**
   * Assign Role to Users ID.
   * Admins only endpoint. Validates UUID format.
   */
  @Post(":id/roles")
  @UserDecorator.AssignRoleDecorators()
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

  /**
   * Revoke Role from Users ID.
   * Admins only endpoint. Validates UUID format.
   */
  @Delete(":id/roles")
  @UserDecorator.RevokeRoleDecorator()
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