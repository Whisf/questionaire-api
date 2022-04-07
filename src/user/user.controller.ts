import { Controller, Get, UseGuards, Req } from '@nestjs/common'
import { Request } from 'express'
import { AuthenticationGuard } from 'src/auth'
import { User } from 'src/entities'
import { UserService } from './user.service'

@Controller('user')
@UseGuards(AuthenticationGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getUserInfo(@Req() req: Request): Promise<User> {
    return req.user as User
  }
}
