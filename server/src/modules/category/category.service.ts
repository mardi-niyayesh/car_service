import * as CategoryDto from "./dto";
import {PaginationValidatorType} from "@/common";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {ApiResponse, BaseException, CategoryResponse, CategoriesResponse} from "@/types";
import {Category} from "@/modules/prisma/generated/client";

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  /** get one category with slug(unique)
   * - all users can access to this route
   */
  async findOne(id: string): Promise<ApiResponse<CategoryResponse>> {
    const category = await this.prisma.category.findUnique({
      where: {id},
    });

    if (!category) throw new NotFoundException({
      message: 'Category does not exist in database',
      error: 'Category not found'
    } as BaseException);

    return {
      message: 'category found successfully.',
      data: {
        category
      }
    };
  }

  /** get all categories
   * - all users can access to this route
   */
  async findAll(pagination: PaginationValidatorType): Promise<ApiResponse<CategoriesResponse>> {
    const categories = await this.prisma.category.findMany({
      orderBy: {
        created_at: pagination.orderByLower
      },
      take: pagination.limit,
      skip: pagination.offset
    });

    return {
      message: 'categories successfully found.',
      data: {
        categories,
      }
    };
  }

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

  /** delete a category
   * - only roles with permission (owner.all or category.delete) can accessibility to this route
   */
  async delete(id: string): Promise<ApiResponse<CategoryResponse>> {
    try {
      const category = await this.prisma.category.delete({
        where: {id}
      });

      return {
        message: 'category deleted successfully.',
        data: {
          category
        }
      };
    } catch (_) {
      throw new NotFoundException({
        message: 'Category not found in database',
        error: 'category does not exist'
      } as BaseException);
    }
  }

  /** update a category with id and ownership
   * - only roles with permission (owner.all or category.update) can accessibility to this route
   */
  async update(id: string, data: CategoryDto.UpdateCategoryType, category: Category) {
    const ca = await this.prisma.category.findUnique({
      where: {id}
    });
    console.log(id);
    console.log(data);
    console.log(ca);
    console.log(category);
  }
}