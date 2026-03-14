import {Controller, Get, Query} from "@nestjs/common";
import {RolesService} from "@/modules/roles/roles.service";
import {ApiBearerAuth, ApiQuery, ApiTags} from "@nestjs/swagger";
import {limitPaginationDto, orderByPaginationDto, pagePaginationDto, PaginationValidator, type PaginationValidatorType, Permission, PERMISSIONS, ZodPipe} from "@/common";

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

  /** get all roles info with pagination
   * - only roles with permission (owner.all or role.view) can accessibility to this route
   */
  @Permission({
    permissions: [PERMISSIONS.ROLE_VIEW]
  })
  @Get()
  @ApiQuery(pagePaginationDto)
  @ApiQuery(limitPaginationDto)
  @ApiQuery(orderByPaginationDto)
  findAll(
    @Query(new ZodPipe(PaginationValidator)) query: PaginationValidatorType
  ) {
    return this.rolesService.findAll(query);
  }
}