import { EUserRole } from '../../../../../libs/user/enums';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id?: string;

  @Column({
    nullable: false,
    name: 'name',
  })
  name: string;

  @Column({
    nullable: false,
    unique: true,
    name: 'email',
  })
  email: string;

  @Column({
    nullable: false,
    name: 'hashed_password',
  })
  hashedPassword: string;

  @Column({
    type: 'enum',
    enum: EUserRole,
    default: EUserRole.USER,
  })
  role: EUserRole;

  @CreateDateColumn({ type: 'date', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'date', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

}
