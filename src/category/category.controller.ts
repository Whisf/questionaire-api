import { Controller, Get, Query } from '@nestjs/common'
import { CategoryService } from './category.service'

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @Get('/search')
  findByCategory(@Query('title') title: string) {
    return this.categoryService.getCategory(title)
  }

  @Get('')
  getAllCategory() {
    return this.categoryService.getAllCategories()
  }
}
