import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { Connection } from 'typeorm'
import { User } from './entities'

@Injectable()
export class AppService {
  constructor(private connection: Connection) {}

  getHello(): string {
    return 'Hello World!'
  }

  async saveUserIfAuthenticated(req: Request): Promise<string> {
    const authenticated = req.oidc.isAuthenticated()
    if (authenticated) {
      const { sub: authzUserId, email } = req.oidc.user
      console.log(authzUserId, email)
      await this.connection.manager.save(User, { authzUserId, email } as User)
    }

    return authenticated ? 'login' : 'logout'
  }
}
