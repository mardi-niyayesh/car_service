import {
  ZodPipe,
  UUID4Dto,
  Cacheable,
  CacheEvict,
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

import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse, ApiConflictResponse,
} from "@nestjs/swagger";

import * as RolesDto from "./dto";
import {ONE_MINUTE_MS} from "@/lib";
import * as UserDto from "../user/dto";
import {RoleService} from "./role.service";
import {Prisma} from "@/modules/prisma/generated/client";
import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query, Req, Param, Put} from "@nestjs/common";
import type {AccessRequest, ApiResponse, FindOneRoleRes, FindAllRolesRes, OwnershipRequest, RoleIncludeType} from "@/types";

/**
 * Role management endpoints for creating and managing custom roles.
 *
 * This controller handles:
 * - Creating new custom roles with specific permission sets
 * - Updating existing custom role details and permission
 * - Deleting custom roles (with appropriate safeguards)
 * - Listing all available roles (both default and custom)
 *
 * Role Management Rules:
 * - Default system roles (self, owner) or other default roles are protected and cannot be modified
 * - Only users with 'owner' or 'role_manager' role can create, update, or delete custom roles
 * - Permissions assigned to roles are system-defined and cannot be altered
 *
 * All endpoints require authentication via Bearer token with appropriate permission.
 */
