import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  private readonly logger = new Logger(CryptoService.name);
  private readonly saltRounds: number;

  constructor(private readonly configService: ConfigService) {
    this.saltRounds = Number(
      this.configService.get<string>('USER_PASSWORD_SALT'),
    );
    if (!this.saltRounds) {
      this.logger.error(
        'USER_PASSWORD_SALT is not defined in configuration. This is a critical security issue.',
      );
      throw new InternalServerErrorException(
        'Server configuration error regarding password security.',
      );
    }
  }

  async hashPassword(plaintextPassword: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      return await bcrypt.hash(plaintextPassword, salt);
    } catch (error) {
      this.logger.error('Error hashing password', error.stack);
      throw new InternalServerErrorException('Could not process password.');
    }
  }

  async comparePassword(
    plaintextPassword: string,
    storedHash: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(plaintextPassword, storedHash);
    } catch (error) {
      this.logger.error('Error comparing password', error.stack);
      return false;
    }
  }
}
