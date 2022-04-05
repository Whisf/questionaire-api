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

      const answer = await this.connection.manager
        .createQueryBuilder(Answer, 'answer')
        .where('answer.questionId = :id', { id: id })
        .getMany()

      const listAnswers = answer.map((e) => {
        return e
      })

      const category = await this.connection.manager
        .createQueryBuilder(QuestionCategory, 'question_category')
        .select('question_category.title')
        .where('question_category.id = :id', { id: question.questionCategoryId })
        .getOne()

      return {
        category: category.title,
        question: question.description,
        answers: listAnswers,
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.connection.manager.createQueryBuilder(Question, 'question').where({ id: id }).getOne()

    if (updateQuestionDto.answers) {
      await this.connection.manager
        .createQueryBuilder(Answer, 'answer')
        .delete()
        .where('questionId = :id', { id: id })
        .execute()

      const test = updateQuestionDto.answers.map(async (ans) => {
        return this.connection.manager.save(Answer, {
          description: ans.description,
          isTrue: ans.isTrue,
          question: question,
        })
      })

      const data = await Promise.all(test)
      return {
        question: question,
        answers: data.map((e) => {
          const { question, ...returndata } = e
          return returndata
        }),
      }
    }

    let category = await this.connection.manager
      .createQueryBuilder(QuestionCategory, 'question_category')
      .where('question_category.title = :title', { title: updateQuestionDto.category })
      .getOne()

    if (!category) {
      category = await this.connection.manager.save(QuestionCategory, {
        title: updateQuestionDto.category,
      })
    }

    try {
      return await this.connection.manager
        .createQueryBuilder()
        .update(Question)
        .set({ description: updateQuestionDto.description || question.description, questionCategory: category })
        .where('id = :id', { id: id })
        .execute()
    } catch (error) {
      throw new BadRequestException(error)
    }
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
