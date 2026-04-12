import {
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import {
  ZodPipe,
  UUID4Dto,
  Cacheable,
  Permission,
  PERMISSIONS,
  UUIDv4Validator,
  pagePaginationDto,
  limitPaginationDto,
  PaginationValidator,
  getForbiddenResponse,
  orderByPaginationDto,
  getBadRequestUUIDParams,
  getUnauthorizedResponse,
  type PaginationValidatorType,
} from "@/common";

import {ONE_MINUTE_MS} from "@/lib";
import * as PermissionDto from "./dto";
import {PermissionService} from "./permission.service";
import type {PermissionsResponse, FindOnePermission, ApiResponse} from "@/types";
import {Controller, Get, HttpCode, HttpStatus, Param, Query} from "@nestjs/common";

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
  @Cacheable({
    resource: 'permission',
    ttl: ONE_MINUTE_MS * 240,
    paramsKey: ['id'],
  })
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'get permission info with id',
    description: `  
  - **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.PERMISSION_VIEW}\`\n
  
  find one permission with id **Access restricted to users with permission: (owner.all or permission.view) only.**`,
    operationId: 'find_permission',
  })
  @ApiParam(UUID4Dto('id'))
  @ApiOkResponse({type: PermissionDto.FindOnePermissionOkRes})
  @ApiBadRequestResponse({type: getBadRequestUUIDParams('permission/id')})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('permission/id')})
  @ApiForbiddenResponse({type: getForbiddenResponse('permission/id')})
  find(
    @Param('id', new ZodPipe(UUIDv4Validator)) id: string,
  ): Promise<ApiResponse<FindOnePermission>> {
    return this.permissionService.find(id);
  }

  /** find permission list with pagination
   * - only roles with permission (owner.all or permission.view) can accessibility to this route
   */
  @Cacheable({
    resource: 'permission',
    pagination: true,
    ttl: ONE_MINUTE_MS * 240,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'get permission list with pagination',
    description: `
  - **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.PERMISSION_VIEW}\`\n
  
  get permission list with pagination **Access restricted to users with permission: (owner.all or permission.view) only.**`,
    operationId: 'find_all_permission',
  })
  @ApiQuery(pagePaginationDto)
  @ApiQuery(limitPaginationDto)
  @ApiQuery(orderByPaginationDto)
  @ApiOkResponse({type: PermissionDto.FindAllPermissionsOkRes})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('permissions')})
  @ApiForbiddenResponse({type: getForbiddenResponse('permissions')})
  findAll(
    @Query(new ZodPipe(PaginationValidator)) pagination: PaginationValidatorType
  ): Promise<ApiResponse<PermissionsResponse>> {
    return this.permissionService.findAll(pagination);
  }
}