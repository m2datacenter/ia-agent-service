import { ErrorTypes } from '../../../domain/interfaces/BaseError'

export interface IServiceBotGet {
  execute(params: IServiceBotGet.Params): Promise<IServiceBotGet.Result>
}

export namespace IServiceBotGet {
  export type Params = {
    account: { id: string }
    bot: { id: string }
  }

  export type Result = {
    bot?: any
    error?: { message: string; details: string; type: ErrorTypes }
  }
}
