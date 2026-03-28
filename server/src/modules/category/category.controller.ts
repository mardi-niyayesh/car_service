import {ApiBearerAuth} from "@nestjs/swagger";
import {CategoryService} from "./category.service";
import {Controller, Get, Post} from "@nestjs/common";
import {Permission, PERMISSIONS, Public} from "@/common";

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
  create() {
    return this.categoryService.create();
  }
}