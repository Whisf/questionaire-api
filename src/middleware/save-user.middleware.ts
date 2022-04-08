import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { Connection } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { User, USER_ROLE } from 'src/entities'

@Injectable()
export class SaveUserMiddleware implements NestMiddleware {
  constructor(private connection: Connection) {}

  async saveUserIfAuthenticated(req: Request): Promise<User> {
    const { sub: authzUserId, email } = req.oidc.user
    const { access_token } = req.oidc?.accessToken
    const bearer_token = req.headers['authorization']

    const userData = JSON.parse(Buffer.from((access_token || bearer_token).split('.')[1], 'base64').toString('binary'))

    const { permissions } = userData as { sub: string; permissions: string[] }

    const isAdmin = permissions.includes('create:question')

    return this.connection.transaction(async (manager) => {
      const existingUser = await manager.findOne(User, { email })
      return manager.save(User, {
        id: existingUser?.id,
        authzUserId,
        email,
        lastActivity: new Date(Date.now()),
        role: isAdmin ? USER_ROLE.ADMIN : USER_ROLE.BASIC,
      } as User)
    })
  }

  async use(req: Request, _res: Response, next: NextFunction) {
    let user = new User()
    if (!!req.oidc.accessToken) {
      user = await this.saveUserIfAuthenticated(req)
    }

    req.user = user
    next()
  }
}
