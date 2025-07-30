import { IServiceValidateAccessToken } from '../../application/interfaces/services/IServiceValidateAccessToken'
import envs from '../../main/configs/envs'

export default class ValidateAccessTokenService implements IServiceValidateAccessToken {
  async execute(params: IServiceValidateAccessToken.Params): Promise<IServiceValidateAccessToken.Result> {
    try {
      const response = await fetch(`${envs.AUTH_SERVICE_HOST}/users/validate-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: params.token,
          role: params.role,
          externalIP: params.externalIP
        })
      })

      const json = await response.json()

      if (response.status !== 200) {
        return {
          statusCode: response.status,
          error: json.error
        }
      }

      return {
        statusCode: response.status,
        payload: json.payload
      }
    } catch (e) {
      if (e instanceof Error) {
        return {
          statusCode: 500,
          error: { message: 'internal server error', details: e.stack ? e.stack : 'stack error is not available', type: 'internal' }
        }
      }

      return { statusCode: 500, error: { message: 'internal server error', details: 'unknow error', type: 'internal' } }
    }
  }
}
