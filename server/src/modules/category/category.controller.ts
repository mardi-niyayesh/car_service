import * as CategoryDto from "./dto";
import {CategoryService} from "./category.service";
import {Body, Controller, Get, Post, Req} from "@nestjs/common";
import {Permission, PERMISSIONS, Public, ZodPipe} from "@/common";
import type {AccessRequest, ApiResponse, CategoryResponse} from "@/types";
import {ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiTags} from "@nestjs/swagger";

@Public()
@Controller('categories')
@ApiTags('Categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    return 'find all categories';
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
    only roles with permission (owner.all or category.create) can accessibility to this route`,
    tags: ['Categories']
  })
  @ApiBody({type: CategoryDto.CreateCategoryDto})
  @ApiBadRequestResponse({type: CategoryDto.CreateCategoryBadReq})
  create(
    @Req() req: AccessRequest,
    @Body(new ZodPipe(CategoryDto.CreateCategoryValidator)) body: CategoryDto.CreateCategoryType,
  ): Promise<ApiResponse<CategoryResponse>> {
    return this.categoryService.create(req.user.userId, body);
  }
}