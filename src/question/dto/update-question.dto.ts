import { PartialType } from '@nestjs/mapped-types'
import { IsArray, IsString } from 'class-validator'
import { Answer } from 'src/entities/answer.entity'
import { CreateQuestionDto } from './create-question.dto'

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
  @IsString()
  description?: string

  @IsString()
  category?: string

  @IsArray()
  answers?: Answer[]
}
