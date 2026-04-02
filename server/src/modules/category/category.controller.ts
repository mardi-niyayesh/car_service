import {
  ApiBody,
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import {
  Public,
  ZodPipe,
  UUID4Dto,
  Cacheable,
  Permission,
  CacheEvict,
  PERMISSIONS,
  type UUID4Type,
  UUIDv4Validator,
  pagePaginationDto,
  limitPaginationDto,
  PaginationValidator,
  orderByPaginationDto,
  getForbiddenResponse,
  getUnauthorizedResponse,
  type PaginationValidatorType,
} from "@/common";

import {ONE_MINUTE_MS} from "@/lib";
import * as CategoryDto from "./dto";
import {CategoryService} from "./category.service";
import {Category} from "@/modules/prisma/generated/client";
import type {AccessRequest, ApiResponse, CategoriesResponse, CategoryResponse, OwnershipRequest} from "@/types";
import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req} from "@nestjs/common";

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
  @Public()
  @Cacheable({
    resource: 'category',
    paramsKey: ['id'],
    ttl: ONE_MINUTE_MS * 60
  })
  @Get(':id')
  @ApiOperation({
    summary: 'find one category',
    description: 'find one category with id unique. **Access restricted for everyone**',
    operationId: 'get_one_categories',
  })
  @ApiParam(UUID4Dto('id'))
  @ApiOkResponse({type: CategoryDto.FindOneCategoryOkRes})
  @ApiBadRequestResponse({type: CategoryDto.FindOneBadRequest})
  @ApiNotFoundResponse({type: CategoryDto.FindOneCategoryNotFound})
  findOne(
    @Param(new ZodPipe(UUIDv4Validator)) params: UUID4Type,
  ): Promise<ApiResponse<CategoryResponse>> {
    return this.categoryService.findOne(params.id);
  }

  /** get all categories
   * - all users can access to this route
   */
  @Public()
  @Cacheable({
    resource: 'category',
    pagination: true,
    ttl: ONE_MINUTE_MS * 60
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'get all categories',
    description: 'get all categories. **Access restricted for everyone**',
    operationId: 'get_all_categories',
  })
  @ApiQuery(pagePaginationDto)
  @ApiQuery(limitPaginationDto)
  @ApiQuery(orderByPaginationDto)
  @ApiOkResponse({type: CategoryDto.FindAllCategoriesRes})
  findAll(
    @Query(new ZodPipe(PaginationValidator)) pagination: PaginationValidatorType
  ): Promise<ApiResponse<CategoriesResponse>> {
    return this.categoryService.findAll(pagination);
  }

  /** create a new category
   * - only roles with permission (owner.all or category.create) can accessibility to this route
   */
  @Permission({
    permissions: [PERMISSIONS.CATEGORY_CREATE]
  })
  @ApiBearerAuth("accessToken")
  @Post()
  @ApiOperation({
    summary: "create a new category",
    description: `Create a category
    only roles with permission (owner.all or category.create) can accessibility to this route`
  })
  @ApiBody({type: CategoryDto.CreateCategoryDto})
  @ApiOkResponse({type: CategoryDto.CreateCategoryOkRes})
  @ApiBadRequestResponse({type: CategoryDto.CreateCategoryBadReq})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('categories')})
  @ApiForbiddenResponse({type: getForbiddenResponse('categories')})
  @ApiConflictResponse({type: CategoryDto.CrateCategoryConflict})
  create(
    @Req() req: AccessRequest,
    @Body(new ZodPipe(CategoryDto.CreateCategoryValidator)) body: CategoryDto.CreateCategoryType,
  ): Promise<ApiResponse<CategoryResponse>> {
    return this.categoryService.create(req.user.userId, body);
  }

  /** delete a category
   * - only roles with permission (owner.all or category.delete) can accessibility to this route
   */
  @Permission({
    permissions: [PERMISSIONS.CATEGORY_DELETE],
    owner: true,
    resource: "category",
  })
  @ApiBearerAuth("accessToken")
  @CacheEvict({
    resource: 'category',
    findPrefix: {
      param: 'id'
    },
  })
  @Delete(':id')
  @ApiOperation({
    summary: 'delete a category',
    description: 'delete a category with id nd ownership. **only roles with permission (owner.all or category.delete) can accessibility to this route**',
    operationId: 'delete_categories',
  })
  @ApiParam(UUID4Dto('id'))
  @ApiOkResponse({type: CategoryDto.DeleteCategoryOkRes})
  @ApiUnauthorizedResponse({type: getUnauthorizedResponse('categories/id')})
  @ApiForbiddenResponse({type: CategoryDto.DeleteForbiddenResponse})
  @ApiNotFoundResponse({type: CategoryDto.DeleteCategoryNotFound})
  delete(
    @Param(new ZodPipe(UUIDv4Validator)) params: UUID4Type
  ): Promise<ApiResponse<CategoryResponse>> {
    return this.categoryService.delete(params.id);
  }

  /** update a category with id and ownership
   * - only roles with permission (owner.all or category.update) can accessibility to this route
   */
  @Permission({
    permissions: [PERMISSIONS.CATEGORY_UPDATE],
    owner: true,
    resource: "category",
  })
  @ApiBearerAuth("accessToken")
  @CacheEvict({
    findPrefix: {
      param: 'id'
    },
    resource: 'category',
  })
  @Put(':id')
  @ApiOperation({
    summary: 'update a category',
    description: 'update a category with id and ownership. **only roles with permission (owner.all or category.update) can accessibility to this route**',
    operationId: 'update_categories',
  })
  @ApiBody({type: CategoryDto.UpdateCategoryDto})
  @ApiParam(UUID4Dto('id'))
  @ApiForbiddenResponse({type: CategoryDto.ForbiddenUpdateCategoryRes})
  async update(
    @Req() req: OwnershipRequest<Category>,
    @Param(new ZodPipe(UUIDv4Validator)) params: UUID4Type,
    @Body(new ZodPipe(CategoryDto.UpdateCategoryValidator)) body: CategoryDto.UpdateCategoryType,
  ) {
    await this.categoryService.update(params.id, body, req.ownershipData);
    return 'category updated successfully.';
  }
}