import {Injectable} from "@nestjs/common";
import type {ApiResponse, RoleResponse} from "@/types";
import {Prisma} from "@/modules/prisma/generated/client";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {getSafeSqlPaginate, type PaginationValidatorType} from "@/common";

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

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
}