import {
  ZodPipe,
  Permission,
  PERMISSIONS,
  type UUID4Type,
  UUIDv4Validator,
  pagePaginationDto,
  limitPaginationDto,
  PaginationValidator,
  getForbiddenResponse,
  orderByPaginationDto,
  getUnauthorizedResponse,
  type PaginationValidatorType, UUID4Dto,
} from "@/common";

import {ApiResponse} from "@/types";
import {Controller, Get, Param, Query} from "@nestjs/common";
import {type PermissionsResponse, PermissionsService} from "./permissions.service";
import {ApiBearerAuth, ApiForbiddenResponse, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse} from "@nestjs/swagger";

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
  find(
    @Param( new ZodPipe(UUIDv4Validator)) params: UUID4Type,
  ) {
    return 'find one permission';
  }

  @Get()
  @ApiQuery(pagePaginationDto)
  @ApiQuery(limitPaginationDto)
  @ApiQuery(orderByPaginationDto)
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('permissions')})
  @ApiForbiddenResponse({type: getForbiddenResponse('permissions')})
  findAll(
    @Query(new ZodPipe(PaginationValidator)) query: PaginationValidatorType
  ): Promise<ApiResponse<PermissionsResponse>> {
    return this.permissionsService.findAll(query);
  }
}