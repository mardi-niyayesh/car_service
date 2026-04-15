import * as CategoryDto from "./dto";
import {PaginationValidatorType} from "@/common";
import {Category} from "@/modules/prisma/generated/client";
import {PrismaService} from "@/modules/prisma/prisma.service";
import {checkConflictRecord, checkPrismaConflict} from "@/lib";
import {ConflictException, Injectable, NotFoundException} from "@nestjs/common";
import {ApiResponse, BaseException, CategoryResponse, CategoriesResponse, ListWithCount} from "@/types";

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
  async findAll(pagination: PaginationValidatorType): Promise<ApiResponse<ListWithCount<CategoriesResponse>>> {
    const count: number = await this.prisma.category.count();

    const categories = await this.prisma.category.findMany({
      orderBy: {
        created_at: pagination.orderByLower
      },
      take: pagination.limit,
      skip: pagination.offset,
    });

    return {
      message: 'categories successfully found.',
      data: {
        count,
        categories
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
    try {
      const category = await this.prisma.category.create({
        data: {
          slug,
          name,
          description,
          creator_id: ownership ? userId : null
        }
      });

      return {
        message: 'Category successfully created.',
        data: {
          category
        }
      };
    } catch (e) {
      checkPrismaConflict({
        e: e as Error,
        conflictField: 'name',
        mainResource: 'Category',
      });
    }
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
   * - get category from permission guard(ownership)
   */
  async update(
    id: string,
    category: Category,
    data: CategoryDto.UpdateCategoryType,
  ): Promise<ApiResponse<CategoryResponse>> {
    const {conflictData, hasConflict} = checkConflictRecord(data, category);

    if (hasConflict) throw new ConflictException({
      message: `At least one field must differ from the existing category data. These fields have unchanged values: ${conflictData.join(', ')}.`,
      error: 'Category update conflict'
    } as BaseException);

    const {name, slug, description, ownership} = data;

    try {
      const newCategoryData = await this.prisma.category.update({
        where: {id},
        data: {
          name,
          slug,
          description,
          creator_id: ownership === false ? null : undefined
        }
      });

      return {
        message: "category updated successfully.",
        data: {
          category: newCategoryData
        }
      };
    } catch (e) {
      checkPrismaConflict({
        e: e as Error,
        conflictField: 'slug',
        mainResource: 'Category',
      });
    }
  }
}