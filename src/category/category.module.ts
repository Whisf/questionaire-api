import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Question, QuestionCategory } from 'src/entities'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionCategory])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
