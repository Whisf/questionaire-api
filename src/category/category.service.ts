import { BadRequestException, Injectable } from '@nestjs/common'
import { Question, QuestionCategory } from 'src/entities'
import { Connection } from 'typeorm'
import { UpdateCategoryDto } from './dto/update-category.dto'

@Injectable()
export class CategoryService {
  constructor(private connection: Connection) {}

  async createCategory(title: string): Promise<QuestionCategory> {
    const existingCategory = await this.getCategory(title)

    if (existingCategory) {
      throw new BadRequestException(`${title} category is existed`)
    }

    return this.connection.manager.save(QuestionCategory, { title: title })
  }

  async getCategory(title: string): Promise<QuestionCategory> {
    const category = await this.connection.manager.findOne(QuestionCategory, {
      relations: ['questions', 'questions.answers'],
      where: { title: title },
    })

    if (!category) {
      throw new BadRequestException(`Not found ${title} category`)
    }

    for (const question of category.questions) {
      for (const answer of question.answers) {
        delete answer.isTrue
      }
    }

    return category
  }

  async getAllCategories(): Promise<QuestionCategory[]> {
    return this.connection.manager.find(QuestionCategory)
  }

  async findCategoryById(id: string): Promise<QuestionCategory> {
    const category = await this.connection.manager.findOne(QuestionCategory, { id: id })
    if (!category) {
      throw new BadRequestException(`Not found category`)
    }
    return category
  }

  async updateCategory(categoryId: string, updateCategoryDto: UpdateCategoryDto): Promise<QuestionCategory> {
    const categoryExisting = await this.findCategoryById(categoryId)
    if (!categoryExisting) {
      throw new BadRequestException(`Not found category`)
    }

    return this.connection.manager.save(QuestionCategory, {
      ...updateCategoryDto,
      id: categoryId,
    })
  }

  async deleteCategory(categoryId: string): Promise<any> {
    const categoryExisting = await this.connection.manager.findOne(QuestionCategory, { id: categoryId })

    if (!categoryExisting) {
      throw new BadRequestException(`Not found category`)
    }

    return this.connection.manager.delete(QuestionCategory, { id: categoryId })
  }
}
