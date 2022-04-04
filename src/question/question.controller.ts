import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common'
import { QuestionService } from './question.service'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
import { Request } from 'express'

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto, @Req() req: Request) {
    return this.questionService.create(createQuestionDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    console.log(req.user)
    return this.questionService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(+id, updateQuestionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id)
  }
}
