import { Controller, Get, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getUserState(@Req() req: Request, @Res() res: Response): Promise<void> {
    const userState = await this.appService.getUserState(req)
    res.cookie('atk', req.oidc?.accessToken?.access_token, { domain: 'http://localhost', path: '/', secure: true })
    res.redirect('http://localhost:3000')
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
