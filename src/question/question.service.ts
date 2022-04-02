import { Injectable } from '@nestjs/common'
import { Question, User } from 'src/entities'
import { Connection } from 'typeorm'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'

@Injectable()
export class QuestionService {
  constructor(private connection: Connection) {}

  create(createQuestionDto: CreateQuestionDto) {
    return 'This action adds a new question'
  }

  findAll() {
    return `This action returns all question`
  }

  findOne(id: number) {
    return `This action returns a #${id} question`
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`
  }

  remove(id: number) {
    return `This action removes a #${id} question`
  }

  async test() {
    console.log(await this.connection.manager.createQueryBuilder(User, 'user').getMany())
  }
}
