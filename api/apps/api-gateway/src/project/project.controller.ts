import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import { User } from '../common/decorators';
import { ProjectService } from './project.service';
import {
  ProjectCreateReq,
  ProjectGetRes,
  ProjectUpdateReq,
  ProjectUpdateRes,
} from 'libs/project/dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '../common/guards/auth.guard';
import { ZodValidationPipe } from 'nestjs-zod';
import { SuccessResponse } from '@libs/contracts/general/dto';

@Controller("project")
@UseGuards(AuthGuard, RolesGuard)
export class ProjectController {
  private readonly logger = new Logger(ProjectController.name);

  constructor(private readonly projectService: ProjectService) { }

  @Post()
  @UsePipes(new ZodValidationPipe(ProjectCreateReq))
  async create(@Body() dto: ProjectCreateReq) :Promise<SuccessResponse<ProjectUpdateRes>> {
    return await this.projectService.create(dto);
  }

  @Get()
  async list(): Promise<SuccessResponse<ProjectGetRes[]>> {
    return await this.projectService.getAll();
  }

  @Get(':id')
  async get(@Param('id') projectId: string) : Promise<SuccessResponse<ProjectGetRes>> {
    return await this.projectService.getById(projectId);
  }

  @Put(':id')
  async update(
    @Param('id') projectId: string,
    @Body(new ZodValidationPipe(ProjectUpdateReq)) dto: ProjectUpdateReq,
  ): Promise<SuccessResponse<ProjectUpdateRes>> {
    return await this.projectService.update(projectId, dto);
  }

  @Delete(':id')
  async delete(@Param('id') projectId: string) {
    return await this.projectService.delete(projectId);
  }
}
