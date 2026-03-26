import {Injectable} from "@nestjs/common";
import {ApiResponse} from "@/types";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {Permission, Prisma} from "@/modules/prisma/generated/client";
import {getSafeSqlPaginate, PaginationValidatorType} from "@/common";

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(pagination: PaginationValidatorType): Promise<ApiResponse<{ permissions: Permission[] }>> {
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