import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { Connection } from 'typeorm'
import { User } from './entities'

@Injectable()
export class AppService {
  async getUserState(req: Request): Promise<User | string> {
    return req.oidc.isAuthenticated() ? (req.user as User) : '<h1> Already logout </ h1>'
  }
}
