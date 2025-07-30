import { IServiceBotGet } from '../../application/interfaces/services/IServiceBotGet'
import { IServiceContactGet } from '../../application/interfaces/services/IServiceContactGet'
import envs from '../../main/configs/envs'

export class GetContactService implements IServiceContactGet {
  execute = async (params: IServiceContactGet.Params): Promise<IServiceContactGet.Result> => {
    try {
      const url = `${envs.CONTACT_SERVICE_HOST}/accounts/${params.account.id}/contacts/${params.contact.id}`

      const response = await fetch(url, { method: 'get', headers: { 'Content-Type': 'application/json' } })

      const json = await response.json()

      if (response.status === 200) {
        return { contact: json.contact }
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
