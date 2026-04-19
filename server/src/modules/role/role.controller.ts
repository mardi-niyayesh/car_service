import * as RolesDto from "./dto";
import {RoleService} from "./role.service";
import * as RoleDecorator from "./decorators";
import {ApiTags, ApiBearerAuth} from "@nestjs/swagger";
import {Body, Controller, Delete, Get, Post, Query, Req, Param, Put} from "@nestjs/common";
import {ZodPipe, UUIDv4Validator, PaginationValidator, type PaginationValidatorType} from "@/common";
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
  @Get('find')
  @RoleDecorator.FindOneDecorators()
  findOne(
    @Query(new ZodPipe(RolesDto.FindOneRoleValidator)) query: RolesDto.FindOneRoleValidatorType
  ) {
    return this.rolesService.findOne(query);
  }

  /** get all roles info with pagination
   * - only roles with permission (owner.all or role.view) can accessibility to this route
   */
  @Get()
  @RoleDecorator.FindAllDecorators()
  findAll(
    @Query(new ZodPipe(PaginationValidator)) query: PaginationValidatorType
  ): Promise<ApiResponse<FindAllRolesRes>> {
    return this.rolesService.findAll(query);
  }

  /** create a new role with exist permission
   * - only roles with permission (owner.all or role.create) can accessibility to this route
   */
  @Post()
  @RoleDecorator.CreateDecorators()
  create(
    @Req() req: AccessRequest,
    @Body(new ZodPipe(RolesDto.CreateRoleValidator)) data: RolesDto.CreateRoleType
  ): Promise<ApiResponse<FindOneRoleRes>> {
    return this.rolesService.create(req.user, data);
  }

  /** delete exist role with id
   * - only roles with permission (owner.all or role.create) can accessibility to this route
   */
  @Delete(':id')
  @RoleDecorator.DeleteDecorators()
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
  @Put(':id')
  @RoleDecorator.UpdateDecorators()
  update(
    @Param('id', new ZodPipe(UUIDv4Validator)) _id: string,
    @Req() req: OwnershipRequest<RoleIncludeType>,
    @Body(new ZodPipe(RolesDto.UpdateRoleValidator)) body: RolesDto.UpdateRoleType
  ): Promise<ApiResponse<FindOneRoleRes>> {
    return this.rolesService.update(req.ownershipData, req.user, body);
  }
}