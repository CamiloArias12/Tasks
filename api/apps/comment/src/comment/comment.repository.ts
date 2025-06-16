import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../database/entities/comment.entity';
import { CommentUpdateRes } from 'libs/comment/dto';

@Injectable()
export class CommentRepository {
  
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
  ) { }

  async create(data: Comment): Promise<CommentUpdateRes> {
    const project = this.repository.create(data);
    return { id: (await this.repository.save(project)).id };
  }

  async findById(id: string): Promise<Comment | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findAll(): Promise<Comment[]> {
    return await this.repository.find();
  }

  async update(id: string, data: Comment): Promise<CommentUpdateRes | null> {
    await this.repository.update(id, data);
    return { id: (await this.findById(id)).id };
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return result.affected > 0;
  }

  findByTaskId(taskId: string) {
    return this.repository.find({
      where: { taskId: taskId },
      order: { createdAt: 'ASC' },
    });
  }
}