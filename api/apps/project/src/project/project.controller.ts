import { EventResponseWrapperInterceptor } from '@libs/contracts/general/event-response-wrapper-interceptor';
import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ProjectCreateReq,
  ProjectUpdateReq
} from 'libs/project/dto';
import { PROJECT_PATTERN } from 'libs/project/project.pattern';
import { ProjectService } from './project.service';

@Controller()
export class ProjectController {
  private readonly logger = new Logger(ProjectController.name);

  constructor(private readonly projectService: ProjectService) { }

  @MessagePattern(PROJECT_PATTERN.PROJECT_CREATE)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async create(@Payload() dto: ProjectCreateReq) {
    return await this.projectService.create(dto);
  }

  @MessagePattern(PROJECT_PATTERN.PROJECT_LIST)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async findAll() {
    return await this.projectService.findAll();
  }

  @MessagePattern(PROJECT_PATTERN.PROJECT_GET)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async findById(@Payload() data: { id: string }) {
    this.logger.log(`Received project.findById message for ID: ${data.id}`);
    return await this.projectService.findById(data.id);
  }

  @MessagePattern(PROJECT_PATTERN.PROJECT_UPDATE)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async update(@Payload() data: { id: string; dto: ProjectUpdateReq }) {
    this.logger.log(`Received project.update message for ID: ${data.id}`);
    return await this.projectService.update(data.id, data.dto);
  }

  @MessagePattern(PROJECT_PATTERN.PROJECT_DELETE)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async delete(@Payload() data: { id: string }) {
    this.logger.log(`Received project.delete message for ID: ${data.id}`);
    return await this.projectService.delete(data.id);
  }

}
