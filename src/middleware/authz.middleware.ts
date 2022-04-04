import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class AuthzMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.oidc) {
      next(new Error('req.oidc is not found, did you include the auth middleware?'))
      return
    }

    if (!req.oidc.isAuthenticated()) {
      return res.oidc.login()
    }
    next()
  }
}
