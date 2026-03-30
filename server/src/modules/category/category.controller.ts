import {
  ApiBody,
  ApiTags,
  ApiQuery,
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
  Cacheable,
  Permission,
  PERMISSIONS,
  pagePaginationDto,
  limitPaginationDto,
  PaginationValidator,
  orderByPaginationDto,
  getForbiddenResponse,
  getUnauthorizedResponse,
  type PaginationValidatorType, CacheEvict,
} from "@/common";

import * as CategoryDto from "./dto";
import {CategoryService} from "./category.service";
import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Query, Req} from "@nestjs/common";
import type {AccessRequest, ApiResponse, CategoriesResponse, CategoryResponse} from "@/types";
import {ONE_MINUTE_MS} from "@/lib";

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

  @Permission({
    permissions: [PERMISSIONS.CATEGORY_DELETE],
  })
  @Delete(':id')
  @CacheEvict({
    resource: 'category',
    force: true,
  })
  delete() {
    return 'category delete successfully.';
  }
}