import { IsNotEmpty, IsString } from 'class-validator'

export class SaveUserDto {
  @IsNotEmpty()
  @IsString()
  public email: string

  @IsNotEmpty()
  @IsString()
  public authzUserId: string
}
