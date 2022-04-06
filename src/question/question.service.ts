import { BadRequestException, Injectable } from '@nestjs/common'
import { Question, QuestionCategory, User } from 'src/entities'
import { Answer } from 'src/entities/answer.entity'
import { Connection } from 'typeorm'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
@Injectable()
export class QuestionService {
  constructor(private connection: Connection) {}

  async createQuestion(createQuestionDto: CreateQuestionDto): Promise<any> {
    try {
      let category = await this.connection.manager
        .createQueryBuilder(QuestionCategory, 'question_category')
        .where('question_category.title = :title', { title: createQuestionDto.category })
        .getOne()
      if (!category) {
        category = await this.connection.manager.save(QuestionCategory, {
          title: createQuestionDto.category,
        })
      }

      const question = await this.connection.manager.save(Question, {
        description: createQuestionDto.question,
        questionCategory: category,
      })

      const answers = createQuestionDto.answers
      const arrPromises = answers.map(async (ans) => {
        return this.connection.manager.save(Answer, {
          description: ans.description,
          isTrue: ans.isTrue,
          question,
        })
      })

      const test = await Promise.all(arrPromises)

      return {
        question: question,
        answers: test.map((data) => {
          const { question, ...returnData } = data
          return returnData
        }),
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findOne(id: string) {
    try {
      const question = await this.connection.manager
        .createQueryBuilder(Question, 'question')
        .where('question.id = :id', { id: id })
        .getOne()

      const answers = await this.connection.manager
        .createQueryBuilder(Answer, 'answer')
        .where('answer.questionId = :id', { id: id })
        .getMany()

      const category = await this.connection.manager
        .createQueryBuilder(QuestionCategory, 'question_category')
        .select('question_category.title')
        .where('question_category.id = :id', { id: question.questionCategoryId })
        .getOne()

      return {
        category: category.title,
        question: {
          description: question.description,
          id: question.id,
        },
        answers,
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(questionId: string, updateQuestionDto: UpdateQuestionDto) {
    return this.connection.transaction(async (manager) => {
      const questionExisting = await manager.findOne(Question, { where: { questionId }, relations: ['answers'] })

      if (!questionExisting) {
        throw new BadRequestException('Question not found')
      }

      const { description, answers } = updateQuestionDto

      if (description) {
        await manager.save(Question, { description } as Question)
      }

      const currentAnswerIds = questionExisting.answers.map((answers) => answers.id)

      if (answers && answers.length !== 0) {
        const arrPromises = answers.map(async (answer) => {
          const { id: answerId } = answer

          if (!answerId) {
            await manager.save(Answer, { ...answer, question: { id: questionExisting.id } } as Answer)
          }

          if (!currentAnswerIds.includes(answerId)) {
            return
          }

          await manager.save(Answer, { ...answer })
        })

        await Promise.all(arrPromises)
      }
    })
  }

  async remove(id: string) {
    try {
      return await this.connection.manager.delete(Question, id)
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  private async getAnswers(id: string) {
    return this.connection.manager
      .createQueryBuilder(Answer, 'answer')
      .where('answer.questionId = :id', { id: id })
      .getMany()
  }
}
