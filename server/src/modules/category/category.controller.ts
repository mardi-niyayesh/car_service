import {Controller, Get} from "@nestjs/common";
import {CategoryService} from "./category.service";

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  create() {
    return this.categoryService.create();
  }
}