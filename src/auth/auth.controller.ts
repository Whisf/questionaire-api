import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthenticationGuard } from './auth.guard'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/cat')
  @UseGuards(AuthenticationGuard)
  async test() {
    return 'Hello World'
  }
}
