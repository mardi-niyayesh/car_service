import {applyDecorators, HttpCode, HttpStatus} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import * as RolesDto from "@/modules/role/dto";
import * as UserDto from "@/modules/user/dto";
import {
  Cacheable,
  CacheEvict, getBadRequestUUIDParams,
  getForbiddenResponse,
  getUnauthorizedResponse,
  limitPaginationDto,
  orderByPaginationDto,
  pagePaginationDto,
  Permission,
  PERMISSIONS, UUID4Dto,
  UUIDv4Validator
} from "@/common";
import {ONE_MINUTE_MS} from "@/lib";
import {Prisma} from "@/modules/prisma/generated/client";
import z from "zod";

export const FindOneDecorators = () => {
  return applyDecorators(
    Permission({
      permissions: [PERMISSIONS.ROLE_VIEW]
    }),
    Cacheable({
      ttl: ONE_MINUTE_MS * 120,
      resource: 'role',
      query: ['id', 'name'],
    }),
    HttpCode(HttpStatus.OK),
    ApiOperation(RolesDto.findOneRoleOperation),
    ApiQuery(UserDto.ExampleIdQuery),
    ApiQuery(RolesDto.FindOneRoleNameQuery),
    ApiOkResponse({type: RolesDto.FindOneOkResponse}),
    ApiBadRequestResponse({type: RolesDto.FindOneRoleBadReq}),
    ApiUnauthorizedResponse({type: getUnauthorizedResponse('roles/find')}),
    ApiForbiddenResponse({type: getForbiddenResponse('roles/find')}),
    ApiNotFoundResponse({type: RolesDto.NotFoundRoleRes}),
  );
};

export const FindAllDecorators = () => {
  return applyDecorators(
    Permission({
      permissions: [PERMISSIONS.ROLE_VIEW]
    }),
    Cacheable({
      pagination: true,
      resource: "role",
      ttl: ONE_MINUTE_MS * 120,
    }),
    HttpCode(HttpStatus.OK),
    ApiOperation(RolesDto.findAllRoleOperation),
    ApiQuery(pagePaginationDto),
    ApiQuery(limitPaginationDto),
    ApiQuery(orderByPaginationDto),
    ApiOkResponse({type: RolesDto.FindAllRolesOkRes}),
    ApiUnauthorizedResponse({type: getUnauthorizedResponse('roles')}),
    ApiForbiddenResponse({type: getForbiddenResponse('roles')}),
  );
};

export const CreateDecorators = () => {
  return applyDecorators(
    Permission({
      permissions: [PERMISSIONS.ROLE_CREATE]
    }),
    HttpCode(HttpStatus.CREATED),
    CacheEvict({
      force: true,
      resource: 'role'
    }),
    ApiOperation(RolesDto.createRoleOperation),
    ApiBody({type: RolesDto.CreateRoleDto}),
    ApiOkResponse({type: RolesDto.OkCreateRoleRes}),
    ApiBadRequestResponse({type: RolesDto.CreateRoleBadRequest}),
    ApiUnauthorizedResponse({type: getUnauthorizedResponse('roles')}),
    ApiForbiddenResponse({type: RolesDto.CreateRoleForbidden}),
  );
};

export const DeleteDecorators = () => {
  return applyDecorators(
    Permission<Prisma.RoleInclude, z.ZodUUID>({
      permissions: [PERMISSIONS.ROLE_DELETE],
      owner: true,
      resource: "role",
      validatorParam: UUIDv4Validator,
      include: {
        rolePermissions: {
          include: {permission: true}
        }
      }
    }),
    HttpCode(HttpStatus.OK),
    CacheEvict({
      force: true,
      resource: 'role'
    }),
    ApiOperation(RolesDto.deleteRoleOperation),
    ApiParam(UUID4Dto('id')),
    ApiOkResponse({type: RolesDto.OkDeleteRoleRes}),
    ApiBadRequestResponse({type: getBadRequestUUIDParams('roles/id')}),
    ApiUnauthorizedResponse({type: getUnauthorizedResponse('roles/id')}),
    ApiForbiddenResponse({type: RolesDto.ForbiddenDeleteRoleRes}),
    ApiNotFoundResponse({type: RolesDto.NotFoundRoleRes}),
  );
};

export const UpdateDecorators = () => {
  return applyDecorators(
    Permission<Prisma.RoleInclude, z.ZodUUID>({
      permissions: [PERMISSIONS.ROLE_UPDATE],
      owner: true,
      resource: 'role',
      validatorParam: UUIDv4Validator,
      include: {
        rolePermissions: {
          include: {permission: true}
        }
      }
    }),
    HttpCode(HttpStatus.OK),
    CacheEvict({
      force: true,
      resource: 'role'
    }),
    ApiOperation(RolesDto.updateRoleOperation),
    ApiParam(UUID4Dto('id')),
    ApiBody({type: RolesDto.UpdateRoleDto}),
    ApiOkResponse({type: RolesDto.OkUpdateRoleRes}),
    ApiBadRequestResponse({type: RolesDto.UpdateRoleBadReq}),
    ApiUnauthorizedResponse({type: getUnauthorizedResponse('roles/id')}),
    ApiForbiddenResponse({
      type: getForbiddenResponse('roles/id', {
        resource: 'role',
        required_mode: 'ANY',
        missing_permissions: ['role.update'],
        required_permissions: ['role.update'],
      })
    }),
    ApiConflictResponse({type: RolesDto.UpdateRoleConflict}),
  );
};