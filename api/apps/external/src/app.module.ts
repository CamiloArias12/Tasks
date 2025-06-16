import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true ,envFilePath: '.env'}),
    MailerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
