import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from './database'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user'
import { AuthModule } from './auth'
import { QuestionModule } from './question'
import { AppController } from './app.controller'
import { Question, User } from './entities'

import { auth } from 'express-oauth2-jwt-bearer'
import { AnswerModule } from './answer'
import { CategoryModule } from './category/category.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    QuestionModule,
    AnswerModule,
    DatabaseModule,
    CategoryModule,
    TypeOrmModule.forFeature([User, Question]),
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const config = {
      audience: process.env.AUTHZ_BASE_URL,
      issuerBaseURL: process.env.AUTHZ_ISSUER_URL,
      issuer: process.env.AUTHZ_ISSUER_URL,
      jwksUri: `${process.env.AUTHZ_ISSUER_URL}/.well-known/jwks.json`,
    }

    consumer.apply(auth(config)).exclude('/').forRoutes('*')
  }
}
