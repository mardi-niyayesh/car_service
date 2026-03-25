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
  orderByPaginationDto,
  getForbiddenResponse,
  getUnauthorizedResponse,
  type PaginationValidatorType,
} from "@/common";

import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import * as RolesDto from "./dto";
import {ONE_MINUTE_MS} from "@/lib";
import * as UserDto from "../users/dto";
import {RolesService} from "@/modules/roles/roles.service";
import type {AccessRequest, ApiResponse, FindOneRoleRes, RoleResponse} from "@/types";
import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query, Req, Param} from "@nestjs/common";

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
@ApiTags("Role")
@Controller("roles")
@ApiBearerAuth("accessToken")
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /** find one role info with id or name
   * - only roles with permission (owner.all or role.view) can accessibility to this route
   */
  @Permission({
    permissions: [PERMISSIONS.ROLE_VIEW]
  })
  @Cacheable({
    ttl: ONE_MINUTE_MS * 120,
    resource: 'role',
    query: ['id', 'name'],
  })
  @Get('find')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "find one role with id or name",
    operationId: 'find_role',
    tags: ["Role"],
  })
  @ApiQuery(UserDto.ExampleIdQuery)
  @ApiQuery(RolesDto.FindOneRoleNameQuery)
  @ApiOkResponse({type: RolesDto.FindOneOkResponse})
  @ApiBadRequestResponse({type: RolesDto.FindOneRoleBadReq})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('roles/find')})
  @ApiForbiddenResponse({type: getForbiddenResponse('roles/find')})
  findOne(
    @Query(new ZodPipe(RolesDto.FindOneRoleValidator)) query: RolesDto.FindOneRoleValidatorType
  ) {
    return this.rolesService.findOne(query);
  }

  /** get all roles info with pagination
   * - only roles with permission (owner.all or role.view) can accessibility to this route
   */
  @Permission({
    permissions: [PERMISSIONS.ROLE_VIEW]
  })
  @Cacheable({
    pagination: true,
    resource: "role",
    ttl: ONE_MINUTE_MS * 120,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get all roles from the list of pagination",
    operationId: 'get_all_role',
    tags: ["Role"],
  })
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

  /** create a new role with exist permissions
   * - only roles with permission (owner.all or role.create) can accessibility to this route
   */
  @Permission({
    permissions: [PERMISSIONS.ROLE_CREATE]
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new custom role with specific permissions',
    description: `
  Creates a new role and assigns a set of existing permissions to it with strict security and validation enforcement:
  
  - **Access control**: This endpoint is strictly accessible only to users who possess the 
    **"role.create"** or **"owner.all"** permission.
  - **Uniqueness guarantee**: The role name must be globally unique. The system will reject 
    the request with a conflict error if a role with the same name already exists.
  - **Strict existence validation**: All requested permission IDs must already exist in the database. 
    The entire operation will abort if even a single permission ID is invalid or missing.
  - **Base permissions restriction**: Custom roles cannot be created containing core/base permissions 
    (e.g., "owner.all", "user.self"). This prevents unauthorized users from accidentally or 
    maliciously creating backdoor owner accounts or overriding fundamental system behaviors.
  - **Management-level protection (Anti-Privilege Escalation)**: Creating roles that include 
    sensitive administrative permissions (such as those starting with "role." or "user.") is 
    exclusively reserved for users with the **"owner.all"** privilege. Standard role creators 
    cannot forge roles with higher clearances than their own.
  - **Atomic execution**: Role creation and permission binding are executed inside a unified 
    database transaction. This ensures absolute data integrity—preventing scenarios where a 
    role is created but its permissions fail to attach.
  
  This endpoint is designed to safely expand the system's Role-Based Access Control (RBAC) 
  while strictly preventing privilege escalation and structural manipulation.`,
    operationId: 'create_role',
    tags: ["Role"],
  })
  @ApiBody({type: RolesDto.CreateRoleDto})
  @ApiBadRequestResponse({type: RolesDto.CreateRoleBadRequest})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('roles')})
  @ApiForbiddenResponse({type: RolesDto.CreateRoleForbidden})
  create(
    @Req() req: AccessRequest,
    @Body(new ZodPipe(RolesDto.CreateRoleValidator)) data: RolesDto.CreateRoleType
  ): Promise<ApiResponse<FindOneRoleRes>> {
    return this.rolesService.create(req.user, data);
  }

  /** delete exist role with id
   * - only roles with permission (owner.all or role.create) can accessibility to this route
   */
  @Permission({
    permissions: [PERMISSIONS.ROLE_DELETE],
    owner: true,
    resource: "role",
  })
  @Delete(':id')
  @ApiParam(UUID4Dto('id'))
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('roles/id')})
  delete(
    @Req() req: AccessRequest,
    @Param(new ZodPipe(UUIDv4Validator)) {id}: UUID4Type
  ): Promise<ApiResponse<FindOneRoleRes>> {
    return this.rolesService.delete(id, req.user);
  }
}