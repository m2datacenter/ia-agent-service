import { Collection, MongoClient, ServerApiVersion } from 'mongodb'
import envs from '../../../main/configs/envs'

class MongoConnector {
  private readonly uri: string
  private client: MongoClient | undefined

  constructor(uri: string) {
    this.uri = uri
    this.client = undefined
  }

  async connect(): Promise<void> {
    this.client = new MongoClient(this.uri, { serverApi: ServerApiVersion.v1 })
    await this.client.connect()
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = undefined
    }
  }

  async getCollection(name: string): Promise<Collection> {
    if (!this.client) {
      await this.connect()
    }

    if (this.client) return this.client.db(this.client.db().databaseName).collection(name)

    throw new Error()
  }
}

export default new MongoConnector(envs.MONGO_URI)
