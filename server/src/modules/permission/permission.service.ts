import {PaginationValidatorType} from "@/common";
import type {ApiResponse, BaseException, ListWithCount} from "@/types";
import {Permission} from "@/modules/prisma/generated/client";
import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "@/modules/prisma/prisma.service";

export type FindOnePermission = { permission: Permission };
export type PermissionsResponse = ListWithCount<{ permissions: Permission[] }>;

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  /** find a permission with id
   * - only roles with permission (owner.all or permission.view) can accessibility to this route
   */
  async find(id: string): Promise<ApiResponse<FindOnePermission>> {
    const permission = await this.prisma.permission.findUnique({
      where: {id}
    });

    if (!permission) throw new NotFoundException({
      message: "this permission not found in database",
      error: 'permission not found'
    } as BaseException);

    return {
      message: 'permission successfully found',
      data: {
        permission
      }
    };
  }

  /** find permission list with pagination
   * - only roles with permission (owner.all or permission.view) can accessibility to this route
   */
  async findAll(pagination: PaginationValidatorType): Promise<ApiResponse<PermissionsResponse>> {
    return this.prisma.$transaction(async (tx): Promise<ApiResponse<PermissionsResponse>> => {
      const count: number = await tx.permission.count();

      const permissions = await tx.permission.findMany({
        orderBy: {
          created_at: pagination.orderByLower
        },
        skip: pagination.offset,
        take: pagination.limit
      });

      return {
        message: 'permission successfully found',
        data: {
          count,
          permissions,
        }
      };
    });
  }
}