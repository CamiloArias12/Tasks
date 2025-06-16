import { Body, Controller, Delete, Get, Logger, Param, Post, Put, Query, UseGuards, UsePipes } from '@nestjs/common';
import { Public, User } from '../common/decorators';
import { UserService } from './user.service';
import { SuccessResponse } from '@libs/contracts/general/dto';
import { UserCreateReq, UserCreateRes, UserGetRes, UserUpdateReq, UserUpdateRes } from 'libs/user/dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '../common/guards/auth.guard';
import { ZodValidationPipe } from 'nestjs-zod';
import { User as UserDto } from 'apps/user/src/database/entities';

@Controller("user")
export class UserController {
  constructor(private readonly authService: UserService) { }

  @Post('/')
  @UsePipes(new ZodValidationPipe(UserCreateReq))
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body() dto: UserCreateReq): Promise<SuccessResponse<UserCreateRes>> {
    const res = await this.authService.create(dto);
    return res;
  }

  @Get('/')
  @UseGuards(AuthGuard, RolesGuard)
  async getUser(@User() user: UserDto): Promise<SuccessResponse<UserGetRes>> {
    Logger.log(`UserController.getUser: ${JSON.stringify(user)}`, 'UserController');
    return await this.authService.get(user.id);
  }

  @Get('/all')
  @UseGuards(AuthGuard, RolesGuard)
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC'
  ): Promise<SuccessResponse<{
    users: UserGetRes[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>> {
    const filters = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
      role,
      sortBy,
      sortOrder,
    };

    return await this.authService.getAll(filters);
  }

  @Get('/list')
  @UseGuards(AuthGuard, RolesGuard)
  async getUserList(): Promise<SuccessResponse<UserGetRes[]>> {
    Logger.log('UserController.getUserList', 'UserController');
    return await this.authService.getList();
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async deleteUser(@Param('id') userId: string): Promise<SuccessResponse<void>> {
    Logger.log(`UserController.deleteUser: ${userId}`, 'UserController');
    return await this.authService.delete(userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async updateUser(
    @Param("id") userId: string,
    @Body(new ZodValidationPipe(UserUpdateReq)) dto: UserUpdateReq,
  ): Promise<SuccessResponse<UserUpdateRes>> {
    Logger.log(`UserController.updateUser: ${dto}`, 'UserController');
    return await this.authService.update(userId, dto);
  }
}
