import { SERVICE_LIST } from 'libs/constants/service-list';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendEvent } from '../common/helper/send-event';
import { TASK_PATTERN } from 'libs/task/task.pattern';
import { TaskCreateReq, TaskCreateRes, TaskGetRes, TaskUpdateReq, TaskUpdateRes } from 'libs/task/dto';

@Injectable()
export class TaskService {
  
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @Inject(SERVICE_LIST.TASK_SERVICE)
    private readonly taskService: ClientProxy,
  ) {}

  async create(taskCreateDto: TaskCreateReq): Promise<TaskCreateRes> {
    const res = await sendEvent<TaskCreateRes, TaskCreateReq>(
      this.taskService, 
      TASK_PATTERN.TASK_CREATE,
      taskCreateDto,
      this.logger,
    );
    return {id: res.data.id};
  }

  async getAll() {
    // Lista simple sin filtros
    const res = await sendEvent<TaskGetRes[], any>(
      this.taskService,
      TASK_PATTERN.TASK_LIST,
      {},
      this.logger,
    );
    return res;
  }

  async getById(id: string) {
    const res = await sendEvent<TaskGetRes, any>(
      this.taskService,
      TASK_PATTERN.TASK_GET,
      { id },
      this.logger,
    );
    return res;
  }

  async getTasksByProject(projectId: string, filters?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    userId?: string;
    dueDate?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) {
    this.logger.log(`TaskService.getTasksByProject: projectId=${projectId}`, filters);
    
    const payload = {
      projectId,
      ...filters
    };

    return sendEvent<{
      tasks: TaskGetRes[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }, any>(
      this.taskService, 
      TASK_PATTERN.TASK_GET_BY_PROJECT,
      payload,
      this.logger,
    );
  }

  async update(id: string, dto: any) {
    const res = await sendEvent<any, any>(
      this.taskService, 
      TASK_PATTERN.TASK_UPDATE,
      { id, ...dto },
      this.logger,
    );
    return res;
  }

  async delete(id: string) {
    const res = await sendEvent<any, any>(
      this.taskService, 
      TASK_PATTERN.TASK_DELETE,
      { id },
      this.logger,
    );
    return res;
  }
}
