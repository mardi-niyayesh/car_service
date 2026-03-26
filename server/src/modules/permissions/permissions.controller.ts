import {
  ZodPipe,
  UUID4Dto,
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

import {ApiResponse} from "@/types";
import * as PermissionDto from "./dto";
import {Controller, Get, Param, Query} from "@nestjs/common";
import {type FindOnePermission, type PermissionsResponse, PermissionsService} from "./permissions.service";
import {ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse} from "@nestjs/swagger";

@ApiTags("Permission")
@Permission({
  permissions: [PERMISSIONS.PERMISSION_VIEW]
})
@Controller('permissions')
@ApiBearerAuth("accessToken")
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get(":id")
  @ApiParam(UUID4Dto('id'))
  @ApiOkResponse({type: PermissionDto.FindOnePermissionOkRes})
  @ApiBadRequestResponse({type: getBadRequestUUIDParams('permissions/id')})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('permissions/id')})
  @ApiForbiddenResponse({type: getForbiddenResponse('permissions/id')})
  find(
    @Param(new ZodPipe(UUIDv4Validator)) params: UUID4Type,
  ): Promise<ApiResponse<FindOnePermission>> {
    return this.permissionsService.find(params.id);
  }

  @Get()
  @ApiQuery(pagePaginationDto)
  @ApiQuery(limitPaginationDto)
  @ApiQuery(orderByPaginationDto)
  @ApiOkResponse({type: PermissionDto.FindAllPermissionsOkRes})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('permissions')})
  @ApiForbiddenResponse({type: getForbiddenResponse('permissions')})
  findAll(
    @Query(new ZodPipe(PaginationValidator)) query: PaginationValidatorType
  ): Promise<ApiResponse<PermissionsResponse>> {
    return this.permissionsService.findAll(query);
  }
}