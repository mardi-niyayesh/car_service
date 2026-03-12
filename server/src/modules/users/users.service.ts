import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';

import * as UserDto from "./dto";
import {PrismaService} from "../prisma/prisma.service";
import {Prisma} from "@/modules/prisma/generated/client";
import {getSafeRoles, getSafeUser, compareSecret, hashSecret} from "@/lib";
import {ApiResponse, BaseException, UserResponse, ModifyRoleServiceParams} from "@/types";
import {PaginationValidatorType, PERMISSIONS, USER_PERMISSIONS, ROLE_PERMISSIONS, BASE_PERMISSIONS} from "@/common";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /** get user info
   * - only users with permission (owner.all or user.view) can accessibility to this route
   */
  async findOne(id?: string, email?: string): Promise<ApiResponse<UserResponse>> {
    if (!id && !email) throw new BadRequestException({
      message: 'email or id must be provided',
      error: 'id and email does not exist'
    } as BaseException);

    const user = await this.prisma.user.findUnique({
      where: {
        id,
        email
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

  /**
   * Update user profile data.
   * - Requires authentication and "user.self" permission.
   */
  async updateProfile(id: string, {age, display_name}: UserDto.UpdateProfileType): Promise<ApiResponse<UserResponse>> {
    return this.prisma.$transaction(async tx => {
      const user = await tx.user.findUnique({
        where: {id},
        omit: {password: true},
      });

      if (!user) throw new NotFoundException({
        message: "User not exist in database",
        error: "User Not Found",
      } as BaseException);

      const conflictData: string[] = [];

      if (age === user.age) conflictData.push('age');
      if (display_name === user.display_name) conflictData.push('display_name');

      if (conflictData.length) {
        throw new ConflictException({
          message: `No changes detected in the provided data. Please update at least one field.`,
          error: `Data Unchanged (${conflictData.join(', ')})`
        } as BaseException);
      }

      const newUserData = await tx.user.update({
        where: {id},
        data: {
          age,
          display_name,
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
        omit: {password: true},
      });

      const safeUser = getSafeUser(newUserData);

      return {
        message: 'User profile updated successfully.',
        data: safeUser,
      };
    });
  }

  /**
   * Update Current Password.
   * - **Requires authentication and "user.self" permission.**
   */
  updatePassword(id: string, {oldPassword, newPassword}: UserDto.UpdatePasswordType): Promise<ApiResponse<UserResponse>> {
    return this.prisma.$transaction(async tx => {
      const user = await tx.user.findUnique({
        where: {id},
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
        }
      });

      if (!user) throw new NotFoundException({
        message: "User not exist in database",
        error: "User Not Found",
      } as BaseException);

      const isValidPassword: boolean = await compareSecret(oldPassword, user.password);

      if (!isValidPassword) {
        throw new UnauthorizedException({
          message: "The provided old password does not match.",
          error: "Invalid old password.",
        } as BaseException);
      }

      const hashedNewPass: string = await hashSecret(newPassword);

      await tx.user.update({
        where: {id},
        data: {
          password: hashedNewPass
        }
      });

      return {
        message: 'User profile updated successfully.',
        data: getSafeUser(user),
      };
    });
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

      const basePermissions: string[] = Object.values(BASE_PERMISSIONS);
      const {roles: newRoles, permissions: newPermissions} = getSafeRoles(newRolesRecord);

      // Block restricted roles
      const restricted: string[] = newPermissions.filter(r => basePermissions.includes(r));

      if (restricted.length)
        throw new ForbiddenException({
          message: `Roles containing base permissions (${restricted.join(", ")}) cannot be ${action}ed.`,
          error: "Permission Denied",
        } as BaseException);

      // Target Roles in Array
      const targetPermissions: string[] = targetUser.permissions.map(r => r);

      if (targetPermissions.some(r => r === PERMISSIONS.OWNER_ALL)) throw new ForbiddenException({
        message: `Users with the '${PERMISSIONS.OWNER_ALL}' permission have immutable privileges; modifications to their account are strictly prohibited.`,
        error: 'Permission Denied',
      } as BaseException);

      if (action === "assign") {
        const existingRoles: string[] = newRoles.filter(r => targetUser.roles.includes(r));

        // Check for duplicate assignments
        if (existingRoles.length) throw new ConflictException({
          message: `User already has these roles: ${existingRoles.join(", ")}`,
          error: 'Conflict User Roles',
        } as BaseException);
      } else {
        const missingRoles: string[] = newRoles.filter(r => !targetUser.roles.includes(r));

        // Check exist all roles in targetRoles
        if (missingRoles.length) throw new BadRequestException({
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
        message: `High-level role protection: 
        You don't have OWNER privileges required to ${action} permissions affecting management-level roles (${permissionsManagerStrict.join(", ")}).`,
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