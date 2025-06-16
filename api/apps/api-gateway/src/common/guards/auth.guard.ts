import { USER_PATTERN } from 'libs/user/user.pattern';
import { SERVICE_LIST } from 'libs/constants/service-list';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendEvent } from '../helper/send-event';
import { TValidateTokenResponse, ValidateTokenDto } from 'libs/user/dto';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    @Inject(SERVICE_LIST.USER_SERVICE)
    private readonly authClient: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Userorization token not found.');
    }

    const validateRes = await sendEvent<
      TValidateTokenResponse,
      ValidateTokenDto
    >(
      this.authClient,
      USER_PATTERN.USER_VALIDATE_TOKEN,
      { token },
      this.logger,
    );

    const { data: userPayload } = validateRes;
    if (!userPayload || !userPayload.user || !userPayload.isValid) {
      throw new UnauthorizedException({
        message: "Invalid token",
        code: "401",
      });
    }


    request.user = userPayload.user;
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}