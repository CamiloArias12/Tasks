import { USER_PATTERN } from 'libs/user/user.pattern';
import { EventResponseWrapperInterceptor } from '@libs/contracts/general/event-response-wrapper-interceptor';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { TValidateTokenResponse, UserCreateReq, UserCreateRes, UserGetRes, UserLoginReq, UserLoginRes, UserUpdateReq, UserUpdateRes, ValidateTokenDto } from 'libs/user/dto';
import { User } from '../database/entities';

@Controller()
export class UserController {
  constructor(private readonly useService: UserService) {}

  @MessagePattern(USER_PATTERN.USER_LOGIN)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async login(
    @Payload() loginUserDto: UserLoginReq,
  ): Promise<UserLoginRes> {
    return  await this.useService.login(loginUserDto);
  }

  @MessagePattern(USER_PATTERN.USER_VALIDATE_TOKEN)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async validateToken(
    @Payload() validateTokenDto: ValidateTokenDto,
  ): Promise<TValidateTokenResponse> {
    const jwtPayload = await this.useService.validateToken(validateTokenDto);
    return {
      isValid: !!jwtPayload,
      user: jwtPayload,
    };
  }

  @MessagePattern(USER_PATTERN.USER_CREATE)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async create(
    @Payload() dto:UserCreateReq
  ): Promise<UserCreateRes> {
    return await this.useService.create(dto);
  }

  @MessagePattern(USER_PATTERN.USER_GET)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async get(
    @Payload() userId: string,
  ): Promise<UserCreateRes> {
    return await this.useService.get(userId);
  }

  @MessagePattern(USER_PATTERN.USER_GET_ALL)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async getAll(@Payload() filters?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) {
    return await this.useService.getAll(filters);
  }

  @MessagePattern(USER_PATTERN.USER_GET_LIST)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async getList(): Promise<User[]> {
    return await this.useService.getList();
  }

  @MessagePattern(USER_PATTERN.USER_UPDATE)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async update(
    @Payload() dto: UserUpdateReq,
  ): Promise<UserUpdateRes> {
    return await this.useService.update(dto);
  }
  @MessagePattern(USER_PATTERN.USER_DELETE)
  @UseInterceptors(EventResponseWrapperInterceptor)
  async delete(
    @Payload() userId: string,
  ): Promise<boolean> {
    return await this.useService.delete(userId);
  }

}
