import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities';
import { UserService } from './user.service';
import { CryptoService } from './crypto.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('APP_JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string | number>('APP_JWT_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService, CryptoService],
})
export class UserModule {}
