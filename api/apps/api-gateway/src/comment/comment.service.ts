import { SERVICE_LIST } from 'libs/constants/service-list';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendEvent } from '../common/helper/send-event';
import { COMMENT_PATTERN } from 'libs/comment/comment.pattern';
import { CommentCreateReq, CommentCreateRes } from 'libs/comment/dto';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(
    @Inject(SERVICE_LIST.COMMENT_SERVICE)
    private readonly projectService: ClientProxy,
  ) {}

  async create(loginCommentDto: CommentCreateReq){
    const res = await sendEvent<CommentCreateRes, CommentCreateReq>(
      this.projectService,
      COMMENT_PATTERN.COMMENT_CREATE,
      loginCommentDto,
      this.logger,
    );
    return res;
  }
  async getAll() {
    const res = await sendEvent<any, any>(
      this.projectService,
      COMMENT_PATTERN.COMMENT_LIST,
      {},
      this.logger,
    );
    return res;
  }

  async getById(id: string) {
    const res = await sendEvent<any, any>(
      this.projectService,
      COMMENT_PATTERN.COMMENT_GET,
      { id },
      this.logger,
    );
    return res;
  }

  async getByTaskId(taskId: string) {
    const res = await sendEvent<any, any>(
      this.projectService,
      COMMENT_PATTERN.COMMENT_GET_BY_TASK,
      { taskId },
      this.logger,
    );
    return res;
  }

  async update(id: string, dto: any) {
    const res = await sendEvent<any, any>(
      this.projectService,
      COMMENT_PATTERN.COMMENT_UPDATE,
      { id, ...dto },
      this.logger,
    );
    return res;
  }
  async delete(id: string) {
    const res = await sendEvent<any, any>(
      this.projectService,
      COMMENT_PATTERN.COMMENT_DELETE,
      { id },
      this.logger,
    );
    return res;
  }

}
