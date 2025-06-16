import { Body, Controller, Logger, Post, UsePipes } from '@nestjs/common';
import { Public } from '../common/decorators';
import { AuthService } from './auth.service';
import { SuccessResponse } from '@libs/contracts/general/dto';
import { UserLoginReq, UserLoginRes } from 'libs/user/dto';
import { ZodValidationPipe } from 'nestjs-zod';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('/login')
  @Public()
  @UsePipes(new ZodValidationPipe(UserLoginReq))
  async login(@Body() dto: UserLoginReq): Promise<SuccessResponse<UserLoginRes>> {
    const res = await this.authService.login(dto);
    return res;
  }
}
