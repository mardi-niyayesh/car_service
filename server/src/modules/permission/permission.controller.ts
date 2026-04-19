import * as PermissionDecorator from "./decorators";
import {ApiTags, ApiBearerAuth} from "@nestjs/swagger";
import {PermissionService} from "./permission.service";
import {Controller, Get, Param, Query} from "@nestjs/common";
import type {PermissionsResponse, FindOnePermission, ApiResponse} from "@/types";
import {ZodPipe, Permission, PERMISSIONS, type PaginationValidatorType, UUIDv4Validator, PaginationValidator} from "@/common";

/**
 * Permission management endpoints for handling permission resources.
 *
 * This controller handles:
 * - Finding permission information by ID
 * - Retrieving a list of permissions with pagination and ordering
 *
 * Only users with the relevant permissions can access these endpoints:
 * - `owner.all` or `permission.view` permission for both operations.
 *
 * All requests require authentication via Bearer token.
 */
@ApiTags("Permissions")
@Permission({
  permissions: [PERMISSIONS.PERMISSION_VIEW],
  validatorParam: UUIDv4Validator
})
@Controller('permissions')
@ApiBearerAuth("accessToken")
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  /** find a permission with id
   * - only roles with permission (owner.all or permission.view) can accessibility to this route
   */
  @Get(":id")
  @PermissionDecorator.FindOneDecorators()
  find(
    @Param('id', new ZodPipe(UUIDv4Validator)) id: string,
  ): Promise<ApiResponse<FindOnePermission>> {
    return this.permissionService.find(id);
  }

  /** find permission list with pagination
   * - only roles with permission (owner.all or permission.view) can accessibility to this route
   */
  @Get()
  @PermissionDecorator.FindAllDecorators()
  findAll(
    @Query(new ZodPipe(PaginationValidator)) pagination: PaginationValidatorType
  ): Promise<ApiResponse<PermissionsResponse>> {
    return this.permissionService.findAll(pagination);
  }
}