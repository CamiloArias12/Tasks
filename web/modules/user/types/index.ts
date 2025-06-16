import { UserRes } from '@/modules/dashboard/types';
import { z } from 'zod';

export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUser {
  id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
}

export const CreateUserReqValidator = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.string().min(1, 'El rol es obligatorio'),
});

export const UpdateUserReqValidator = z.object({
  id: z.string().min(1, 'El ID es obligatorio'),
  name: z.string().min(1, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido'),
  role: z.string().min(1, 'El rol es obligatorio'),
  password: z.string().optional(),
});

export const DeleteUserReqValidator = z.object({
  id: z.string().min(1, 'El ID es obligatorio'),
});

export type CreateUserReq = z.infer<typeof CreateUserReqValidator>;
export type UpdateUserReq = z.infer<typeof UpdateUserReqValidator>;
export type DeleteUserReq = z.infer<typeof DeleteUserReqValidator>;

export type GetUsersParams ={
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}

export type GetUsersResponse ={
    success: boolean;
    message: string;
    data: GetUsersData;
}
export type GetUsersData ={

        users: UserRes[];
        total: number;
        totalPages: number;
        page: number;
        limit: number;
}
