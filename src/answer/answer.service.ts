import { BadRequestException, Injectable } from '@nestjs/common'
import { Answer, Question, QuestionCategory, User, UserQuestionAnswer } from 'src/entities'
import { Connection } from 'typeorm'
import { AnswerDto } from './dtos'

@Injectable()
export class AnswerService {
  constructor(private connection: Connection) {}

  async getUserAnswerByCategory(user: User, categoryId: string): Promise<any> {
    const userQuestionAnswers = await this.connection.manager
      .createQueryBuilder(UserQuestionAnswer, 'userQuestionAnswer')
      .leftJoinAndSelect('userQuestionAnswer.user', 'user')
      .leftJoinAndSelect('userQuestionAnswer.question', 'question')
      .leftJoinAndSelect('userQuestionAnswer.answer', 'answer')
      .leftJoinAndSelect('question.questionCategory', 'questionCategory')
      .andWhere('questionCategory.id = :questionCategoryId', { questionCategoryId: categoryId })
      .andWhere('user.id = :userId', { userId: user.id })
      .getMany()

    let result = 0
    for (const userQuestionAnswer of userQuestionAnswers) {
      if (userQuestionAnswer?.answer?.isTrue) {
        result += 1
      }
    }

    const dataReturn = userQuestionAnswers.map((userQuestionAnswer) => {
      const { user, ...rest } = userQuestionAnswer
      return rest
    })

    return { userQuestionAnswers: dataReturn, result }
  }

  async saveAnswerByCategory(
    user: User,
    categoryId: string,
    answers: AnswerDto[],
  ): Promise<Omit<UserQuestionAnswer, 'user'>[]> {
    return this.connection.transaction(async (manager) => {
      const arrPromises = answers.map(async (data) => {
        const { questionId, answerId } = data

        const question = await manager.findOne(Question, {
          where: { id: questionId, questionCategory: { id: categoryId } },
        })

        if (!question) {
          throw new BadRequestException('Question not found')
        }

        const answer = await manager.findOne(Answer, {
          where: { id: answerId, question: { id: questionId } },
        })

        if (!answer) {
          throw new BadRequestException('Answer not found')
        }

        const questionAnswerExisting = await manager.findOne(UserQuestionAnswer, {
          where: { user: { id: user.id }, question },
        })

        const { user: omitProps, ...returnData } = await manager.save(UserQuestionAnswer, {
          id: questionAnswerExisting?.id,
          user: { id: user.id },
          question,
          answer,
        } as UserQuestionAnswer)

        return returnData
      })

      return Promise.all(arrPromises)
    })
  }

  async getCategoryUserAnswers(title: string): Promise<QuestionCategory> {
    return this.connection.manager
      .createQueryBuilder(QuestionCategory, 'questionCategory')
      .leftJoinAndSelect('questionCategory.questions', 'questions')
      .leftJoinAndSelect('questions.userQuestionAnswers', 'userQuestionAnswers')
      .leftJoinAndSelect('userQuestionAnswers.user', 'user')
      .leftJoinAndSelect('userQuestionAnswers.answer', 'answer')
      .where('questionCategory.title = :title', { title })
      .getOne()
  }
}
