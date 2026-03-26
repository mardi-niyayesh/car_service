import type {ApiResponse, BaseException} from "@/types";
import {Permission} from "@/modules/prisma/generated/client";
import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "@/modules/prisma/prisma.service";
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

    const permissions = await this.prisma.permission.findMany({
      orderBy: {
        created_at: orderBy === 'ASC' ? 'asc' : 'desc'
      },
      skip: offset,
      take: limit
    });

    return {
      message: 'permissions successfully found',
      data: {
        permissions
      }
    };
  }
}