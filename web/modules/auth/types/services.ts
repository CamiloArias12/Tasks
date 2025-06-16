import {z} from 'zod';
import {REGISTER_ROLE} from './enum';

export type LoginReq = {
  email: string;
  password: string;
};
export type LoginRes = {
  token?: string;
};

export const RegisterValidator = z.object({
  givenName: z.string(),
  surname: z.string(),
  email: z.string().email(),
  password: z.string().min(6).max(10),
  role: z.nativeEnum(REGISTER_ROLE),
});
export type RegisterReq = {
  givenName: string;
  surname: string;
  email: string;
  password: string;
  role: REGISTER_ROLE;
};
export type RegisterRes = {
  token: string;
};

export const ChangePasswordValidator = z.object({
  token: z.string(),
  password: z.string().min(6).max(10),
  passwordReply: z.string().min(6).max(10),
});
export type ChangePasswordReq = {
  token: string;
  password: string;
  passwordReply: string;
};
export type ChangePasswordRes = boolean;

export type ValidateTokenPasswordResetReq = {
  token: string;
};
export type ValidateTokenPasswordResetRes = boolean;

export const ResetPasswordValidator = z.object({
  email: z.string().email(),
});
