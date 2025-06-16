import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { Task } from '../database/entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.USER_SERVICE_HOST || 'localhost',
          port: parseInt(process.env.USER_SERVICE_PORT) || 3001,
        },
      },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
  exports: [TaskService, TaskRepository],
})
export class TaskModule {}
