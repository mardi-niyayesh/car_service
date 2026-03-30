import {
  ApiBody,
  ApiTags,
  ApiQuery,
  ApiParam,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
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
import type {AccessRequest, ApiResponse, CategoriesResponse, CategoryResponse} from "@/types";
import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Req} from "@nestjs/common";

@Controller('categories')
@ApiTags('Categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /** get all categories
   * - all users can access to this route
   */
  @Public()
  @Cacheable({
    resource: 'category',
    pagination: true,
    ttl: ONE_MINUTE_MS * 40
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'get all categories',
    description: 'get all categories. **Access restricted for everyone**',
    operationId: 'get_categories',
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
  })
  @ApiBearerAuth("accessToken")
  @CacheEvict({
    resource: 'category',
    force: true,
  })
  @Delete(':id')
  @ApiParam(UUID4Dto('id'))
  delete(
    @Param(new ZodPipe(UUIDv4Validator)) params: UUID4Type
  ): Promise<ApiResponse<CategoryResponse>> {
    return this.categoryService.delete(params.id);
  }
}