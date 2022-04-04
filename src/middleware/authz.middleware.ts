import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { Connection } from 'typeorm'
import { User } from '../entities'

@Injectable()
export class AuthzMiddleware implements NestMiddleware {
  constructor(private connection: Connection) {}

  async saveUserIfAuthenticated(req: Request): Promise<void> {
    const { sub: authzUserId, email } = req.oidc.user
    return this.connection.transaction(async (manager) => {
      const existingUser = await manager.findOne(User, { email })
      await manager.save(User, { id: existingUser.id, authzUserId, email, lastActivity: new Date(Date.now()) } as User)
    })
  }

  async validateAndBindUserToRequest(req: Request): Promise<void> {
    const accessToken = req.oidc.accessToken.access_token
    const userData = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString('binary'))
    const { sub: authzUserId } = userData

    const user = await this.connection.manager.find(User, { where: { authzUserId } })

    if (!user) {
      throw new UnauthorizedException('No user found')
    }

    req.user = user
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
    await this.validateAndBindUserToRequest(req)
    next()
  }
}
