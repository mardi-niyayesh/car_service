import * as CategoryDto from "./dto";
import {CategoryService} from "./category.service";
import {ApiBearerAuth, ApiBody} from "@nestjs/swagger";
import {Body, Controller, Get, Post} from "@nestjs/common";
import {Permission, PERMISSIONS, Public, ZodPipe} from "@/common";

@Public()
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll() {
    return 'find all categories';
  }

  @Permission({
    permissions: [PERMISSIONS.CATEGORY_CREATE]
  })
  @ApiBearerAuth("accessToken")
  @Post()
  @ApiBody({type: CategoryDto.CreateCategoryDto})
  create(
    @Body(new ZodPipe(CategoryDto.CreateCategoryValidator)) body: CategoryDto.CreateCategoryType,
  ) {
    console.log(body);
    return this.categoryService.create();
  }
}