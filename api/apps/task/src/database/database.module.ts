import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('TASK_DB_HOST'),
        port: configService.get('TASK_DB_PORT'),
        username: configService.get('TASK_DB_USERNAME'),
        password: configService.get('TASK_DB_PASSWORD'),
        database: configService.get('TASK_DB_NAME') || 'postgres',
        entities: [Task],
        migrationsRun: true,
        synchronize: true,
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([Task]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
