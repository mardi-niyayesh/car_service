import type {ApiResponse, BaseException} from "@/types";
import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {Permission, Prisma} from "@/modules/prisma/generated/client";
import {getSafeSqlPaginate, PaginationValidatorType} from "@/common";

export type FindOnePermission = { permission: Permission };
export type PermissionsResponse = { permissions: Permission[] };

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findAll(pagination: PaginationValidatorType): Promise<ApiResponse<PermissionsResponse>> {
    const {orderBy, offset, limit} = getSafeSqlPaginate(pagination);

    const result = await this.prisma.$queryRaw<Permission[]>(
      Prisma.sql`
        SELECT p.id,
               p.name,
               p.description,
               p.created_at,
               p.updated_at
        FROM permissions p
        GROUP BY p.id
        ORDER BY p.created_at ${Prisma.sql([orderBy])}
        LIMIT ${limit} OFFSET ${offset}`
    );

    return {
      message: 'permissions successfully found',
      data: {
        permissions: result
      }
    };
  }
}