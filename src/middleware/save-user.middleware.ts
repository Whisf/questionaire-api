import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { Connection } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { User } from 'src/entities'

@Injectable()
export class SaveUserMiddleware implements NestMiddleware {
  constructor(private connection: Connection) {}

  async saveUserIfAuthenticated(req: Request): Promise<void> {
    const { sub: authzUserId, email } = req.oidc.user
    return this.connection.transaction(async (manager) => {
      const existingUser = await manager.findOne(User, { email })
      await manager.save(User, { id: existingUser?.id, authzUserId, email, lastActivity: new Date(Date.now()) } as User)
    })
  }

  async use(req: Request, _res: Response, next: NextFunction) {
    if (!!req.oidc.accessToken) {
      await this.saveUserIfAuthenticated(req)
    }

    next()
  }
}