@ApiTags("Roles")
@Controller("roles")
@ApiBearerAuth("accessToken")
export class RoleController {
  constructor(private readonly rolesService: RoleService) {}

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
    description: `- **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.ROLE_VIEW}\``,
  })
  @ApiQuery(UserDto.ExampleIdQuery)
  @ApiQuery(RolesDto.FindOneRoleNameQuery)
  @ApiOkResponse({type: RolesDto.FindOneOkResponse})
  @ApiBadRequestResponse({type: RolesDto.FindOneRoleBadReq})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('roles/find')})
  @ApiForbiddenResponse({type: getForbiddenResponse('roles/find')})
  @ApiNotFoundResponse({type: RolesDto.NotFoundRoleRes})
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
    description: `- **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.ROLE_VIEW}\``,
  })
  @ApiQuery(pagePaginationDto)
  @ApiQuery(limitPaginationDto)
  @ApiQuery(orderByPaginationDto)
  @ApiOkResponse({type: RolesDto.FindAllRolesOkRes})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('roles')})
  @ApiForbiddenResponse({type: getForbiddenResponse('roles')})
  findAll(
    @Query(new ZodPipe(PaginationValidator)) query: PaginationValidatorType
  ): Promise<ApiResponse<FindAllRolesRes>> {
    return this.rolesService.findAll(query);
  }

  /** create a new role with exist permission
   * - only roles with permission (owner.all or role.create) can accessibility to this route
   */
  @Permission({
    permissions: [PERMISSIONS.ROLE_CREATE]
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CacheEvict({
    force: true,
    resource: 'role'
  })
  @ApiOperation({
    summary: 'Create a new custom role with specific permission',
    description: `
  - **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.ROLE_CREATE}\`\n
  
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
    operationId: 'create_role'
  })
  @ApiBody({type: RolesDto.CreateRoleDto})
  @ApiOkResponse({type: RolesDto.OkCreateRoleRes})
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
  @HttpCode(HttpStatus.OK)
  @CacheEvict({
    force: true,
    resource: 'role'
  })
  @ApiOperation({
    summary: 'Delete an existing role from the system',
    description: `
  - **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.ROLE_DELETE}\`\n
    
  Deletes a role from the system while enforcing strict security policies to preserve the integrity 
  of the Role‑Based Access Control (RBAC) model.
  
  - **Access control**: This endpoint is accessible only to users who possess the 
    **"role.delete"** or **"owner.all"** permission.
  
  - **Strict existence validation**: The system first verifies that the specified role exists 
    in the database. If the role does not exist, the operation immediately fails with a 
    **Role Not Found** error.
  
  - **Core system role protection**: Fundamental system roles (base roles) are permanently 
    protected and cannot be deleted under any circumstances. These roles are essential for 
    maintaining the core authorization structure of the platform.
  
  - **Role ownership protection**: If a role was created by another user, only a user with the 
    **"owner.all"** permission is allowed to delete it. Standard role managers cannot remove 
    roles created by other administrators. This rule prevents unauthorized modification of 
    roles owned by other privileged users.
  
  - **Management‑level permission protection (Anti‑Privilege Escalation)**: Roles that contain 
    sensitive or high‑level administrative permissions are considered critical. Deleting such 
    roles is strictly restricted to users who possess the **"owner.all"** privilege.
  
  - **Security safeguard**: These restrictions ensure that administrators cannot weaken the 
    system’s authorization model by deleting protected or high‑privilege roles.
  
  - **Atomic execution**: The deletion process runs inside a database transaction to guarantee 
    consistency and prevent partial operations that could compromise RBAC integrity.
  
  This endpoint ensures that role deletion is performed safely while protecting critical roles 
  and preventing privilege abuse or structural manipulation of the authorization system.`,
    operationId: 'delete_role'
  })
  @ApiParam(UUID4Dto('id'))
  @ApiOkResponse({type: RolesDto.OkDeleteRoleRes})
  @ApiBadRequestResponse({type: getBadRequestUUIDParams('roles/id')})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('roles/id')})
  @ApiForbiddenResponse({type: RolesDto.ForbiddenDeleteRoleRes})
  @ApiNotFoundResponse({type: RolesDto.NotFoundRoleRes})
  delete(
    @Req() req: AccessRequest,
    @Param('id', new ZodPipe(UUIDv4Validator)) id: string
  ): Promise<ApiResponse<FindOneRoleRes>> {
    return this.rolesService.delete(id, req.user);
  }

  /** update exist role data with id
   * - **update with ownership**
   * - **only roles with permission (owner.all or role.update) can accessibility to this route**
   */
  @Permission<Prisma.RoleInclude>({
    permissions: [PERMISSIONS.ROLE_UPDATE],
    owner: true,
    resource: 'role',
    include: {
      rolePermissions: {
        include: {permission: true}
      }
    }
  })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @CacheEvict({
    force: true,
    resource: 'role'
  })
  @ApiOperation({
    summary: 'Update an existing role',
    description: `
  - **🔐 PERMISSIONS REQUIRED:** \`${PERMISSIONS.ROLE_UPDATE}\`\n
  
  Updates the metadata and permissions of an existing role while enforcing strict security rules to preserve the integrity of the Role‑Based Access Control (RBAC) model.
  
  - **Access control**: This endpoint is accessible only to users who possess the **"role.update"** permission or the **"owner.all"** privilege. Ownership rules are enforced automatically to ensure that role modifications respect administrative boundaries.
  
  - **Strict role existence validation**: The system verifies that the specified role exists and is accessible to the acting user. If the role cannot be resolved, the operation fails immediately.
  
  - **Core system role protection**: Fundamental system roles (base roles) are permanently protected and **cannot be modified under any circumstances**. These roles are essential for maintaining the platform’s authorization structure.
  
  - **High‑level permission protection (Anti‑Privilege Escalation)**: Roles that contain **management‑level or sensitive administrative permissions** are considered critical. Updating such roles is **restricted exclusively to users with the "owner.all" privilege**.
  
  - **Administrative permission assignment protection**: When adding new permissions to a role, the system validates the security level of each permission. If the requested permissions include **high‑level management permissions**, only users with the **"owner.all"** privilege are allowed to assign them.
  
  - **Permission integrity validation**:
    - Permissions scheduled for **removal must already exist in the role**.
    - Permissions scheduled for **addition must exist in the database**.
    - Duplicate or inconsistent permission assignments are rejected.
  
  - **Change integrity validation**: At least **one field must differ from the existing role data**. If all provided values match the current role state, the request fails with a **Role Update Conflict** error.
  
  - **Atomic execution**: The entire update process runs inside a **database transaction** to guarantee consistency and prevent partial updates that could compromise RBAC integrity.
  
  These safeguards ensure that role updates remain secure while preventing privilege escalation and protecting critical authorization structures.
`,
    operationId: 'update_role'
  })
  @ApiParam(UUID4Dto('id'))
  @ApiBody({type: RolesDto.UpdateRoleDto})
  @ApiBadRequestResponse({type: RolesDto.UpdateRoleBadReq})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('roles/id')})
  @ApiForbiddenResponse({
    type: getForbiddenResponse('roles/id', {
      resource: 'role',
      required_mode: 'ANY',
      missing_permissions: ['role.update'],
      required_permissions: ['role.update'],
    })
  })
  @ApiConflictResponse({type: RolesDto.UpdateRoleConflict})
  update(
    @Param('id', new ZodPipe(UUIDv4Validator)) _id: string,
    @Req() req: OwnershipRequest<RoleIncludeType>,
    @Body(new ZodPipe(RolesDto.UpdateRoleValidator)) body: RolesDto.UpdateRoleType
  ): Promise<ApiResponse<FindOneRoleRes>> {
    return this.rolesService.update(req.ownershipData, req.user, body);
  }
}