import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { Comment } from '../database/entities';
import { CommentRepository } from './comment.repository';
import { CommentController } from './comment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
  ],
  controllers: [CommentController],
  providers: [CommentRepository, CommentService],
})
export class CommentModule {}
