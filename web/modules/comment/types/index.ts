import { z } from 'zod';

export interface Comment {
  id?: string;
  taskId: string;
  userId: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommentData {
  comments: Comment[];
  total: number;
}

export interface CommentFormData {
  taskId: string;
  userId: string;
  description: string;
}

export const CreateCommentReqValidator = z.object({
  taskId: z.string().min(1, 'El ID de la tarea es obligatorio'),
  userId: z.string().min(1, 'El ID del usuario es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria').max(1000, 'Máximo 1000 caracteres'),
});

export const UpdateCommentReqValidator = z.object({
  id: z.string().min(1, 'El ID es obligatorio'),
  description: z.string().min(1, 'La descripción es obligatoria').max(1000, 'Máximo 1000 caracteres'),
});

export const DeleteCommentReqValidator = z.object({
  id: z.string().min(1, 'El ID es obligatorio'),
});

export type CreateCommentReq = z.infer<typeof CreateCommentReqValidator>;
export type UpdateCommentReq = z.infer<typeof UpdateCommentReqValidator>;
export type DeleteCommentReq = z.infer<typeof DeleteCommentReqValidator>;