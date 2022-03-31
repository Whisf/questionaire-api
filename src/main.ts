import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'
import { Logger, ValidationPipe } from '@nestjs/common'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(3000)
}

bootstrap().then(() => Logger.log(`Server is listening on port ${process.env.PORT}`))
