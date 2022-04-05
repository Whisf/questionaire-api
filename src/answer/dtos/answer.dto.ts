import { IsNotEmpty, IsUUID } from 'class-validator'

export class AnswerDto {
  @IsNotEmpty()
  @IsUUID()
  public questionId: string

  @IsNotEmpty()
  @IsUUID()
  public answerId: string
}
