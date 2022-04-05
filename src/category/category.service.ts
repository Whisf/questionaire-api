import { BadRequestException, Injectable } from '@nestjs/common'
import { QuestionCategory } from 'src/entities'
import { Connection } from 'typeorm'

@Injectable()
export class CategoryService {
  constructor(private connection: Connection) {}

  async getCategory(title: string): Promise<QuestionCategory[]> {
    try {
      const data = await this.connection.manager
        .createQueryBuilder(QuestionCategory, 'questionCategory')
        .leftJoinAndSelect('questionCategory.questions', 'questions')
        .where('questionCategory.title = :questionCategoryTitle', { questionCategoryTitle: title })
        .getMany()

      return data
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async getAllCategories() {
    return this.connection.manager.find(QuestionCategory)
  }
}
