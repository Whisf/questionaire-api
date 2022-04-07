import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { Connection } from 'typeorm'
import { User } from './entities'

@Injectable()
export class AppService {
  async getUserState(req: Request): Promise<string> {
    return req.oidc.isAuthenticated() ? '<h1> Login succeeded </ h1>' : '<h1> Already logout </ h1>'
  }
}
