import { BadRequestException, Injectable } from '@nestjs/common'
import { Question, QuestionCategory } from 'src/entities'
import { Answer } from 'src/entities/answer.entity'
import { Connection } from 'typeorm'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
@Injectable()
export class QuestionService {
  constructor(private connection: Connection) {}

  async createQuestion(createQuestionDto: CreateQuestionDto): Promise<any> {
    return this.connection.transaction(async (manager) => {
      const { question, category, answers } = createQuestionDto
      let categoryExisting = await manager.findOne(QuestionCategory, { where: { title: category } })

      if (!categoryExisting) {
        categoryExisting = await manager.save(QuestionCategory, { title: category })
      }

      const questionCreated = await manager.save(Question, {
        description: question,
        questionCategory: { id: categoryExisting.id },
      } as Question)

      const arrAnswers = answers.map(async (answer) => {
        return await manager.save(Answer, { ...answer, question: { id: questionCreated.id } } as Answer)
      })

      const listAnswers = await Promise.all(arrAnswers)

      return {
        question: questionCreated,
        answers: listAnswers,
      }
    })
  }

  async findQuestionById(id: string): Promise<Question> {
    return this.connection.manager.findOneOrFail(Question, {
      where: { id: id },
      relations: ['questionCategory', 'answers'],
    })
  }

  async update(questionId: string, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    return this.connection.transaction(async (manager) => {
      const questionExisting = await manager.findOne(Question, { where: { id: questionId }, relations: ['answers'] })

      if (!questionExisting) {
        throw new BadRequestException('Question not found')
      }

      const { description, answers } = updateQuestionDto

      if (description) {
        await manager.save(Question, { id: questionId, description } as Question)
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

      return questionExisting
    })
  }

  async remove(id: string): Promise<any> {
    const existingQuestion = this.connection.manager.findOne(Question, { where: { id: id } })
    if (existingQuestion) {
      await this.connection.manager.delete(Question, id)
      return 'delete question successful'
    } else {
      throw new BadRequestException('Not found question')
    }
  }

  private async getAnswers(id: string) {
    return this.connection.manager
      .createQueryBuilder(Answer, 'answer')
      .where('answer.questionId = :id', { id: id })
      .getMany()
  }
}
