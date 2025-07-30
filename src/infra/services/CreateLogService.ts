import envs from '../../main/configs/envs'
import { IServiceCreateLog } from '../../application/interfaces/services/IServiceCreateLog'

export class CreateLogService implements IServiceCreateLog {
  execute = async (params: IServiceCreateLog.Params): Promise<IServiceCreateLog.Result> => {
    try {
      const headers = { 'Content-Type': 'application/json' }
      await fetch(envs.LOGGER_SERVICE_HOST, {
        method: 'POST',
        headers,
        body: JSON.stringify(params)
      })
    } catch (e) {
      console.error(e)
    }
  }
}
