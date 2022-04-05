import { Module } from '@nestjs/common'
import { QuestionService } from './question.service'
import { QuestionController } from './question.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Question, User } from 'src/entities'
import { CategoryService } from 'src/category/category.service'

@Module({
  imports: [TypeOrmModule.forFeature([Question, User])],
  controllers: [QuestionController],
  providers: [QuestionService, CategoryService],
})
export class QuestionModule {}
