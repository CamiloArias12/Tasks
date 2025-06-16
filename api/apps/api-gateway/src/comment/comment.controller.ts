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
import { CommentService } from './comment.service';
import {
  CommentCreateReq,
  CommentGetRes,
  CommentUpdateReq,
  CommentUpdateRes,
} from 'libs/comment/dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '../common/guards/auth.guard';
import { ZodValidationPipe } from 'nestjs-zod';
import { SuccessResponse } from '@libs/contracts/general/dto';

@Controller("comment")
@UseGuards(AuthGuard, RolesGuard)
export class CommentController {
  private readonly logger = new Logger(CommentController.name);

  constructor(private readonly commentService: CommentService) { }

  @Post()
  @UsePipes(new ZodValidationPipe(CommentCreateReq))
  async create(@Body() dto: CommentCreateReq) :Promise<SuccessResponse<CommentUpdateRes>> {
    return await this.commentService.create(dto);
  }

  @Get()
  async list(): Promise<SuccessResponse<CommentGetRes[]>> {
    return await this.commentService.getAll();
  }

  @Get(':id')
  async get(@Param('id') commentId: string) : Promise<SuccessResponse<CommentGetRes>> {
    return await this.commentService.getById(commentId);
  }

  @Get('task/:id')
  async getByTaskId(@Param('id') taskId: string) : Promise<SuccessResponse<CommentGetRes>> {
    return await this.commentService.getByTaskId(taskId);
  }



  @Put(':id')
  @UsePipes()
  async update (
    @Param('id') commentId: string,
    @Body(new ZodValidationPipe(CommentUpdateReq)) dto: CommentUpdateReq,
  ):Promise<SuccessResponse<CommentUpdateRes>> {
    return await this.commentService.update(commentId, dto);
  }

  @Delete(':id')
  async delete(@Param('id') commentId: string) {
    return await this.commentService.delete(commentId);
  }
}
