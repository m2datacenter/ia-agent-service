import { IServiceBotGet } from '../../application/interfaces/services/IServiceBotGet'
import envs from '../../main/configs/envs'

export class GetBotService implements IServiceBotGet {
  execute = async (params: IServiceBotGet.Params): Promise<IServiceBotGet.Result> => {
    try {
      const url = `${envs.BOT_SERVICE_HOST}/accounts/${params.account.id}/bots/${params.bot.id}`

      const response = await fetch(url, { method: 'get', headers: { 'Content-Type': 'application/json' } })

      const json = await response.json()

      if (response.status === 200) {
        const { id, message_platform, message_templates, ...rest } = json.bot

        return { bot: { id, messagePlatform: message_platform, messageTemplates: message_templates, ...rest } }
      }

      return { error: json.error }
    } catch (e) {
      if (e instanceof Error) {
        return {
          error: { message: 'internal server error', details: e.stack ? e.stack : 'stack error is not available', type: 'internal' }
        }
      }

      return { error: { message: 'internal server error', details: 'unknow error', type: 'internal' } }
    }
  }
}
