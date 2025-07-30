// import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express, json } from 'express'
import helmet from 'helmet'
import { externalIPMiddlewareExpress } from '../middlewares/externalIPMiddlewareExpress'

export const getExpressApplication = (): Express => {
  const expressApplication = express()

  expressApplication.use(helmet())
  expressApplication.use(json({ limit: '50mb' }))
  // expressApplication.use(cookieParser())

  if (process.env.NODE_ENV === 'development') {
    expressApplication.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
    expressApplication.use(externalIPMiddlewareExpress('127.0.0.1'))
  } else {
    expressApplication.use(externalIPMiddlewareExpress())
  }

  return expressApplication
}
