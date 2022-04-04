import { Controller, Get, Req } from '@nestjs/common'
import { Request } from 'express'
import { requiresAuth } from 'express-openid-connect'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getUserState(@Req() req: Request): Promise<string> {
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
