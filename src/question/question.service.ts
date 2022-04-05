import { Injectable } from '@nestjs/common'
import { Question, QuestionCategory, User } from 'src/entities'
import { Answer } from 'src/entities/answer.entity'
import { Connection } from 'typeorm'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
@Injectable()
export class QuestionService {
  constructor(private connection: Connection) {}

  async create(createQuestionDto: CreateQuestionDto) {
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
      answers.map(async (ans) => {
        return await this.connection.manager.save(Answer, {
          description: ans.description,
          isTrue: ans.isTrue,
          question: question,
        })
      })

      return question
    } catch (error) {
      console.log(error)
    }
  }

  async findAll(category: string) {
    try {
      return await this.connection.manager
        .createQueryBuilder(Question, 'q')
        .innerJoinAndSelect(QuestionCategory, 'qc', 'q.questionCategoryId = qc.id')
        .where('qc.title = :category', { category: category })
        .getMany()
    } catch (error) {
      console.log(error)
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
        .select('answer.description')
        .where('answer.questionId = :id', { id: id })
        .getMany()

      const listAnswers = answer.map((e) => {
        return e.description
      })

      const category = await this.connection.manager
        .createQueryBuilder(QuestionCategory, 'question_category')
        .select('question_category.title')
        .where('question_category.id = :id', { id: question.questionCategoryId })
        .getOne()

      const data = {
        category: category.title,
        question: question.description,
        answers: listAnswers,
      }
      return data
    } catch (error) {
      console.log(error)
    }
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.connection.manager.createQueryBuilder(Question, 'question').where({ id: id }).getOne()

    if (updateQuestionDto.category || updateQuestionDto.description) {
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
          .set({ description: updateQuestionDto.description, questionCategory: category })
          .where('id = :id', { id: id })
          .execute()
      } catch (error) {
        console.log(error)
      }
    }

    if (updateQuestionDto.answers) {
      await this.connection.manager
        .createQueryBuilder(Answer, 'answer')
        .delete()
        .where('questionId = :id', { id: id })
        .execute()

      updateQuestionDto.answers.map(async (ans) => {
        return await this.connection.manager.save(Answer, {
          description: ans.description,
          isTrue: ans.isTrue,
          question: question,
        })
      })
    }
  }

  async remove(id: string) {
    try {
      return await this.connection.manager.delete(Question, id)
    } catch (error) {
      console.log(error)
    }
  }

  private async getAnswers(id: string) {
    return this.connection.manager
      .createQueryBuilder(Answer, 'answer')
      .where('answer.questionId = :id', { id: id })
      .getMany()
  }

  async test() {
    console.log(await this.connection.manager.createQueryBuilder(User, 'user').getMany())
  }
}
