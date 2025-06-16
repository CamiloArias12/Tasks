import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from './crypto.service';
import { UserRepository } from './user.repository';
import { UserCreateReq, UserCreateRes, UserGetRes, UserLoginReq, UserLoginRes, UserUpdateReq, UserUpdateRes, ValidateTokenDto } from 'libs/user/dto';
import { EUserRole } from 'libs/user/enums';
import { IJwtPayload } from 'libs/user/interfaces';
import { User } from '../database/entities';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  
  constructor(
    @Inject()
    private readonly repository: UserRepository,
    @Inject()
    private readonly cryptoService: CryptoService,
    @Inject()
    private readonly jwtServie: JwtService,
  ) { }

  async login(dto: UserLoginReq) : Promise<UserLoginRes> {
    const users = await this.repository.getAll();
    const user = await this.repository.getByEmail(
      dto.email,
    );

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        success: false,
        code: "404",
      });
    }

    const isMatched = await this.cryptoService.comparePassword(
      dto.password,
      user.hashedPassword,
    );

    if (!isMatched) {
      this.logger.log(`userLogin password invalid  ${user.id}`);
      throw new UnauthorizedException({
        message: 'Invalid password',
        code:401,
      });
    }
    const payload: IJwtPayload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };
    const token = await this.jwtServie.signAsync(payload);

    return {
      id: user.id,
      role: user.role,
      token,
    };
  }

  async create(dto: UserCreateReq) :Promise<UserCreateRes> {
    const existingUser = await this.repository.getByEmail(dto.email);
    if (existingUser) {
      throw new NotFoundException({
        message: 'User already exists',
        success: false,
      });
    }
    const hashedPassword = await this.cryptoService.hashPassword(dto.password);
    const currentDate = new Date();
    const user = await this.repository.create({
      hashedPassword: hashedPassword,
      email: dto.email,
      role: dto.role ? (typeof dto.role === 'string' ? EUserRole[dto.role.toUpperCase()] : dto.role) : EUserRole.USER,
      createdAt: currentDate,
      updatedAt: currentDate,
      name: dto.name
    });
    this.logger.log(`User created successfully with ID: ${user.id}`);
    return {
      id: user.id,    };
  }

  async get(userId: string): Promise<UserGetRes> {
    const user = await this.repository.getById(userId);
    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
        success: false,
        code:"404",
      });
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getAll(filters?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{
    users: UserGetRes[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const result = await this.repository.getAll(filters);
    
    return {
      users: result.users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async getList(): Promise<User[]> {
    return await this.repository.getList();
  }
    
  async validateToken(dto: ValidateTokenDto): Promise<IJwtPayload> {
    try {
      const payload = await this.jwtServie.verifyAsync<IJwtPayload>(
        dto.token,
      );
      this.logger.log(`validateToken success ${payload.id}`);
      return payload;
    } catch (error) {
      this.logger.log(`validateToken error ${error.message}`);
      throw new UnauthorizedException({
        message: 'Invalid token',
        code: "401",
      });
    }
  }

  async update(dto: UserUpdateReq): Promise<UserUpdateRes> {
    if (!dto.id) {
      throw new NotFoundException('User ID is required for update');
    }
    
    const user = await this.repository.getById(dto.id);
    if (!user) {
      throw new NotFoundException(`User with id ${dto.id} not found`);
    }

    const updateData: User = new User();
    if (dto.name) updateData.name = dto.name;
    if (dto.email) updateData.email = dto.email;
    if (dto.password) {
      updateData.hashedPassword = await this.cryptoService.hashPassword(dto.password);
    }
    if (dto.role) updateData.role = typeof dto.role === 'string' ? EUserRole[dto.role.toUpperCase()] : dto.role;

    await this.repository.update(dto.id, updateData);
    this.logger.log(`User updated: ${dto.id}`);

    return { id: dto.id };
  }

  async delete(id: string) {
    return await this.repository.delete(id);
  }
  
}
