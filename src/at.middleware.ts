import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { Connection } from 'typeorm'
import { User } from './entities'

@Injectable()
export class AtMiddleware implements NestMiddleware {
  constructor(private connection: Connection) {}

  async saveUserIfAuthenticated(req: Request): Promise<void> {
    const { sub: authzUserId, email } = req.oidc.user
    return this.connection.transaction(async (manager) => {
      const existingUser = await manager.findOne(User, { email })
      await manager.save(User, { id: existingUser.id, authzUserId, email, lastActivity: new Date(Date.now()) } as User)
    })
  }

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.oidc) {
      next(new Error('req.oidc is not found, did you include the auth middleware?'))
      return
    }

    if (!req.oidc.isAuthenticated()) {
      return res.oidc.login()
    }

    await this.saveUserIfAuthenticated(req)

    next()
  }
}
