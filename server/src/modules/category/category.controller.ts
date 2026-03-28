import {ApiBearerAuth} from "@nestjs/swagger";
import {Controller, Get} from "@nestjs/common";
import {Permission, PERMISSIONS} from "@/common";
import {CategoryService} from "./category.service";

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Permission({
    permissions: [PERMISSIONS.CATEGORY_CREATE]
  })
  @ApiBearerAuth("accessToken")
  @Get()
  create() {
    return this.categoryService.create();
  }
}