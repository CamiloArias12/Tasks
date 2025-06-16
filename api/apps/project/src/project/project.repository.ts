import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUpdateRes } from 'libs/project/dto';
import { Project } from '../database/entities/project.entity';

@Injectable()
export class ProjectRepository {
  
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,
  ) { }

  async create(data: Project): Promise<ProjectUpdateRes> {
    const project = this.repository.create(data);
    return { id: (await this.repository.save(project)).id };
  }

  async findById(id: string): Promise<Project | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Project[]> {
    return await this.repository.find();
  }

  async update(id: string, data: Project): Promise<ProjectUpdateRes | null> {
    await this.repository.update(id, data);
    return { id: (await this.findById(id)).id };
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return result.affected > 0;
  }
}