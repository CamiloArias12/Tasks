import { SERVICE_LIST } from 'libs/constants/service-list';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ClientsModule.registerAsync([
      {
        name: SERVICE_LIST.PROJECT_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('PROJECT_SERVICE_HOST', 'localhost'),
            port: configService.get<number>('PROJECT_SERVICE_PORT', 5001),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
