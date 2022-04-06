import { Controller, Get, Req } from '@nestjs/common'
import { Request } from 'express'
import { AppService } from './app.service'
import { User } from './entities'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getUserState(@Req() req: Request): Promise<User | string> {
    return this.appService.getUserState(req)
  }

  @Get('access-token')
  async test(@Req() req: Request) {
    return req.oidc?.accessToken?.access_token || ''
  }

  @Get('profile')
  async getProfile(@Req() req: Request) {
    return JSON.stringify(req.oidc.user)
  }
}
