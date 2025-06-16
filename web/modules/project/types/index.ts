import { version } from 'os';
import { z } from 'zod';
export enum ROUTES_ASESOR {
    REGISTER_ASESOR = '/register-user',
}
export type User = {
    id: number;
    about?: string;
};

export type CreateUser = {
    name: string;
    email: string;
    password: string;
};

export type CreateAllFormatReq = {
    id: number;
}

export type CreateAllFormatRes = boolean;

export type UpdateAseorReq = {
    about?: string;
};
export type Format = {
    name: string
    description: string
    extension: string
    version: string
    directoryId: number
    serviceId: number
    file: File
};

export const CreateUserReqValidator = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
});

export const CreateFormatReqValidator = z.object({
    name: z.string(),
    description: z.string(),
    extension: z.string(),
    version: z.string(),
    directoryId: z.number({ coerce: true }),
    serviceId: z.number({ coerce: true }),
    file: z.any()
});

export const CreateAllFormatReqValidator = z.object({
    id: z.number({ coerce: true })
});

export type CreateFormatReq = {
    name: string,
    description: string
    extension: string
    version: string
    directoryId: number
    serviceId: number
    file: any
}

export type Project ={
  id?: string;
  name: string;
  duration: number;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ProjectData = {
  projects: Project[];
  total: number;
}


export type ProjectFormData = {
  id?: string;
  name: string;
  duration: number;
  startDate: string;
  endDate: string;
}

export type TaskFormData = {
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  projectId: string;
  assignedTo?: string;
}

// Validadores existentes para proyecto
export const CreateProjectReqValidator = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  duration: z.preprocess(
    (val) => val ? parseInt(val as string) : undefined,
    z.number().min(1, 'La duración debe ser mayor a 0')
  ),
  startDate: z.string().min(1, 'La fecha de inicio es obligatoria'),
  endDate: z.string().min(1, 'La fecha de fin es obligatoria'),
});

export const UpdateProjectReqValidator = z.object({
  id: z.string().min(1, 'El ID es obligatorio'),
  name: z.string().min(1, 'El nombre es obligatorio'),
  duration: z.preprocess(
    (val) => val ? parseInt(val as string) : undefined,
    z.number().min(1, 'La duración debe ser mayor a 0')
  ),
  startDate: z.string().min(1, 'La fecha de inicio es obligatoria'),
  endDate: z.string().min(1, 'La fecha de fin es obligatoria'),
});

export const DeleteProjectReqValidator = z.object({
  id: z.string().min(1, 'El ID es obligatorio'),
});


// Nuevos validadores para tareas
export const CreateTaskReqValidator = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
  projectId: z.string().min(1, 'El ID del proyecto es obligatorio'),
  assignedTo: z.string().optional(),
});

export const UpdateTaskReqValidator = z.object({
  id: z.string().min(1, 'El ID es obligatorio'),
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
  projectId: z.string().min(1, 'El ID del proyecto es obligatorio'),
  assignedTo: z.string().optional(),
});

export type CreateProjectReq = z.infer<typeof CreateProjectReqValidator>;
export type UpdateProjectReq = z.infer<typeof UpdateProjectReqValidator>;
export type CreateTaskReq = z.infer<typeof CreateTaskReqValidator>;
export type UpdateTaskReq = z.infer<typeof UpdateTaskReqValidator>;
