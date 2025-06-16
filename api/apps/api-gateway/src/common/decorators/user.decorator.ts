import { IJwtPayload } from 'libs/user/interfaces';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IJwtPayload | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
