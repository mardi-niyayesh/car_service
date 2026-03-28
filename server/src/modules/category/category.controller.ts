import * as CategoryDto from "./dto";
import {CategoryService} from "./category.service";
import {Body, Controller, Get, Post} from "@nestjs/common";
import {Permission, PERMISSIONS, Public, ZodPipe} from "@/common";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiTags} from "@nestjs/swagger";

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
  create(
    @Body(new ZodPipe(CategoryDto.CreateCategoryValidator)) body: CategoryDto.CreateCategoryType,
  ) {
    console.log(body);
    return this.categoryService.create();
  }
}