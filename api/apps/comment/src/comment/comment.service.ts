import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { 
  CommentCreateReq, 
  CommentCreateRes, 
  CommentUpdateReq, 
  CommentUpdateRes,
  CommentGetRes,
  CommentListRes 
} from 'libs/comment/dto';
import { Comment } from '../database/entities';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(
    private readonly repository: CommentRepository,
  ) {}

  async create(dto: CommentCreateReq): Promise<CommentCreateRes> {
    const commentData = {
      description: dto.description,
      taskId: dto.taskId,
      userId: dto.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const comment = await this.repository.create(commentData);
    this.logger.log(`Comment created successfully with ID: ${comment.id}`);
    
    return {
      id: comment.id,
    };
  }

  async findById(id: string): Promise<CommentGetRes> {
    const comment = await this.repository.findById(id);
    
    if (!comment) {
      throw new NotFoundException({
        message: 'Comment not found',
        success: false,
      });
    }

    return {
      id: comment.id,
      description: comment.description,
      userId: comment.userId,
      taskId: comment.taskId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  async findAll(): Promise<CommentListRes> {
    const comments = await this.repository.findAll();
    
    const commentList = comments.map(comment => ({
      id: comment.id,
      description: comment.description,
      userId: comment.userId,
      taskId: comment.taskId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));

    return {
      comments: commentList,
      total: comments.length,
    };
  }

  async update(id: string, dto: CommentUpdateReq): Promise<CommentUpdateRes> {
    const existingComment = await this.repository.findById(id);
    
    if (!existingComment) {
      throw new NotFoundException({
        message: 'Comment not found',
        success: false,
      });
    }

    const updateData: Comment = new Comment();
    if (dto.description) updateData.description = dto.description;
    await this.repository.update(id, updateData);
    this.logger.log(`Comment updated successfully with ID: ${id}`);

    return {
      id,
    };
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const existingComment = await this.repository.findById(id);
    
    if (!existingComment) {
      throw new NotFoundException({
        message: 'Comment not found',
        success: false,
      });
    }

    const deleted = await this.repository.delete(id);
    this.logger.log(`Comment deleted successfully with ID: ${id}`);

    return {
      success: deleted,
    };
  }

  async findByTaskId(taskId: string): Promise<CommentListRes> {
    const comments = await this.repository.findByTaskId(taskId);
    
  

    const commentList = comments.map(comment => ({
      id: comment.id,
      description: comment.description,
      userId: comment.userId,
      taskId: comment.taskId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));

    return {
      comments: commentList,
      total: comments.length,
    };
  }
}