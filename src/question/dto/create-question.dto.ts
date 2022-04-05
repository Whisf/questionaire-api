import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator'

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  category: string

  @IsString()
  @IsNotEmpty()
  question: string

  @IsArray()
  @IsNotEmpty()
  answers: Answer[]
}

class Answer {
  @IsString()
  @IsNotEmpty()
  description: string

  @IsBoolean()
  @IsNotEmpty()
  isTrue: boolean
}
