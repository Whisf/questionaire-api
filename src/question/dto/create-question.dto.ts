import { IsArray, IsBoolean, IsString } from 'class-validator'

export class CreateQuestionDto {
  @IsString()
  category: string

  @IsString()
  question: string

  @IsArray()
  answers: Answer[]
}

class Answer {
  @IsString()
  description: string

  @IsBoolean()
  isTrue: boolean
}
