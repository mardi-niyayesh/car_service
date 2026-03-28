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
  type UUID4Type,
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

@ApiTags("Permissions")
@Permission({
  permissions: [PERMISSIONS.PERMISSION_VIEW]
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
    description: 'find one permission with id **Access restricted to users with permission: (owner.all or permission.view) only.**',
    tags: ['Permissions'],
    operationId: 'find_permission',
  })
  @ApiParam(UUID4Dto('id'))
  @ApiOkResponse({type: PermissionDto.FindOnePermissionOkRes})
  @ApiBadRequestResponse({type: getBadRequestUUIDParams('permission/id')})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('permission/id')})
  @ApiForbiddenResponse({type: getForbiddenResponse('permission/id')})
  find(
    @Param(new ZodPipe(UUIDv4Validator)) params: UUID4Type,
  ): Promise<ApiResponse<FindOnePermission>> {
    return this.permissionService.find(params.id);
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
    description: 'get permission list with pagination **Access restricted to users with permission: (owner.all or permission.view) only.**',
    tags: ['Permissions'],
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