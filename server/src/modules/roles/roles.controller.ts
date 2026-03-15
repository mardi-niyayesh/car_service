import {
  ZodPipe,
  Cacheable,
  Permission,
  PERMISSIONS,
  pagePaginationDto,
  limitPaginationDto,
  PaginationValidator,
  orderByPaginationDto,
  getForbiddenResponse,
  getUnauthorizedResponse,
  type PaginationValidatorType,
} from "@/common";

import * as RolesDto from "./dto";
import {ONE_MINUTE_MS} from "@/lib";
import * as UserDto from "../users/dto";
import {Controller, Get, Query} from "@nestjs/common";
import type {ApiResponse, RoleResponse} from "@/types";
import {RolesService} from "@/modules/roles/roles.service";
import {ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiQuery, ApiTags, ApiUnauthorizedResponse} from "@nestjs/swagger";

/**
 * Role management endpoints for creating and managing custom roles.
 *
 * This controller handles:
 * - Creating new custom roles with specific permission sets
 * - Updating existing custom role details and permissions
 * - Deleting custom roles (with appropriate safeguards)
 * - Listing all available roles (both default and custom)
 *
 * Role Management Rules:
 * - Default system roles (self, owner) or other default roles are protected and cannot be modified
 * - Only users with 'owner' or 'role_manager' role can create, update, or delete custom roles
 * - Permissions assigned to roles are system-defined and cannot be altered
 *
 * All endpoints require authentication via Bearer token with appropriate permissions.
 */
@ApiTags("Roles")
@Controller("roles")
@ApiBearerAuth("accessToken")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Permission({
    permissions: [PERMISSIONS.ROLE_VIEW]
  })
  @Get('find')
  @ApiQuery(UserDto.ExampleIdQuery)
  @ApiQuery(RolesDto.FindOneRoleNameQuery)
  findOne(
    @Query(new ZodPipe(RolesDto.FindOneRoleValidator)) query: RolesDto.FindOneRoleValidatorType
  ): string {
    console.log(query);
    return 'test';
  }

  /** get all roles info with pagination
   * - only roles with permission (owner.all or role.view) can accessibility to this route
   */
  @Permission({
    permissions: [PERMISSIONS.ROLE_VIEW]
  })
  @Cacheable({
    pagination: true,
    resource: "roles",
    ttl: ONE_MINUTE_MS * 120,
  })
  @Get()
  @ApiQuery(pagePaginationDto)
  @ApiQuery(limitPaginationDto)
  @ApiQuery(orderByPaginationDto)
  @ApiOkResponse({type: RolesDto.FindAllRolesOkRes})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('roles')})
  @ApiForbiddenResponse({type: getForbiddenResponse('roles')})
  findAll(
    @Query(new ZodPipe(PaginationValidator)) query: PaginationValidatorType
  ): Promise<ApiResponse<{ roles: RoleResponse[] }>> {
    return this.rolesService.findAll(query);
  }
}