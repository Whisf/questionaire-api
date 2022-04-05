import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { AuthenticationGuard } from 'src/auth/auth.guard'
import { QuestionCategory, User, UserQuestionAnswer } from 'src/entities'
import { AnswerService } from './answer.service'
import { AnswerDto } from './dtos'

@Controller('answers/categories')
export class AnswerController {
  constructor(private answerService: AnswerService) {}

  @Get(':categoryId')
  @UseGuards(AuthenticationGuard)
  async getUserAnswers(@Req() req: Request, @Param('categoryId', ParseUUIDPipe) categoryId: string): Promise<any> {
    return this.answerService.getUserAnswerByCategory(req.user as User, categoryId)
  }

  @Post(':categoryId')
  @UseGuards(AuthenticationGuard)
  async saveAnswerByCategory(
    @Req() req: Request,
    @Param('categoryId') categoryId: string,
    @Body('answers') answers: AnswerDto[],
  ): Promise<Omit<UserQuestionAnswer, 'user'>[]> {
    return this.answerService.saveAnswerByCategory(req.user as User, categoryId, answers)
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  async getCategoryUserAnswers(@Query('title') title: string): Promise<QuestionCategory> {
    return this.answerService.getCategoryUserAnswers(title)
  }
}
