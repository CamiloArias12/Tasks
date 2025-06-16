import { SERVICE_LIST } from 'libs/constants/service-list';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommentService } from './comment.service';
import { AuthModule } from '../auth/auth.module';
import { CommentController } from './comment.controller';

@Module({
  imports: [
    AuthModule, // Import AuthModule to get access to USER_SERVICE
    ClientsModule.registerAsync([
      {
        name: SERVICE_LIST.COMMENT_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('COMMENT_SERVICE_HOST', 'localhost'),
            port: configService.get<number>('COMMENT_SERVICE_PORT', 5001),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
