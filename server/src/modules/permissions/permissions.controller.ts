import {ApiResponse} from "@/types";
import {Controller, Get, Query} from "@nestjs/common";
import {ApiBearerAuth, ApiForbiddenResponse, ApiTags} from "@nestjs/swagger";
import {type PermissionsResponse, PermissionsService} from "./permissions.service";
import {getForbiddenResponse, PaginationValidator, type PaginationValidatorType, Permission, PERMISSIONS, ZodPipe} from "@/common";

@ApiTags("Permission")
@Controller('permissions')
@ApiBearerAuth("accessToken")
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Permission({
    permissions: [PERMISSIONS.PERMISSION_VIEW]
  })
  @Get()
  @ApiForbiddenResponse({type: getForbiddenResponse('permissions')})
  findAll(
    @Query(new ZodPipe(PaginationValidator)) query: PaginationValidatorType
  ): Promise<ApiResponse<PermissionsResponse>> {
    return this.permissionsService.findAll(query);
  }
}