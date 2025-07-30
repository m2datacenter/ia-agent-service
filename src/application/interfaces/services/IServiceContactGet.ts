import { ErrorTypes } from '../../../domain/interfaces/BaseError'

export interface IServiceContactGet {
  execute(params: IServiceContactGet.Params): Promise<IServiceContactGet.Result>
}

export namespace IServiceContactGet {
  export type Params = {
    account: { id: string }
    contact: { id: string }
  }

  export type Result = {
    contact?: any
    error?: { message: string; details: string; type: ErrorTypes }
  }
}
