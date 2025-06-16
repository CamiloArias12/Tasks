import { z } from 'zod';

export const CommentCreateReq = z.object({
  description: z.string().min(1).max(255),
  userId: z.string().uuid(),
  taskId: z.string().uuid(),
});
export type CommentCreateReq = z.infer<typeof CommentCreateReq>;

export const CommentUpdateReq = z.object({
  description: z.string().min(1).max(255).optional(),
  id: z.string().uuid().optional(),
});
export type CommentUpdateReq = z.infer<typeof CommentUpdateReq>;

export type CommentCreateRes = {
  id: string;
};

export type CommentUpdateRes = {
  id: string;
};

export type CommentGetRes = {
  id: string;
  description: string;
  userId: string;
  taskId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CommentListRes = {
  comments: CommentGetRes[];
  total: number;
};