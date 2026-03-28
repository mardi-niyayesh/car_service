import * as CategoryDto from "./dto";
import {ApiResponse, BaseException} from "@/types";
import {ConflictException, Injectable} from "@nestjs/common";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {Category} from "@/modules/prisma/generated/client";

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  /** create a new category
   * - only roles with permission (owner.all or category.create) can accessibility to this route
   */
  async create(
    userId: string,
    {name, slug, description, ownership}: CategoryDto.CreateCategoryType
  ): Promise<ApiResponse<{ category: Category }>> {
    return this.prisma.$transaction(async (tx): Promise<ApiResponse<{ category: Category }>> => {
      const categoryExist = await tx.category.findUnique({
        where: {slug}
      });

      if (categoryExist) throw new ConflictException({
        message: `Category already exists in database`,
        error: 'category exists'
      } as BaseException);

      const category = await tx.category.create({
        data: {
          slug,
          name,
          description,
          creator: ownership ? userId : null
        }
      });

      return {
        message: 'Category successfully created.',
        data: {
          category
        }
      };
    });
  }
}