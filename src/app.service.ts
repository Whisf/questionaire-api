import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { Connection } from 'typeorm'
import { User } from './entities'

@Injectable()
export class AppService {
  async getUserState(req: Request): Promise<User | undefined> {
    return req.oidc.isAuthenticated() ? (req.user as User) : undefined
  }
}
