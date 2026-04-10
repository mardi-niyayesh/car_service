import * as RolesDto from "./dto";
import {getSafeRole} from "@/lib";
import {Prisma} from "@/modules/prisma/generated/client";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {ConflictException, ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {basePermissions, basicRoles, type PaginationValidatorType, PERMISSIONS, permissionsManagerStrict} from "@/common";
import {ApiResponse, BaseException, FindOneRoleRes, FindAllRolesRes, RoleResponse, UserAccess, RoleIncludeType} from "@/types";

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  /** find one role info with id or name
   * - only roles with permission (owner.all or role.view) can accessibility to this route
   */
  async findOne({id, name}: RolesDto.FindOneRoleValidatorType): Promise<ApiResponse<FindOneRoleRes>> {
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
        role: getSafeRole(role)
      }
    };
  }

  /** get all roles info with pagination
   * - only roles with permission (owner.all or role.view) can accessibility to this route
   */
  findAll(pagination: PaginationValidatorType): Promise<ApiResponse<FindAllRolesRes>> {
    return this.prisma.$transaction(async (tx): Promise<ApiResponse<FindAllRolesRes>> => {
      const count: number = await tx.role.count();

      const roles = await tx.$queryRaw<RoleResponse[]>(
        Prisma.sql`
          SELECT r.id,
             r.name,
             r.created_at,
             r.updated_at,
             r.creator_id,
             ARRAY_AGG(DISTINCT p.name) AS permissions
          FROM roles r
               INNER JOIN role_permission rp ON r.id = rp.role_id
               INNER JOIN permissions p ON rp.permission_id = p.id
          GROUP BY r.id
          ORDER BY r.created_at ${Prisma.sql([pagination.orderByUpper])}
          LIMIT ${pagination.limit} OFFSET ${pagination.offset}`
      );

      return {
        message: 'roles successfully found.',
        data: {
          count,
          roles: roles || [],
        }
      };
    });
  }

  /** create a new role with exist permission
   * - only roles with permission (owner.all or role.create) can accessibility to this route
   */
  create(
    actionPayload: UserAccess,
    {
      name,
      permissions,
      description,
      ownership
    }: RolesDto.CreateRoleType
  ): Promise<ApiResponse<FindOneRoleRes>> {
    return this.prisma.$transaction(async (tx): Promise<ApiResponse<FindOneRoleRes>> => {
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

      // find all permission with id
      const permissionsRecord = await tx.permission.findMany({
        where: {
          id: {
            in: permissions
          }
        }
      });

      // if permission record count !== permission id
      if (permissionsRecord.length !== permissions.length) throw new NotFoundException({
        message: 'One or many Permissions does not exist in database',
        error: 'Permission Not Found',
      } as BaseException);

      const permissionNames: string[] = permissionsRecord.map(p => p.name);

      const isPermissionsBase: string[] = basePermissions.filter(p => permissionNames.includes(p));

      if (isPermissionsBase.length) throw new ForbiddenException({
        message: `you cannot create a new role with base Permissions(${isPermissionsBase.join(', ')})`,
        error: 'Permission Denied, base permission',
      } as BaseException);

      const isActorOwner: boolean = actionPayload.permissions.includes(PERMISSIONS.OWNER_ALL);
      const isPermissionsManager: boolean = permissionNames.some(p => permissionsManagerStrict.includes(p));

      if (!isActorOwner && isPermissionsManager) {
        throw new ForbiddenException({
          message: `High‑level permission protection: 
          You lack the required OWNER privileges to create a role that includes management‑level permissions. 
          (${permissionsManagerStrict.join(", ")})`,
          error: "Permission Denied",
        } as BaseException);
      }

      const creator_id: string | null = ownership ? actionPayload.userId : null;

      const newRole = await tx.role.create({
        data: {
          creator_id,
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

  /** delete exist role with id
   * - only roles with permission (owner.all or role.create) can accessibility to this route
   */
  async delete(roleId: string, actionPayload: UserAccess): Promise<ApiResponse<FindOneRoleRes>> {
    return this.prisma.$transaction(async (tx): Promise<ApiResponse<FindOneRoleRes>> => {
      const roleRecord = await tx.role.findUnique({
        where: {id: roleId},
        include: {
          rolePermissions: {
            include: {permission: true}
          }
        }
      });

      if (!roleRecord) throw new NotFoundException({
        message: 'this Role does not exist in database',
        error: 'Role not found',
      } as BaseException);

      const role = getSafeRole(roleRecord);

      const isBasicRole: boolean = (basicRoles as string[]).includes(roleRecord.name);

      if (isBasicRole) throw new ForbiddenException({
        message: 'Basic roles are essential to the system and cannot be deleted.',
        error: 'Deletion Denied'
      });

      const isActorOwner: boolean = actionPayload.permissions.includes(PERMISSIONS.OWNER_ALL);
      const isRoleManager: boolean = role.permissions.some(p => permissionsManagerStrict.includes(p));

      if (!isActorOwner && isRoleManager) throw new ForbiddenException({
        message: 'You are not allowed to delete a role with management permission. Only the owner can remove this role.',
        error: 'Insufficient permission'
      } as BaseException);

      await tx.role.delete({
        where: {id: roleId},
      });

      return {
        message: "role deleted successfully.",
        data: {
          role
        }
      };
    });
  }

  /** update exist role data with id
   * - **update with ownership**
   * - **only roles with permission (owner.all or role.update) can accessibility to this route**
   */
  update(id: string, newData: RolesDto.UpdateRoleType, role: RoleIncludeType) {

    const conflictData: string[] = [];

    for (const k in newData) {
      if (role[k] === newData[k]) {
        conflictData.push(k);
      }
    }

    if (conflictData.length) throw new ConflictException({
      message: `At least one field must differ from the existing role data. These fields have unchanged values: ${conflictData.join(', ')}.`,
      error: 'Role update conflict'
    } as BaseException);

    console.log(id);
    console.log(newData);
    console.log(role);
  }
}