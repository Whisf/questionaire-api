import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { AuthenticationGuard } from './auth.guard'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'
import { Request } from 'express'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/cat')
  @UseGuards(AuthenticationGuard)
  async hello() {
    return 'Hello World'
  }

  @Get('test')
  async test(@Req() req: Request) {
    console.log('OK')
  }
}
