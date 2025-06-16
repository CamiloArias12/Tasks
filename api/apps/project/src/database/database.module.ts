import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('PROJECT_DB_HOST'),
        port: configService.get('PROJECT_DB_PORT'),
        username: configService.get('PROJECT_DB_USERNAME'),
        password: configService.get('PROJECT_DB_PASSWORD'),
        database: configService.get('PROJECT_DB_NAME') || 'postgres',
        entities: [Project],
        migrationsRun: true,
        synchronize: true,
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([Project]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
