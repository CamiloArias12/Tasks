import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommentModule } from './comment/comment.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
