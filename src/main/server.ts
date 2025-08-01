import { Server } from 'http'
import redisClient from '../infra/cacheDatabase/client/RedisClient'
import mongoConnector from '../infra/database/connector/MongoConnector'
import { AuthorizationMiddlewareExpress } from '../infra/http/middlewares/AuthorizationMiddlewareExpress'
import { LoggerServiceMiddlewareExpress } from '../infra/http/middlewares/LoggerServiceMiddlewareExpress'
import { getExpressApplication } from '../infra/http/server/ServerExpressApp'
import { CreateLogService } from '../infra/services/CreateLogService'
import ValidateAccessTokenService from '../infra/services/ValidateAccessTokenService'
import { AuthorizationMiddleware } from '../presentation/middlewares/AuthorizationMiddleware'
import envs from './configs/envs'
import { CreateMessageExpressRouter } from '../infra/http/routes/CreateMessageExpressRouter'
import { GetBotService } from '../infra/services/GetBotService'
import { GetContactService } from '../infra/services/GetContactService'

let server: Server

async function start() {
  // await mongoConnector.connect()
  await redisClient.connect()

  const app = getExpressApplication()

  const APP_VERSION = '1.0.2 - 2025-08-01'

  const validateAccessTokenService = new ValidateAccessTokenService()
  const authorizationMiddleware = new AuthorizationMiddleware(validateAccessTokenService)
  const authorizationMiddlewareExpress = new AuthorizationMiddlewareExpress(authorizationMiddleware)

  const getBotService = new GetBotService()
  const getContactService = new GetContactService()

  const createMessageExpressRouter = new CreateMessageExpressRouter(
    authorizationMiddlewareExpress,
    redisClient,
    getBotService,
    getContactService
  )

  // PRIVATE ROUTES
  app.get('/private/check-health', (_req, res) => {
    res.status(200).json({ msg: 'ok', version: APP_VERSION, name: 'ia-agent-service' })
  })
  // app.use('/private', getBotExpressRouter._getRouter())

  // PUBLIC ROUTES
  app.get('/public/check-health', (_req, res) => {
    res.status(200).json({ msg: 'ok', version: APP_VERSION, name: 'ia-agent-service' })
  })

  app.use('/public', createMessageExpressRouter.getRouter())

  // logger
  const createLogService = new CreateLogService()
  const loggerServiceMiddleware = new LoggerServiceMiddlewareExpress(createLogService)
  app.use(loggerServiceMiddleware.handle())

  // 404
  app.use((_req, res) => {
    res.status(404).json({ error: { message: 'resource not found', details: 'endpoint does not exists', type: 'entity_not_found' } })
  })

  server = app.listen(envs.PORT, () => console.log(`HTTP Server running on port: ${envs.PORT} Version: ${APP_VERSION}`))
}

process.on('uncaughtException', (error: Error, origin: string) => {
  console.log(`\n${origin} signal received. \n${error}`)
})

process.on('unhandledRejection', (error) => {
  console.log(`\nunhandledRejection signal received. \n${error}`)
})

function saveShutdow(event: string) {
  return (code: number) => {
    console.log(`${event} received! with ${code}`)

    console.log('Closing Http server...')
    server.close(async () => {
      console.log('Http server closed.')

      console.log('Closing DB')
      // await mongoConnector.disconnect()
      console.log('Closed DB')

      console.log('Closing Redis')
      await redisClient.close()
      console.log('Closed Redis')

      process.exit(code)
    })
  }
}

process.on('SIGINT', saveShutdow('SIGINT'))

process.on('SIGTERM', saveShutdow('SIGTERM'))

process.on('exit', (code) => {
  console.log('exit signal received', code)
})

start()
