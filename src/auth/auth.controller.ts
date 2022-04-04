import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Request } from 'express'
import { AuthenticationGuard } from './auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('cat')
  @UseGuards(AuthenticationGuard)
  async hello() {
    return 'Hello World'
  }

  @Get('test')
  async test(@Req() req: Request) {
    console.log('OK')
  }
}
