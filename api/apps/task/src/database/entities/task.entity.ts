import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.TODO
  })
  status: TaskStatus;

  @Column({ type: 'simple-array', nullable: true })
  users?: string[];

  @Column({ type: 'uuid' })
  projectId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}