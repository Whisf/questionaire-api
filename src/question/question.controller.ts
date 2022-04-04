import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseUUIDPipe } from '@nestjs/common'
import { QuestionService } from './question.service'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
import { Request } from 'express'

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('/create')
  create(@Body() createQuestionDto: CreateQuestionDto, @Req() req: Request) {
    return this.questionService.create(createQuestionDto)
  }

  @Get('/findOne/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.questionService.findOne(id)
  }

  @Patch('/edit/:id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(id, updateQuestionDto)
  }

  @Delete('/delete/:id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    console.log(id)
    return this.questionService.remove(id)
  }
}
