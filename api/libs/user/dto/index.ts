import {z} from 'zod';
import { IJwtPayload } from '../interfaces';

export const UserLoginReq = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(255),
});
export type UserLoginReq = z.infer<typeof UserLoginReq>;

export const UserResponseDTO = z.object({
  token: z.string(),
});
export type UserResponseDTO = z.infer<typeof UserResponseDTO>;

export const UserCheckReq = z.object({
  token: z.string(),
});

export type UserLoginRes ={
  token: string;
  role: string;
  id: string;
}

export const UserCreateReq = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(255),
  role: z.enum(['admin', 'user']).default('user'),
});
export const UserUpdateReq = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(255).optional(),
  role: z.enum(['admin', 'user']).default('user'),
});

export type UserCreateReq = z.infer<typeof UserCreateReq>;
export type UserUpdateReq = z.infer<typeof UserUpdateReq>;

export type UserCreateRes = {
  id: string;
}
export type UserUpdateRes = {
  id: string;
};

export type TValidateTokenResponse = {
  isValid: boolean;
  user: IJwtPayload;
};

export const ValidateTokenDto = z.object({
  token: z.string(),
});
export type ValidateTokenDto = z.infer<typeof ValidateTokenDto>;

export type UserGetRes= {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

