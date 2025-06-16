import { Injectable, NotFoundException, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  TaskCreateReq,
  TaskUpdateReq,
  TaskCreateRes,
  TaskUpdateRes,
  TaskGetRes,
} from 'libs/task/dto';
import { Task, TaskStatus } from '../database/entities';
import { USER_PATTERN } from 'libs/user/user.pattern';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
  ) { }

  async create(dto: TaskCreateReq): Promise<TaskCreateRes> {
    this.logger.log(`Creating task: ${dto.title}`);

    const task = this.taskRepository.create({
      title: dto.title,
      description: dto.description,
      dueDate: new Date(dto.dueDate),
      status: dto.status as TaskStatus || TaskStatus.TODO,
      users: dto.users,
      projectId: dto.projectId,
    });

    const savedTask = await this.taskRepository.save(task);
    this.logger.log(`Task created with ID: ${savedTask.id}`);

    return { id: savedTask.id };
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
    tasks: TaskGetRes[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    this.logger.log('Finding all tasks with filters:', filters);

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const sortBy = filters?.sortBy || 'createdAt';
    const sortOrder = filters?.sortOrder || 'DESC';

    const query = this.taskRepository.createQueryBuilder('task');

    if (filters?.projectId) {
      query.andWhere('task.projectId = :projectId', { projectId: filters.projectId });
    }

    if (filters?.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }

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
      tasks: tasks.map(task => this.mapToTaskGetRes(task)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findById(id: string): Promise<TaskGetRes> {
    this.logger.log(`Finding task by ID: ${id}`);

    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return this.mapToTaskGetRes(task);
  }

  async findByProject(data: {
    projectId: string;
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    userId?: string;
    dueDate?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{
    tasks: TaskGetRes[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    this.logger.log(`Finding tasks by project: ${data.projectId} with filters:`, data);

    // Default values
    const page = data.page || 1;
    const limit = data.limit || 10;
    const sortBy = data.sortBy || 'createdAt';
    const sortOrder = data.sortOrder || 'DESC';

    const query = this.taskRepository.createQueryBuilder('task');

    query.where('task.projectId = :projectId', { projectId: data.projectId });

    if (data.status) {
      query.andWhere('task.status = :status', { status: data.status });
    }

    if (data.userId) {
      query.andWhere(':userId = ANY(task.users)', { userId: data.userId });
    }

    if (data.dueDate) {
      const date = new Date(data.dueDate);
      query.andWhere('DATE(task.dueDate) = DATE(:dueDate)', { dueDate: date });
    }

    if (data.search) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${data.search}%` }
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
      tasks: tasks.map(task => this.mapToTaskGetRes(task)),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async update(dto: TaskUpdateReq): Promise<TaskUpdateRes> {
    this.logger.log('TaskService.update called with:', dto);

    if (!dto.id) {
      throw new NotFoundException('Task ID is required for update');
    }

    const task = await this.taskRepository.findOne({ where: { id: dto.id } });
    if (!task) {
      throw new NotFoundException(`Task with id ${dto.id} not found`);
    }

    const oldStatus = task.status;
    const updateData: Partial<Task> = {};

    if (dto.title) updateData.title = dto.title;
    if (dto.description) updateData.description = dto.description;
    if (dto.dueDate) updateData.dueDate = new Date(dto.dueDate);
    if (dto.status) updateData.status = dto.status as TaskStatus;
    if (dto.users !== undefined) updateData.users = dto.users;

    await this.taskRepository.update(dto.id, updateData);

    if (dto.status && dto.status !== oldStatus && task.users && task.users.length > 0) {
      this.sendTaskStatusNotification(task, oldStatus, dto.status, 'System');
    }

    return { id: dto.id };
  }

  async delete(id: string, projectId: string) {
    this.logger.log(`Deleting task ${id} from project ${projectId}`);

    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    this.logger.log(`Task deleted: ${id}`);
    return { success: true };
  }

  private async sendTaskStatusNotification(
    task: Task,
    oldStatus: string,
    newStatus: string,
    changedBy: string = 'System'
  ) {
    try {
      this.logger.log(`Sending status change notifications for task: ${task.id}`);
      for (const userId of task.users) {
        try {
          const userResponse = await firstValueFrom(
            this.userService.send(USER_PATTERN.USER_GET, userId)
          );

          if (userResponse.success && userResponse.data) {
            const user = userResponse.data;

            await this.callExternalNotificationService({
              taskId: task.id,
              taskTitle: task.title,
              oldStatus: oldStatus,
              newStatus: newStatus,
              userEmail: user.email,
              userName: user.name,
              projectName: task.projectId,
              changedBy: changedBy,
              changedAt: new Date().toISOString(),
            });

          }
        } catch (userError) {
          this.logger.error(`Failed to get user ${userId}:`, userError);
        }
      }
    } catch (error) {
      this.logger.error('Failed to send task status notifications:', error.message);
    }
  }

  private async callExternalNotificationService(notification: any) {
    try {
      const externalUrl = process.env.EXTERNAL_URL || "http://localhost:5004";
      this.logger.log('Calling external notification service with:', notification);
      const response = await fetch(`${externalUrl}/mailer/task-status-change`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.EXTERNAL_API_KEY || 'ext_inlanze_2025_key',
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      this.logger.error('Failed to call external notification service:', error.message);
      throw error;
    }
  }

  private mapToTaskGetRes(task: Task): TaskGetRes {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status as any,
      users: task.users,
      projectId: task.projectId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}