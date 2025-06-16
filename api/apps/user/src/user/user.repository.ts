import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from '../database/entities';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async getById(userId: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id: userId },
    });
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
    });
  }

  async getAll(filters?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const sortBy = filters?.sortBy || 'createdAt';
    const sortOrder = filters?.sortOrder || 'DESC';

    const queryBuilder = this.repository.createQueryBuilder('user');

    queryBuilder.where('user.deletedAt IS NULL');

    if (filters?.role) {
      queryBuilder.andWhere('user.role = :role', { role: filters.role });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    switch (sortBy) {
      case 'name':
        queryBuilder.orderBy('user.name', sortOrder);
        break;
      case 'email':
        queryBuilder.orderBy('user.email', sortOrder);
        break;
      case 'createdAt':
        queryBuilder.orderBy('user.createdAt', sortOrder);
        break;
      case 'updatedAt':
        queryBuilder.orderBy('user.updatedAt', sortOrder);
        break;
      default:
        queryBuilder.orderBy('user.createdAt', sortOrder);
    }

    const [users, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async update(userId: string, user: Partial<User>): Promise<User | null> {
    await this.repository.update(userId, user);
    return this.getById(userId);
  }

  async getList(): Promise<User[]> {
    return this.repository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return result.affected > 0;
  }
}
