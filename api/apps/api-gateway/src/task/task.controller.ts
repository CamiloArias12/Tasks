import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import {
  TaskCreateReq,
  TaskUpdateReq,
  TaskGetRes,
  TaskUpdateRes,
  TaskCreateRes,
} from 'libs/task/dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '../common/guards/auth.guard';
import { ZodValidationPipe } from 'nestjs-zod';
import { SuccessResponse } from '@libs/contracts/general/dto';

@Controller("task")
@UseGuards(AuthGuard, RolesGuard)
export class TaskController {
  private readonly logger = new Logger(TaskController.name);

  constructor(private readonly taskService: TaskService) { }

  @Post()
  async create(
    @Body(new ZodValidationPipe(TaskCreateReq)) dto: TaskCreateReq
  ) {
    return await this.taskService.create(dto);
  }

  @Get()
  async list(): Promise<SuccessResponse<TaskGetRes[]>> {
    // Sin filtros, solo lista básica
    return await this.taskService.getAll();
  }

  @Get(':id')
  async get(@Param('id') taskId: string): Promise<SuccessResponse<TaskGetRes>> {
    return await this.taskService.getById(taskId);
  }

  @Get('project/:id')
  async getTasksByProject(
    @Param('id') projectId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('userId') userId?: string, // UUID del usuario en el array users
    @Query('dueDate') dueDate?: string, // YYYY-MM-DD format
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC'
  ): Promise<SuccessResponse<{
    tasks: TaskGetRes[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>> {
    const filters = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      status,
      userId, // UUID del usuario en el array users
      projectId, // Se incluye automáticamente del parámetro
      dueDate,
      sortBy,
      sortOrder,
    };

    return await this.taskService.getTasksByProject(projectId, filters);
  }

  @Put(':id')
  async update(
    @Param('id') taskId: string,
    @Body(new ZodValidationPipe(TaskUpdateReq)) dto: TaskUpdateReq,
  ): Promise<SuccessResponse<TaskUpdateRes>> {
    return await this.taskService.update(taskId, dto);
  }

  @Delete(':id')
  async delete(@Param('id') taskId: string): Promise<SuccessResponse<{ success: boolean }>> {
    return await this.taskService.delete(taskId);
  }
}
