import { IProject } from 'libs/project/interfaces';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('project')
export class Project implements IProject {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id?: string;


  @Column({
    nullable: true,
    name: 'name',
  })
  name: string;

  @Column({
    nullable: true,
    name: 'duration',
  })
  duration: number;

  @Column({
    nullable: true,
    name: 'start_date',
  })
  startDate: Date;
  @Column({
    nullable: true,
    name: 'end_date',
  })
  endDate: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;


  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}