import { NextFunction, Request, Response } from 'express'

export const externalIPMiddlewareExpress = (defaultExternalIP?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const externalIP = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : defaultExternalIP

    Object.assign(req, { _externalIP: externalIP })

    return next()
  }
}
