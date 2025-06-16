import { z } from 'zod';
export const TaskStatus = z.enum(['todo', 'in_progress', 'completed']);
export type TaskStatus = z.infer<typeof TaskStatus>;

export const TaskCreateReq = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(1000),
  dueDate: z.string().datetime(),
  status: TaskStatus.default('todo'),
  users: z.string().array(),
  projectId: z.string(),
});
export type TaskCreateReq = z.infer<typeof TaskCreateReq>;

export const TaskUpdateReq = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(1000).optional(),
  dueDate: z.string().datetime().optional(),
  status: TaskStatus.optional(),
  users: z.string().array(),
});
export type TaskUpdateReq = z.infer<typeof TaskUpdateReq>;

export type TaskCreateRes = {
  id: string;
};

export type TaskUpdateRes = {
  id: string;
};

export type TaskGetRes = {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
  users: string[];
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskListRes = {
  tasks: TaskGetRes[];
  total: number;
};

export const TaskFilterReq = z.object({
  projectId: z.string().optional(),
  status: TaskStatus.optional(),
  users: z.string().optional(),
  teamId: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});
export type TaskFilterReq = z.infer<typeof TaskFilterReq>;