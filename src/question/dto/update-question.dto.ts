import { IsArray, IsOptional, IsString } from 'class-validator'
import { Answer } from 'src/entities/answer.entity'

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
