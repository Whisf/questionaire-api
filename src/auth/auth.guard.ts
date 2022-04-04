import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { expressJwtSecret } from 'jwks-rsa'
import { promisify } from 'util'
import * as jwt from 'express-jwt'
import { Request } from 'express'
import { Connection } from 'typeorm'
import { User } from 'src/entities'

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private connection: Connection) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.getArgByIndex(0)

    try {
      await this.validateAndBindUserToRequest(req)
      return true
    } catch (error) {
      throw new UnauthorizedException(error)
    }
  }

  async validateAndBindUserToRequest(req: Request): Promise<void> {
    const accessToken = req.headers['authorization']

    const userData = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString('binary'))
    const { sub: authzUserId } = userData

    const user = await this.connection.manager.find(User, { where: { authzUserId } })

    if (!user) {
      throw new UnauthorizedException('No user found')
    }

    req.user = user
  }
}
