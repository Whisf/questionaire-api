import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from './database'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user'
import { AuthModule } from './auth'
import { QuestionModule } from './question'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AtMiddleware } from './at.middleware'
import { Question, User } from './entities'

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    QuestionModule,
    DatabaseModule,
    TypeOrmModule.forFeature([User, Question]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AtMiddleware).forRoutes('/test', '/profile')
  }
}
