import { IComment } from 'libs/comment/interfaces';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('project')
export class Comment implements IComment {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id?: string;


  @Column({
    nullable: true,
    name: 'description',
  })
  description: string;

  @Column({
    nullable: true,
    name: 'task_id',
  })
  taskId: string;

  @Column({
    nullable: true,
    name: 'user_id',
  })
  userId: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;


  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}