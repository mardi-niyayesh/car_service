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
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
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
  @ApiOperation(RolesDto.findOneRoleOperation)
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
  @ApiOperation(RolesDto.findAllRoleOperation)
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
  @ApiOperation(RolesDto.createRoleOperation)
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
  @Permission<Prisma.RoleInclude>({
    permissions: [PERMISSIONS.ROLE_DELETE],
    owner: true,
    resource: "role",
    include: {
      rolePermissions: {
        include: {permission: true}
      }
    }
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @CacheEvict({
    force: true,
    resource: 'role'
  })
  @ApiOperation(RolesDto.deleteRoleOperation)
  @ApiParam(UUID4Dto('id'))
  @ApiOkResponse({type: RolesDto.OkDeleteRoleRes})
  @ApiBadRequestResponse({type: getBadRequestUUIDParams('roles/id')})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('roles/id')})
  @ApiForbiddenResponse({type: RolesDto.ForbiddenDeleteRoleRes})
  @ApiNotFoundResponse({type: RolesDto.NotFoundRoleRes})
  delete(
    @Req() req: OwnershipRequest<RoleIncludeType>,
    @Param('id', new ZodPipe(UUIDv4Validator)) _id: string
  ): Promise<ApiResponse<FindOneRoleRes>> {
    return this.rolesService.delete(req.ownershipData, req.user);
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
  @ApiOperation(RolesDto.updateRoleOperation)
  @ApiParam(UUID4Dto('id'))
  @ApiBody({type: RolesDto.UpdateRoleDto})
  @ApiOkResponse({type: RolesDto.OkUpdateRoleRes})
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