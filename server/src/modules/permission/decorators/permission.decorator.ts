import {applyDecorators, Get, HttpCode, HttpStatus} from "@nestjs/common";
import {
  Cacheable,
  getBadRequestUUIDParams,
  getForbiddenResponse,
  getUnauthorizedResponse,
  limitPaginationDto,
  orderByPaginationDto,
  pagePaginationDto,
  PERMISSIONS,
  UUID4Dto
} from "@/common";
import {ONE_MINUTE_MS} from "@/lib";
import * as PermissionDto from "../dto";
import {ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiUnauthorizedResponse} from "@nestjs/swagger";

export const FindOneDecorators = () => {
  return applyDecorators(
    Cacheable({
      resource: 'permission',
      ttl: ONE_MINUTE_MS * 240,
      paramsKey: ['id'],
    }),
    Get(":id"),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: 'get permission info with id',
      description: `  
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.PERMISSION_VIEW}\`\n
  
  find one permission with id **Access restricted to users with permission: (owner.all or permission.view) only.**`,
      operationId: 'find_permission',
    }),
    ApiParam(UUID4Dto('id')),
    ApiOkResponse({type: PermissionDto.FindOnePermissionOkRes}),
    ApiBadRequestResponse({type: getBadRequestUUIDParams('permission/id')}),
    ApiUnauthorizedResponse({type: getUnauthorizedResponse('permission/id')}),
    ApiForbiddenResponse({type: getForbiddenResponse('permission/id')}),
  );
};

export const FindAllDecorators = () => {
  return applyDecorators(
    Cacheable({
      resource: 'permission',
      pagination: true,
      ttl: ONE_MINUTE_MS * 240,
    }),
    Get(),
    HttpCode(HttpStatus.OK),
    ApiOperation({
      summary: 'get permission list with pagination',
      description: `
  - # **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.PERMISSION_VIEW}\`\n
  
  get permission list with pagination **Access restricted to users with permission: (owner.all or permission.view) only.**`,
      operationId: 'find_all_permission',
    }),
    ApiQuery(pagePaginationDto),
    ApiQuery(limitPaginationDto),
    ApiQuery(orderByPaginationDto),
    ApiOkResponse({type: PermissionDto.FindAllPermissionsOkRes}),
    ApiUnauthorizedResponse({type: getUnauthorizedResponse('permissions')}),
    ApiForbiddenResponse({type: getForbiddenResponse('permissions')}),
  );
};