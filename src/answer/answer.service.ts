import { Injectable } from '@nestjs/common'
import { Answer, Question, User, UserQuestionAnswer } from 'src/entities'
import { Connection } from 'typeorm'
import { AnswerDto } from './dtos'

@Injectable()
export class AnswerService {
  constructor(private connection: Connection) {}

  async getUserAnswerByCategory(user: User, categoryId: string): Promise<Omit<UserQuestionAnswer, 'user'>[]> {
    const userQuestionAnswers = await this.connection.manager
      .createQueryBuilder(UserQuestionAnswer, 'userQuestionAnswer')
      .leftJoinAndSelect('userQuestionAnswer.user', 'user')
      .leftJoinAndSelect('userQuestionAnswer.question', 'question')
      .leftJoinAndSelect('userQuestionAnswer.answer', 'answer')
      .leftJoinAndSelect('question.questionCategory', 'questionCategory')
      .andWhere('questionCategory.id = :questionCategoryId', { questionCategoryId: categoryId })
      .andWhere('user.id = :userId', { userId: user.id })
      .getMany()

    return userQuestionAnswers.map((userQuestionAnswer) => {
      const { user, ...returnData } = userQuestionAnswer
      return returnData
    })
  }

  async saveAnswerByCategory(
    user: User,
    categoryId: string,
    answers: AnswerDto[],
  ): Promise<Omit<UserQuestionAnswer, 'user'>[]> {
    return this.connection.transaction(async (manager) => {
      const arrPromises = answers.map(async (data) => {
        const { questionId, answerId } = data

        const question = await manager.findOneOrFail(Question, {
          where: { id: questionId, questionCategory: { id: categoryId } },
        })

        const answer = await manager.findOneOrFail(Answer, {
          where: { id: answerId, question: { id: questionId } },
        })

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
}
