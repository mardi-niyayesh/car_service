import * as CategoryDto from "./dto";
import {ConflictException, Injectable} from "@nestjs/common";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {ApiResponse, BaseException, CategoryResponse} from "@/types";

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  /** create a new category
   * - only roles with permission (owner.all or category.create) can accessibility to this route
   */
  async create(
    userId: string,
    {name, slug, description, ownership}: CategoryDto.CreateCategoryType
  ): Promise<ApiResponse<CategoryResponse>> {
    return this.prisma.$transaction(async (tx): Promise<ApiResponse<CategoryResponse>> => {
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