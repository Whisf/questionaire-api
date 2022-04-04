import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'
import { Logger, ValidationPipe } from '@nestjs/common'
import { auth, ConfigParams } from 'express-openid-connect'
import * as morgan from 'morgan'

dotenv.config()

const config = {
  authRequired: false,
  auth0Logout: false,
  secret: process.env.AUTHZ_SECRET,
  baseURL: process.env.AUTHZ_BASE_URL,
  clientID: process.env.AUTHZ_CLIENT_ID,
  clientSecret: process.env.AUTHZ_CLIENT_SECRET,
  issuerBaseURL: process.env.AUTHZ_ISSUER_URL,
  idpLogout: true,
  authorizationParams: {
    response_type: 'code',
    audience: process.env.AUTHZ_BASE_URL,
    scope: 'openid profile email',
  },
} as ConfigParams

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())

  app.use(auth(config))

  app.use(morgan('combined'))

  await app.listen(process.env.PORT)
}

bootstrap().then(() => Logger.log(`Server is listening on port ${process.env.PORT}`))
