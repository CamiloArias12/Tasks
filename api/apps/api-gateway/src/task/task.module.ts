import { SERVICE_LIST } from 'libs/constants/service-list';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule, // Import AuthModule to get access to USER_SERVICE
    ClientsModule.registerAsync([
      {
        name: SERVICE_LIST.TASK_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('TASK_SERVICE_HOST', 'localhost'),
            port:  configService.get<number>('TASK_SERVICE_PORT', 5001),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
