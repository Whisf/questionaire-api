import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { AuthenticationGuard } from 'src/auth/auth.guard'
import { Answer, QuestionCategory, User, UserQuestionAnswer } from 'src/entities'
import { AnswerService } from './answer.service'
import { AnswerDto } from './dtos'

@Controller('answers/categories/:categoryId')
export class AnswerController {
  constructor(private answerService: AnswerService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async getUserAnswers(
    @Req() req: Request,
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ): Promise<Omit<UserQuestionAnswer, 'user'>[]> {
    return this.answerService.getUserAnswerByCategory(req.user as User, categoryId)
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  async saveAnswerByCategory(
    @Req() req: Request,
    @Param('categoryId') categoryId: string,
    @Body('answers') answers: AnswerDto[],
  ): Promise<Omit<UserQuestionAnswer, 'user'>[]> {
    return this.answerService.saveAnswerByCategory(req.user as User, categoryId, answers)
  }
}
