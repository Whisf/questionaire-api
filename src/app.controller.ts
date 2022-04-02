import { Controller, Get, Req } from '@nestjs/common'
import { Request } from 'express'
import { requiresAuth } from 'express-openid-connect'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  saveUserIfAuthenticated(@Req() req: Request): Promise<string> {
    return this.appService.saveUserIfAuthenticated(req)
  }

  @Get('test')
  async test(@Req() req: Request) {
    return req.oidc?.accessToken?.access_token || ''
  }

  @Get('admin')
  getAdmin() {
    return '<a href="/admin">Admin Section</a>'
  }

  @Get('profile')
  async getProfile(@Req() req: Request) {
    return JSON.stringify(req.oidc.user)
  }
}
