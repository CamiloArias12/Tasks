import { EventResponseWrapperInterceptor } from '@libs/contracts/general/event-response-wrapper-interceptor';
import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommentService } from './comment.service';
import {
  CommentCreateReq,
  CommentUpdateReq
} from 'libs/comment/dto';
import { COMMENT_PATTERN } from 'libs/comment/comment.pattern';

@Controller()
export class CommentController {
  constructor(private readonly projectService: CommentService) { }

  @MessagePattern(COMMENT_PATTERN.COMMENT_CREATE)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async create(@Payload() dto: CommentCreateReq) {
    return await this.projectService.create(dto);
  }

  @MessagePattern(COMMENT_PATTERN.COMMENT_LIST)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async findAll() {
    return await this.projectService.findAll();
  }

  @MessagePattern(COMMENT_PATTERN.COMMENT_GET)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async findById(@Payload() data: { id: string }) {
    return await this.projectService.findById(data.id);
  }

  @MessagePattern(COMMENT_PATTERN.COMMENT_UPDATE)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async update(@Payload() data: CommentUpdateReq ) {
    return await this.projectService.update(data.id, data);
  }

  @MessagePattern(COMMENT_PATTERN.COMMENT_DELETE)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async delete(@Payload() data: { id: string }) {
    return await this.projectService.delete(data.id);
  }

  @MessagePattern(COMMENT_PATTERN.COMMENT_GET_BY_TASK)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async findByTaskId(@Payload() data: { taskId: string }) {
    return await this.projectService.findByTaskId(data.taskId);
  }
}
