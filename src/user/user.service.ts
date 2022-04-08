import { BadRequestException, Injectable } from '@nestjs/common'
import { User, USER_ROLE } from 'src/entities'
import { Connection } from 'typeorm'
import { SaveUserDto } from './dtos'
import { Request } from 'express'

@Injectable()
export class UserService {
  constructor(private connection: Connection) {}

  saveUser(req: Request, dto: SaveUserDto): Promise<User> {
    const accessToken = req.headers['authorization']

    const userData = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString('binary'))
    const { sub } = userData
    const { permissions } = userData as { sub: string; permissions: string[] }
    const isAdmin = permissions.includes('create:question')

    const { email, authzUserId } = dto
    if (sub !== authzUserId) {
      throw new BadRequestException('User not valid for this endpoint')
    }

    return this.connection.transaction(async (manager) => {
      const existingUser = await manager.findOne(User, { authzUserId })

      return this.connection.manager.save(User, {
        id: existingUser?.id,
        authzUserId,
        email,
        lastActivity: new Date(Date.now()),
        role: isAdmin ? USER_ROLE.ADMIN : USER_ROLE.BASIC,
      })
    })
  }
}
