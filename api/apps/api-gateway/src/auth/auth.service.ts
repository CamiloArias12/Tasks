import { USER_PATTERN } from 'libs/user/user.pattern';
import { SERVICE_LIST } from 'libs/constants/service-list';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendEvent } from '../common/helper/send-event';
import { UserLoginReq, UserLoginRes } from 'libs/user/dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(SERVICE_LIST.USER_SERVICE)
    private readonly authClient: ClientProxy,
  ) {}

  async login(loginUserDto: UserLoginReq) {
    const res = await sendEvent<UserLoginRes, UserLoginReq>(
      this.authClient,
      USER_PATTERN.USER_LOGIN,
      loginUserDto,
      this.logger,
    );
    return res;
  }

}
