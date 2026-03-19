import * as RolesDto from "./dto";
import {Prisma} from "@/modules/prisma/generated/client";
import {PrismaService} from "@/modules/prisma/prisma.service";
import type {ApiResponse, BaseException, RoleResponse, UserAccess} from "@/types";
import {ConflictException, ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {basePermissions, getSafeSqlPaginate, type PaginationValidatorType, PERMISSIONS, permissionsManagerStrict} from "@/common";

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  /** find one role info with id or name
   * - only roles with permission (owner.all or role.view) can accessibility to this route
   */
  async findOne({id, name}: RolesDto.FindOneRoleValidatorType): Promise<ApiResponse<{ role: RoleResponse }>> {
    const role = await this.prisma.role.findUnique({
      where: {id, name},
      include: {
        rolePermissions: {
          include: {permission: true}
        }
      }
    });

    if (!role) throw new NotFoundException({
      message: 'this Role does not exist in database',
      error: 'Role not found',
    } as BaseException);

    return {
      message: 'role successfully found.',
      data: {
        role: {
          id: role.id,
          name: role.name,
          updated_at: role.updated_at,
          created_at: role.created_at,
          creator: role.creator,
          description: role.description,
          permissions: role.rolePermissions.map(rp => rp.permission.name)
        },
      }
    };
  }

  /** get all roles info with pagination
   * - only roles with permission (owner.all or role.view) can accessibility to this route
   */
  async findAll(pagination: PaginationValidatorType): Promise<ApiResponse<{ roles: RoleResponse[] }>> {
    const {orderBy, limit, offset} = getSafeSqlPaginate(pagination);

    const roles = await this.prisma.$queryRaw<RoleResponse[]>(
      Prisma.sql`
          SELECT r.id,
             r.name,
             r.created_at,
             r.updated_at,
             r.creator,
             ARRAY_AGG(DISTINCT p.name) AS permissions
          FROM roles r
               INNER JOIN role_permission rp ON r.id = rp.role_id
               INNER JOIN permissions p ON rp.permission_id = p.id
          GROUP BY r.id
          ORDER BY r.created_at ${Prisma.sql([orderBy])}
          LIMIT ${limit} OFFSET ${offset}`
    );

    return {
      message: 'roles successfully found.',
      data: {
        roles: roles || []
      }
    };
  }

  /** create a new role with exist permissions
   * - only roles with permission (owner.all or role.create) can accessibility to this route
   */
  create(
    actionPayload: UserAccess,
    {name, permissions, description}: RolesDto.CreateRoleType
  ): Promise<ApiResponse<{ role: RoleResponse }>> {
    return this.prisma.$transaction(async (tx): Promise<ApiResponse<{ role: RoleResponse }>> => {
      const existRole = await tx.role.findUnique({
        where: {
          name
        }
      });

      // if role name exist in database
      if (existRole) throw new ConflictException({
        message: 'role name already exists in database',
        error: 'role name conflict'
      } as BaseException);

      // find all permissions with id
      const permissionsRecord = await tx.permission.findMany({
        where: {
          id: {
            in: permissions
          }
        }
      });

      // if permissions record count !== permissions id
      if (permissionsRecord.length !== permissions.length) throw new NotFoundException({
        message: 'One or many Permissions does not exist in database',
        error: 'Permission Not Found',
      } as BaseException);

      const permissionNames = permissionsRecord.map(p => p.name);

      const isPermissionsBase = basePermissions.filter(p => permissionNames.includes(p));

      if (isPermissionsBase.length) throw new ForbiddenException({
        message: `you cannot create a new role with base Permissions(${isPermissionsBase.join(', ')})`,
        error: 'Permission Denied, base permissions',
      } as BaseException);

      const isActorOwner: boolean = actionPayload.permissions.includes(PERMISSIONS.OWNER_ALL);
      const isPermissionsManager: boolean = permissionNames.some(p => permissionsManagerStrict.includes(p));

      if (!isActorOwner && isPermissionsManager) {
        throw new ForbiddenException({
          message: `High‑level permission protection: You lack the required OWNER privileges to create a role that includes management‑level permissions. (${permissionsManagerStrict.join(", ")})`,
          error: "Permission Denied",
        } as BaseException);
      }

      const newRole = await tx.role.create({
        data: {
          creator: actionPayload.userId,
          name,
          description
        }
      });

      await tx.rolePermission.createMany({
        data: permissions.map(p => ({
          role_id: newRole.id,
          permission_id: p
        }))
      });

      return {
        message: 'role successfully created.',
        data: {
          role: {
            ...newRole,
            permissions: permissionNames
          }
        }
      };
    });
  }
}