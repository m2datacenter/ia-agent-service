import ValidateAccessTokenService from '../../infra/services/ValidateAccessTokenService'
import { HttpRequest, HttpResponse, Middleware } from '../../presentation/protocols/Middleware'

export class AuthorizationMiddleware implements Middleware {
  constructor(private readonly validateAccessTokenService: ValidateAccessTokenService) {}

  async execute(request: HttpRequest, role: string): Promise<HttpResponse> {
    try {
      let { authorization } = request.headers
      if (!authorization && request.cookies) authorization = request.cookies.authorization

      if (!authorization)
        return { statusCode: 403, body: { message: 'token is invalid', details: 'token is invalid', type: 'unauthenticated' } }

      const { payload, error, statusCode } = await this.validateAccessTokenService.execute({
        token: authorization,
        role,
        externalIP: request._externalIP
      })

      if (payload) {
        return { statusCode: 200, body: payload }
      }

      return { statusCode, body: error }
    } catch (e) {
      if (e instanceof Error) {
        return {
          statusCode: 500,
          body: { message: 'internal server error', details: e.stack ? e.stack : 'stack error is not available', type: 'internal' }
        }
      }

      return { statusCode: 500, body: { message: 'internal server error', details: 'unknow error', type: 'internal' } }
    }
  }
}
