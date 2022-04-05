import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common'
import { QuestionService } from './question.service'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
import { CategoryService } from 'src/category/category.service'

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService, private readonly categoryService: CategoryService) {}

  @Post('/create')
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.createQuestion(createQuestionDto)
  }

  @Get('/category')
  findByCategory(@Query('title') title: string) {
    return this.categoryService.getCategory(title)
  }

  @Get('/categories')
  getAllCategory() {
    return this.categoryService.getAllCategories()
  }

  @Get('/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionService.findOne(id)
  }

  @Patch('/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(id, updateQuestionDto)
  }

  @Delete('/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionService.remove(id)
  }
}
