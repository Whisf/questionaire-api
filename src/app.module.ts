import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './Modules/Auth/auth.module';
import { QuestionModule } from './Modules/question/question.module';
import { UserModule } from './Modules/User/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '156327',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    QuestionModule,
  ],
})
export class AppModule {}
