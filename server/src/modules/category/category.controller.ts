import * as CategoryDto from "./dto";
import {ApiTags} from "@nestjs/swagger";
import * as CategoryDecorator from "./decorators";
import {CategoryService} from "./category.service";
import {Category} from "@/modules/prisma/generated/client";
import {Body, Controller, Delete, Get, Param, Post, Put, Query, Req} from "@nestjs/common";
import {ZodPipe, UUIDv4Validator, PaginationValidator, type PaginationValidatorType} from "@/common";
import type {AccessRequest, ApiResponse, CategoriesResponse, CategoryResponse, ListWithCount, OwnershipRequest} from "@/types";

/**
 * Category management endpoints for handling category resources.
 *
 * This controller handles:
 * - Retrieving a paginated list of all categories
 * - Fetching a specific category by its ID
 * - Creating new categories (restricted by permission)
 * - Updating existing categories
 * - Deleting categories with owner-aware permission checks
 * - UUID validation for all ID parameters
 * - Response caching for read operations and cache eviction for write operations
 *
 * Public users can read categories, while modification operations
 * require proper permissions such as `owner.all` or category-specific permissions
 * (e.g. `category.create`, `category.update`, `category.delete`).
 *
 * Protected endpoints require authentication via Bearer token.
 */
@Controller('categories')
@ApiTags('Categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /** get one category with slug(unique)
   * - all users can access to this route
   */
  @Get(':id')
  @CategoryDecorator.FindOneDecorators()
  findOne(
    @Param('id', new ZodPipe(UUIDv4Validator)) id: string,
  ): Promise<ApiResponse<CategoryResponse>> {
    return this.categoryService.findOne(id);
  }

  /** get all categories
   * - all users can access to this route
   */
  @Get()
  @CategoryDecorator.FindAllDecorators()
  findAll(
    @Query(new ZodPipe(PaginationValidator)) pagination: PaginationValidatorType
  ): Promise<ApiResponse<ListWithCount<CategoriesResponse>>> {
    return this.categoryService.findAll(pagination);
  }

  /** create a new category
   * - only roles with permission (owner.all or category.create) can accessibility to this route
   */
  @Post()
  @CategoryDecorator.CreateDecorators()
  create(
    @Req() req: AccessRequest,
    @Body(new ZodPipe(CategoryDto.CreateCategoryValidator)) body: CategoryDto.CreateCategoryType,
  ): Promise<ApiResponse<CategoryResponse>> {
    return this.categoryService.create(req.user.userId, body);
  }

  /** delete a category
   * - only roles with permission (owner.all or category.delete) can accessibility to this route
   */
  @Delete(':id')
  @CategoryDecorator.DeleteDecorators()
  delete(
    @Param('id') id: string,
  ): Promise<ApiResponse<CategoryResponse>> {
    return this.categoryService.delete(id);
  }

  /** update a category with id and ownership
   * - only roles with permission (owner.all or category.update) can accessibility to this route
   */
  @Put(':id')
  @CategoryDecorator.UpdateDecorators()
  async update(
    @Req() req: OwnershipRequest<Category>,
    @Param('id') id: string,
    @Body(new ZodPipe(CategoryDto.UpdateCategoryValidator)) body: CategoryDto.UpdateCategoryType,
  ): Promise<ApiResponse<CategoryResponse>> {
    return await this.categoryService.update(id, req.ownershipData, body);
  }
}