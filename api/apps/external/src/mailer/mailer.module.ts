import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MaileController } from './mailer.controller';
import { ApiKeyMiddleware } from '../middelwate';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [MaileController],
  providers: [MailerService],
})
export class MailerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiKeyMiddleware)
      .forRoutes('*'); 
  }
}
