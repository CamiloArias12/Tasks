import { SERVICE_LIST } from 'libs/constants/service-list';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendEvent } from '../common/helper/send-event';
import { PROJECT_PATTERN } from 'libs/project/project.pattern';
import { ProjectCreateReq, ProjectCreateRes, ProjectUpdateReq } from 'libs/project/dto';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @Inject(SERVICE_LIST.PROJECT_SERVICE)
    private readonly projectService: ClientProxy,
  ) {}

  async create(loginUserDto: ProjectCreateReq){
    const res = await sendEvent<ProjectCreateRes, ProjectCreateReq>(
      this.projectService,
      PROJECT_PATTERN.PROJECT_CREATE,
      loginUserDto,
      this.logger,
    );
    return res;
  }
  async getAll() {
    const res = await sendEvent<any, any>(
      this.projectService,
      PROJECT_PATTERN.PROJECT_LIST,
      {},
      this.logger,
    );
    return res;
  }

  async getById(id: string) {
    const res = await sendEvent<any, any>(
      this.projectService,
      PROJECT_PATTERN.PROJECT_GET,
      { id },
      this.logger,
    );
    return res;
  }

  async update(id: string, dto: ProjectUpdateReq) {
    const res = await sendEvent<any, any>(
      this.projectService,
      PROJECT_PATTERN.PROJECT_UPDATE,
      { id, ...dto },
      this.logger,
    );
    return res;
  }
  async delete(id: string) {
    const res = await sendEvent<any, any>(
      this.projectService,
      PROJECT_PATTERN.PROJECT_DELETE,
      { id },
      this.logger,
    );
    return res;
  }

}
