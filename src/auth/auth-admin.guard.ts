import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { Connection } from 'typeorm'
import { User } from 'src/entities'

@Injectable()
export class AuthenticationAdminGuard implements CanActivate {
  constructor(private connection: Connection) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.getArgByIndex(0)

    try {
      await this.validateAndBindUserAdminToRequest(req)
      return true
    } catch (error) {
      throw new UnauthorizedException(error)
    }
  }

  async validateAndBindUserAdminToRequest(req: Request): Promise<void> {
    const accessToken = req.headers['authorization']

    const userData = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString('binary'))
    const { sub: authzUserId, permissions } = userData as { sub: string; permissions: string[] }

    if (!permissions.includes('create:question')) {
      throw new UnauthorizedException('Not admin user')
    }

    const user = await this.connection.manager.findOne(User, { where: { authzUserId } })

    if (!user) {
      throw new UnauthorizedException('No user admin found')
    }

    req.user = user
  }
}
