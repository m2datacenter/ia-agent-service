import { createClient, RedisClientType } from 'redis'
import envs from '../../../main/configs/envs'

class RedisClient {
  readonly client: RedisClientType
  private isConnectionSuccess = false

  constructor() {
    this.client = createClient({
      url: envs.REDIS_URI,
      database: +envs.REDIS_DB,
      socket: {
        reconnectStrategy: (retries) => {
          console.log(`Retrying redis connection - ${retries}`)
          return 5000
        }
      }
    })

    this.client.on('connect', () => {
      this.isConnectionSuccess = true
    })

    this.client.on('error', (e) => {
      this.isConnectionSuccess = false
      console.log('Redis error: ', JSON.stringify(e))
    })
  }

  async connect(): Promise<void> {
    await this.client.connect()
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect()
  }

  isConnected = (): boolean => {
    return this.isConnectionSuccess
  }
}

export default new RedisClient().client
