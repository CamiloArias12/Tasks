import { USER_PATTERN } from 'libs/user/user.pattern';
import { SERVICE_LIST } from 'libs/constants/service-list';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendEvent } from '../common/helper/send-event';
import { UserCreateReq, UserCreateRes, UserGetRes, UserLoginReq, UserUpdateReq, UserUpdateRes } from 'libs/user/dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(SERVICE_LIST.USER_SERVICE)
    private readonly userClient: ClientProxy,
  ) { }

  async create(loginUserDto: UserLoginReq) {
    const res = await sendEvent<UserCreateRes, UserCreateReq>(
      this.userClient,
      USER_PATTERN.USER_CREATE,
      loginUserDto,
      this.logger,
    );
    return res;
  }
  async get(userId: string) {
    const res = await sendEvent<UserGetRes, string>(
      this.userClient,
      USER_PATTERN.USER_GET,
      userId,
      this.logger,
    );
    return res;
  }

  async getList() {
    const res = await sendEvent<UserGetRes[], any>(
      this.userClient,
      USER_PATTERN.USER_GET_LIST,
      {},
      this.logger,
    );
    return res;
  }

  async getAll(filters?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) {
    const res = await sendEvent<{
      users: UserGetRes[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }, any>(
      this.userClient,
      USER_PATTERN.USER_GET_ALL,
      filters || {},
      this.logger,
    );
    return res;
  }

  async update(id: string, dto: UserUpdateReq) {
    const res = await sendEvent<UserUpdateRes, UserUpdateReq>(
      this.userClient,
      USER_PATTERN.USER_UPDATE,
      { id, ...dto },
      this.logger,
    );
    return res;
  }
  async delete(userId: string) {
    const res = await sendEvent<any, string>(
      this.userClient,
      USER_PATTERN.USER_DELETE,
      userId,
      this.logger,
    );
    return res;
  }

}
