import {getSafeRoles, getSafeUser} from "@/lib";
import {PrismaService} from "../prisma/prisma.service";
import {Prisma} from "@/modules/prisma/generated/client";
import {ApiResponse, BaseException, UserResponse, ModifyRoleServiceParams} from "@/types";
import {ROLES, PaginationValidatorType, PERMISSIONS, USER_PERMISSIONS, ROLE_PERMISSIONS} from "@/common";
import {BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /** get user info
   * - only users with permission (owner.all or user.view) can accessibility to this route
   */
  async findOne(id: string): Promise<ApiResponse<UserResponse>> {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {include: {permission: true}}
              }
            }
          }
        }
      },
      omit: {
        password: true,
      }
    });

    if (!user) throw new NotFoundException({
      message: "User not exist in database",
      error: "User Not Found",
    } as BaseException);

    const data = getSafeUser(user);

    return {
      message: 'User found successfully',
      data,
    };
  }

  /** get all users info
   * - only users with permission (owner.all or user.view) can accessibility to this route
   */
  async findAll(pagination: PaginationValidatorType): Promise<ApiResponse<{ users: UserResponse[] }>> {
    const {orderBy, limit, offset} = pagination;

    const orderDirection = orderBy === 'desc' ? 'DESC' : 'ASC';

    const result = await this.prisma.$queryRaw<UserResponse[]>(
      Prisma.sql`
          SELECT u.id,
                 u.email,
                 u.display_name,
                 u.age,
                 u.created_at,
                 u.updated_at,
                 ARRAY_AGG(DISTINCT r.name) AS roles,
                 ARRAY_AGG(DISTINCT p.name) AS permissions
          FROM users u
                   INNER JOIN user_roles ur ON u.id = ur.user_id
                   INNER JOIN roles r ON ur.role_id = r.id
                   INNER JOIN role_permission rp ON r.id = rp.role_id
                   INNER JOIN permissions p ON rp.permission_id = p.id
          GROUP BY u.id
          ORDER BY u.created_at ${Prisma.sql([orderDirection])}
          LIMIT ${limit} OFFSET ${offset}`
    );

    return {
      message: "Users Successfully find.",
      data: {
        users: result || []
      }
    };
  }

  /** Assign roles to user
   * - Accessible only by users with 'owner' or 'user_manager' role
   */
  async modifyRole(params: ModifyRoleServiceParams): Promise<ApiResponse<UserResponse>> {
    return this.prisma.$transaction(async tx => {
      const {rolesId, userId, action, actionPayload} = params;

      const targetUserRecord = await tx.user.findUnique({
        where: {
          id: userId
        },
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {include: {permission: true}}
                }
              },
            }
          }
        },
        omit: {password: true}
      });

      if (!targetUserRecord) throw new NotFoundException({
        message: "User not exist in database",
        error: "User Not Found",
      });

      const {user: targetUser} = getSafeUser(targetUserRecord);

      // Prevent self-assignment
      if (targetUser.id === actionPayload.userId) throw new ForbiddenException({
        message: `You cannot ${action} roles to yourself`,
        error: "Permission Denied",
      } as BaseException);

      const newRolesRecord = await tx.role.findMany({
        where: {id: {in: rolesId}},
        include: {
          rolePermissions: {include: {permission: true}}
        }
      });

      // Validate all roles exist
      if (newRolesRecord.length !== rolesId.length) throw new NotFoundException({
        message: 'One or many Roles does not exist in database',
        error: 'Role Not Found',
      } as BaseException);

      const basedRoles: string[] = [ROLES.OWNER, ROLES.SELF];
      const {roles: newRoles, permissions: newPermissions} = getSafeRoles(newRolesRecord);

      // Block restricted roles
      if (newRoles.some(r => basedRoles.includes(r))) throw new ForbiddenException({
        message: `owner and self roles cannot be ${action}ed`,
        error: 'Permission Denied',
      } as BaseException);

      // Target Roles in Array
      const targetPermissions: string[] = targetUser.permissions.map(r => r);

      if (targetPermissions.some(r => r === PERMISSIONS.OWNER_ALL)) throw new ForbiddenException({
        message: `Users with the ${PERMISSIONS.OWNER_ALL} permission have immutable privileges; modifications to their account are strictly prohibited.`,
        error: 'Permission Denied',
      } as BaseException);

      if (action === "assign") {
        const existingRoles: string[] = newRoles.filter(r => targetUser.roles.includes(r));

        // Check for duplicate assignments
        if (existingRoles.length > 0) throw new ConflictException({
          message: `User already has these roles: ${existingRoles.join(", ")}`,
          error: 'Conflict User Roles',
        } as BaseException);
      } else {
        const missingRoles: string[] = newRoles.filter(r => !targetUser.roles.includes(r));

        // Check exist all roles in targetRoles
        if (missingRoles.length > 0) throw new BadRequestException({
          message: `User does not have these roles: ${missingRoles.join(", ")}`,
          error: 'Roles Not Found in Target Roles',
        } as BaseException);
      }

      const permissionsManagerStrict: string[] = [
        PERMISSIONS.OWNER_ALL,
        ...Object.values(USER_PERMISSIONS),
        ...Object.values(ROLE_PERMISSIONS),
      ];

      const isActorOwner: boolean = actionPayload.permissions.includes(PERMISSIONS.OWNER_ALL);
      const isTargetManager: boolean = targetUser.permissions.some(r => permissionsManagerStrict.includes(r));
      const isNewPermissionsManager: boolean = newPermissions.some(r => permissionsManagerStrict.includes(r));

      /**
       * action permission != 'PERMISSIONS.OWNER_ALL':
       * - if new permissions in 'permissionsManagerStrict' or
       * - if target user permissions in 'permissionsManagerStrict'
       */
      if (!isActorOwner && (isTargetManager || isNewPermissionsManager)) throw new ForbiddenException({
        message: `Management level protection: You don't have enough privilege to ${action} high-level permissions in (role_manager, user_manager) role.`,
        error: "Permission Denied",
      } as BaseException);

      if (action === "assign") {
        await tx.userRole.createMany({
          data: rolesId.map(r => ({role_id: r, user_id: targetUser.id}))
        });
      } else {
        await tx.userRole.deleteMany({
          where: {
            user_id: userId,
            role_id: {
              in: rolesId
            }
          }
        });
      }

      const newUserDataRecord = await tx.user.findUnique({
        where: {id: userId},
        include: {
          userRoles: {
            include: {
              role: {
                include: {
                  rolePermissions: {
                    include: {permission: true}
                  }
                }
              }
            }
          }
        },
        omit: {password: true}
      });

      if (!newUserDataRecord) throw new InternalServerErrorException({
        message: "User Not Found in database",
        error: "Something went wrong",
      } as BaseException);

      const newUserData = getSafeUser(newUserDataRecord);

      return {
        message: `Roles successfully ${action === 'assign' ? 'assigned to' : 'revoked from'} this user.`,
        data: newUserData
      };
    });
  }
}