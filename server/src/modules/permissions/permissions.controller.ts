import {
  ZodPipe,
  Permission,
  PERMISSIONS,
  pagePaginationDto,
  limitPaginationDto,
  PaginationValidator,
  getForbiddenResponse,
  orderByPaginationDto,
  getUnauthorizedResponse,
  type PaginationValidatorType,
} from "@/common";

import {ApiResponse} from "@/types";
import {Controller, Get, Query} from "@nestjs/common";
import {type PermissionsResponse, PermissionsService} from "./permissions.service";
import {ApiBearerAuth, ApiForbiddenResponse, ApiQuery, ApiTags, ApiUnauthorizedResponse} from "@nestjs/swagger";

@ApiTags("Permission")
@Permission({
  permissions: [PERMISSIONS.PERMISSION_VIEW]
})
@Controller('permissions')
@ApiBearerAuth("accessToken")
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get(":id")
  find() {
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