import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectRepository } from './project.repository';
import { ProjectController } from './project.controller';
import { Project } from '../database/entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
  ],
  controllers: [ProjectController],
  providers: [ProjectRepository, ProjectService],
})
export class ProjectModule {}
