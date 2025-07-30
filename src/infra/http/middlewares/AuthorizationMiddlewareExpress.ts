import { NextFunction, Request, Response } from 'express'
import { AuthorizationMiddleware } from '../../../presentation/middlewares/AuthorizationMiddleware'

export class AuthorizationMiddlewareExpress {
  constructor(private readonly authorizationMiddleware: AuthorizationMiddleware) {}

  handle = (role: string) => {
    return async (req: Request, resp: Response, next: NextFunction) => {
      const result = await this.authorizationMiddleware.execute(req, role)

      if (result.statusCode !== 200) return resp.status(result.statusCode).json(result.body)

      Object.assign(req, { _authData: result.body })

      return next()
    }
  }
}
