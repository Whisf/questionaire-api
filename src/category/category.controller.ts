import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common'
import { CategoryService } from './category.service'
import { UpdateCategoryDto } from './dto/update-category.dto'

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

  @Delete('/:id')
  deleteCategory(@Param('id') categoryId: string) {
    return this.categoryService.deleteCategory(categoryId)
  }

  @Patch('/:id')
  updateCategory(@Param('id') categoryId: string, @Body() payload: UpdateCategoryDto) {
    return this.categoryService.updateCategory(categoryId, payload)
  }
}
