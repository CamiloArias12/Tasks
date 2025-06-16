import { SERVICE_LIST } from 'libs/constants/service-list';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SERVICE_LIST.USER_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('USER_SERVICE_HOST', 'localhost'),
            port: configService.get<number>('USER_SERVICE_PORT', 3001),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, ClientsModule],
})
export class AuthModule {}
