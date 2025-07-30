import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { IServiceCreateLog } from '../../../application/interfaces/services/IServiceCreateLog'
import { randomUUID } from 'node:crypto'

export class LoggerServiceMiddlewareExpress {
  constructor(private readonly serviceCreateLog: IServiceCreateLog) {}

  handle = () => {
    return async (err: ErrorRequestHandler, req: Request, res: Response, _next: NextFunction) => {
      console.log(err)
      const { statusCode, body } = err as unknown as { statusCode: number; body: { error: Record<string, string> } }

      const logId = randomUUID()

      const logData = {
        id: logId,
        service: { name: 'bot-service', version: '1.0.0', source: 'nodejs', method: req.path },
        log_type: 'error',
        payload: req.body,
        message: body.error.message,
        host: {
          status_code: statusCode,
          path: req.path,
          headers: req.headers,
          user_agent: req.get('User-Agent'),
          remote_ip: req.ip,
          method: req.method,
          params: req.params,
          query: req.query
        },
        error: body.error.details,
        account: req._authData?.account ? req._authData?.account : undefined
      }

      await this.serviceCreateLog.execute(logData)

      res.status(statusCode).json({ error: { ...body.error, id: logId, details: undefined } })
    }
  }
}
