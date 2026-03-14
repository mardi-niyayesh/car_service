import {Injectable} from "@nestjs/common";
import {type PaginationValidatorType} from "@/common";
import type {ApiResponse, RoleResponse} from "@/types";
import {Prisma} from "@/modules/prisma/generated/client";
import {PrismaService} from "@/modules/prisma/prisma.service";

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationValidatorType): Promise<ApiResponse<{roles: RoleResponse[]}>> {
    const {orderBy, limit, offset} = pagination;

    const orderDirection = orderBy === 'desc' ? 'DESC' : 'ASC';

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
          ORDER BY r.created_at ${Prisma.sql([orderDirection])}
          LIMIT ${limit} OFFSET ${offset}`
    );

    return {
      message: 'roles successfully found.',
      data: {
        roles: roles || []
      }
    };
  }
}