import { ErrorTypes } from '../../../domain/interfaces/BaseError'

export interface IServiceValidateAccessToken {
  execute(params: IServiceValidateAccessToken.Params): Promise<IServiceValidateAccessToken.Result>
}

export namespace IServiceValidateAccessToken {
  export type Params = {
    token: string
    role: string
    externalIP: string
  }

  export type Result = {
    statusCode: number
    payload?: { account: { id: string; name: string }; user: { id: string } }
    error?: { message: string; details: string; type: ErrorTypes }
  }
}
