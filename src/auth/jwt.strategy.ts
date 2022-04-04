import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt'

import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 1
      secretOrKey: process.env.AUTHZ_CLIENT_SECRET,
    })
  }

  validate(payload: any, done: VerifiedCallback) {
    if (!payload) {
      done(new UnauthorizedException(), false) // 2
    }

    console.log(payload)

    return done(null, payload)
  }
}
