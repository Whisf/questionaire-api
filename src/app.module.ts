import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from './database'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user'
import { AuthModule } from './auth'
import { QuestionModule } from './question'

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, QuestionModule, DatabaseModule],
})
export class AppModule {}
