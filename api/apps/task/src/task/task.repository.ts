import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../database/entities';
import { TaskCreateRes, TaskGetRes, TaskUpdateRes } from 'libs/task/dto';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
  ) { }

  async create(data: Task): Promise<TaskCreateRes> {
    const project = this.repository.create(data);
    return { id: (await this.repository.save(project)).id };
  }

  async findById(id: string): Promise<Task | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async list(): Promise<Task[]> {
    return await this.repository.find();
  }

   async findAll(filters?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      userId?: string;
      projectId?: string;
      dueDate?: string;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    }): Promise<{
      tasks: Task[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }> {
  
      const page = filters?.page || 1;
      const limit = filters?.limit || 10;
      const sortBy = filters?.sortBy || 'createdAt';
      const sortOrder = filters?.sortOrder || 'DESC';
  
      const query = this.repository.createQueryBuilder('task');
  
  
      if (filters?.projectId) {
        query.andWhere('task.projectId = :projectId', { projectId: filters.projectId });
      }
  
      if (filters?.status) {
        query.andWhere('task.status = :status', { status: filters.status });
      }
  
      // Filtrar por usuario en el array users
      if (filters?.userId) {
        query.andWhere(':userId = ANY(task.users)', { userId: filters.userId });
      }
  
      if (filters?.dueDate) {
        const date = new Date(filters.dueDate);
        query.andWhere('DATE(task.dueDate) = DATE(:dueDate)', { dueDate: date });
      }
  
      if (filters?.search) {
        query.andWhere(
          '(task.title ILIKE :search OR task.description ILIKE :search)',
          { search: `%${filters.search}%` }
        );
      }
  
      switch (sortBy) {
        case 'title':
          query.orderBy('task.title', sortOrder);
          break;
        case 'status':
          query.orderBy('task.status', sortOrder);
          break;
        case 'dueDate':
          query.orderBy('task.dueDate', sortOrder);
          break;
        case 'createdAt':
          query.orderBy('task.createdAt', sortOrder);
          break;
        case 'updatedAt':
          query.orderBy('task.updatedAt', sortOrder);
          break;
        default:
          query.orderBy('task.createdAt', sortOrder);
      }
  
      const skip = (page - 1) * limit;
      query.skip(skip).take(limit);
  
      const [tasks, total] = await query.getManyAndCount();
      const totalPages = Math.ceil(total / limit);
  
      return {
        tasks,
        total,
        page,
        limit,
        totalPages,
      };
    }

  async update(id: string, data: Task): Promise<TaskUpdateRes | null> {
    await this.repository.update(id, data);
    return { id: (await this.findById(id)).id };
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return result.affected > 0;
  }


}