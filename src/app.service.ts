import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { Connection } from 'typeorm'

@Injectable()
export class AppService {
  constructor(private connection: Connection) {}

  async getUserState(req: Request): Promise<string> {
    return req.oidc.isAuthenticated() ? '<h1> Already login </ h1>' : '<h1> Already logout </ h1>'
  }
}
