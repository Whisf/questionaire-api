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
    const category = await this.connection.manager
      .createQueryBuilder(QuestionCategory, 'question_category')
      .where('question_category.title = :title', { title: createQuestionDto.category })
      .getOne()
    if (!category) {
      await this.connection.manager.insert(QuestionCategory, {
        title: createQuestionDto.category,
      })
    }

    const question = await this.connection.manager.save(Question, {
      description: createQuestionDto.question,
      questionCategory: category,
    })

    const answers = createQuestionDto.answers

    answers.map(async (ans) => {
      console.log(ans)

      return await this.connection.manager.save(Answer, {
        description: ans.description,
        isTrue: ans.isTrue,
        question: question,
      })
    })
  }

  findAll(category: string) {
    return this.connection.manager.createQueryBuilder(Question, 'question').getMany()
  }

  async findOne(id: string) {
    return await this.connection.manager.createQueryBuilder(Question, 'question').where({ id: id }).getOne()
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    return await this.connection.manager
      .createQueryBuilder()
      .update(Question)
      .set({ description: updateQuestionDto.description })
      .where('id = :id', { id: id })
      .execute()
  }

  async remove(id: string) {
    console.log(id)
    return await this.connection.manager.delete(Question, id)
  }

  async test() {
    console.log(await this.connection.manager.createQueryBuilder(User, 'user').getMany())
  }
}
