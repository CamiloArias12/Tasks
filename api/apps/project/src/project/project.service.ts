import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { 
  ProjectCreateReq, 
  ProjectCreateRes, 
  ProjectUpdateReq, 
  ProjectUpdateRes,
  ProjectGetRes,
  ProjectListRes 
} from 'libs/project/dto';
import { Project } from '../database/entities';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    private readonly repository: ProjectRepository,
  ) {}

  async create(dto: ProjectCreateReq): Promise<ProjectCreateRes> {
    const projectData = {
      duration: dto.duration,
      name: dto.name,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const project = await this.repository.create(projectData);
    this.logger.log(`Project created successfully with ID: ${project.id}`);
    
    return {
      id: project.id,
    };
  }

  async findById(id: string): Promise<ProjectGetRes> {
    const project = await this.repository.findById(id);
    
    if (!project) {
      throw new NotFoundException({
        message: 'Project not found',
        success: false,
      });
    }

    return {
      id: project.id,
      name: project.name,
      startDate: project.startDate,
      endDate: project.endDate,
      duration: project.duration,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  async findAll(): Promise<ProjectListRes> {
    const projects = await this.repository.findAll();
    
    const projectList = projects.map(project => ({
      id: project.id,
      name: project.name,
      startDate: project.startDate,
      endDate: project.endDate,
      duration: project.duration,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));

    return {
      projects: projectList,
      total: projects.length,
    };
  }

  async update(id: string, dto: ProjectUpdateReq): Promise<ProjectUpdateRes> {
    const existingProject = await this.repository.findById(id);
    
    if (!existingProject) {
      throw new NotFoundException({
        message: 'Project not found',
        success: false,
      });
    }

    const updateData: Project = new Project();
    if (dto.name) updateData.name = dto.name;
    if (dto.duration) updateData.duration = dto.duration;
    if (dto.startDate) updateData.startDate = new Date(dto.startDate);
    if (dto.endDate) updateData.endDate = new Date(dto.endDate);
    await this.repository.update(id, updateData);
    this.logger.log(`Project updated successfully with ID: ${id}`);

    return {
      id,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const existingProject = await this.repository.findById(id);
    
    if (!existingProject) {
      throw new NotFoundException({
        message: 'Project not found',
        success: false,
      });
    }

    const deleted = await this.repository.delete(id);
    this.logger.log(`Project deleted successfully with ID: ${id}`);

    return {
      success: deleted,
    };
  }

}