import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('COMMENT_DB_HOST'),
        port: configService.get('COMMENT_DB_PORT'),
        username: configService.get('COMMENT_DB_USERNAME'),
        password: configService.get('COMMENT_DB_PASSWORD'),
        database: configService.get('COMMENT_DB_NAME') || 'postgres',
        entities: [Comment],
        migrationsRun: true,
        synchronize: true,
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([Comment]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
