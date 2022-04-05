import { Controller, Get, Query } from '@nestjs/common'
import { CategoryService } from './category.service'

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Get('/category')
  findByCategory(@Query('title') title: string) {
    return this.categoryService.getCategory(title)
  }

  @Get('/categories')
  getAllCategory() {
    return this.categoryService.getAllCategories()
  }
}
