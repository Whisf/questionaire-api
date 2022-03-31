import { Module } from '@nestjs/common';
import { AuthModule } from './Modules/Auth/auth.module';
import { QuestionModule } from './Modules/question/question.module';
import { UserModule } from './Modules/User/user.module';

@Module({
  imports: [UserModule, AuthModule, QuestionModule],
})
export class AppModule {}
