import { PartialType } from '@nestjs/mapped-types'
import { IsArray, IsOptional, IsString } from 'class-validator'
import { Answer } from 'src/entities/answer.entity'
import { CreateQuestionDto } from './create-question.dto'

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  category?: string

  @IsArray()
  @IsOptional()
  answers?: Answer[]
}
