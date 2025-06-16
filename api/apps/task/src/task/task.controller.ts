import { EventResponseWrapperInterceptor } from '@libs/contracts/general/event-response-wrapper-interceptor';
import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TaskService } from './task.service';
import {
  TaskCreateReq,
  TaskUpdateReq,
  TaskFilterReq,
} from 'libs/task/dto';
import { TASK_PATTERN } from 'libs/task/task.pattern';

@Controller()
export class TaskController {
  private readonly logger = new Logger(TaskController.name);

  constructor(private readonly taskService: TaskService) {}

  @MessagePattern(TASK_PATTERN.TASK_CREATE)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async create(@Payload() dto: TaskCreateReq) {
    return await this.taskService.create(dto);
  }

  @MessagePattern(TASK_PATTERN.TASK_LIST)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async findAll(@Payload() filters?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    userId?: string;
    projectId?: string;
    dueDate?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) {
    this.logger.log('Received task.list message with filters:', filters);
    return await this.taskService.findAll(filters);
  }

  @MessagePattern(TASK_PATTERN.TASK_GET)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async findById(@Payload() data: { id: string }) {
    this.logger.log(`Received task.get message for ID: ${data.id}`);
    return await this.taskService.findById(data.id);
  }

  @MessagePattern(TASK_PATTERN.TASK_GET_BY_PROJECT)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async findByProject(@Payload() data: {
    projectId: string;
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    userId?: string;
    dueDate?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) {
    this.logger.log(`Received task.getByProject message for project: ${data.projectId} with filters:`, data);
    return await this.taskService.findByProject(data);
  }

  @MessagePattern(TASK_PATTERN.TASK_UPDATE)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async update(@Payload() data: TaskUpdateReq) {
    return await this.taskService.update(data);
  }

  @MessagePattern(TASK_PATTERN.TASK_DELETE)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async delete(@Payload() data: { id: string; projectId: string }) {
    this.logger.log(`Received task.delete message for ID: ${data.id}, project: ${data.projectId}`);
    return await this.taskService.delete(data.id, data.projectId);
  }
}