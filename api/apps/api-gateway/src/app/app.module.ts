import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { TaskModule } from '../task/task.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    ProjectModule,
    TaskModule,
    CommentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
