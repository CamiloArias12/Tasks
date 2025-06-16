import { z } from 'zod';

export type Task ={
  id?: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  dueDate: string;
  projectId: string;
  users: string[];
  createdAt?: string;
  updatedAt?: string;
}

export type TaskFormData = {
  id?: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  dueDate: string;
  projectId: string;
  users: string[];
}

export const TaskStatus = z.enum(['todo', 'in_progress', 'completed']).default('todo');

export const CreateTaskReqValidator = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1).max(1000),
  dueDate: z.string().datetime(),
  status: TaskStatus.default('todo'),
  users: z.string().array(),
  projectId: z.string(),
});

export const UpdateTaskReqValidator = z.object({
  id: z.string().min(1, 'El ID es obligatorio'),
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).max(1000).optional(),
  dueDate: z.string().datetime().optional(),
  status: TaskStatus.optional(),
  users: z.string().array(),
});

export const DeleteTaskReqValidator = z.object({
  id: z.string().min(1, 'El ID es obligatorio'),
});
export type DeleteTaskReq = z.infer<typeof DeleteTaskReqValidator>;

export type CreateTaskReq = z.infer<typeof CreateTaskReqValidator>;
export type UpdateTaskReq = z.infer<typeof UpdateTaskReqValidator>;

export type TasksData = {
  tasks: Task[];
  total: number;
};