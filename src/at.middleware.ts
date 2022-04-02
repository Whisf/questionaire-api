import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { requiresAuth } from 'express-openid-connect'

@Injectable()
export class AtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
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
