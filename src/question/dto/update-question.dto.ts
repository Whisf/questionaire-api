import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  description?: string

  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAnswerDto)
  answers?: UpdateAnswerDto[]
}

class UpdateAnswerDto {
  @IsOptional()
  @IsUUID()
  public id: string

  @IsString()
  @IsOptional()
  public description: string

  @IsBoolean()
  @IsOptional()
  public isTrue: boolean
}
