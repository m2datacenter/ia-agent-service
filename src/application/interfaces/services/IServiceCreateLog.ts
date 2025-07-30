export interface IServiceCreateLog {
  execute(params: IServiceCreateLog.Params): Promise<IServiceCreateLog.Result>
}

export namespace IServiceCreateLog {
  export type Params = {
    id: string
    service: { name: string; version: string; source: string; method: string }
    log_type: string
    host: object
    payload: object
    message: string
    error: string
    account?: { id: string }
  }

  export type Result = void
}
