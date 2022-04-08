import { Controller, Get, UseGuards, Req, Post, Body } from '@nestjs/common'
import { Request } from 'express'
import { AuthenticationGuard } from 'src/auth'
import { User } from 'src/entities'
import { SaveUserDto } from './dtos'
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthenticationGuard)
  async getUserInfo(@Req() req: Request): Promise<User> {
    return req.user as User
  }

  @Post()
  async saveUser(@Req() req: Request, @Body() dto: SaveUserDto): Promise<User> {
    return this.userService.saveUser(req, dto)
  }
}
