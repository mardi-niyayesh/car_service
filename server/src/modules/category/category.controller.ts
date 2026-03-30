import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import * as CategoryDto from "./dto";
import {CategoryService} from "./category.service";
import {Body, Controller, Get, Post, Query, Req} from "@nestjs/common";
import type {AccessRequest, ApiResponse, CategoriesResponse, CategoryResponse} from "@/types";
import {getForbiddenResponse, getUnauthorizedResponse, PaginationValidator, type PaginationValidatorType, Permission, PERMISSIONS, Public, ZodPipe} from "@/common";

@Controller('categories')
@ApiTags('Categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /** get all categories
   * - all users can access to this route
   */
  @Public()
  @Get()
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
}