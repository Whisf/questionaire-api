import { Controller, Get, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { AppService } from './app.service'
import { User } from './entities'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getUserState(@Req() req: Request): Promise<string> {
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
