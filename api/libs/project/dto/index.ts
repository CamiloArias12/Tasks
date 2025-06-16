import { z } from 'zod';

export const ProjectCreateReq = z.object({
  name: z.string().min(1).max(255),
  duration: z.number().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});
export type ProjectCreateReq = z.infer<typeof ProjectCreateReq>;

export const ProjectUpdateReq = z.object({
  name: z.string().min(1).max(255).optional(),
  duration: z.number().min(1).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
export type ProjectUpdateReq = z.infer<typeof ProjectUpdateReq>;

export type ProjectCreateRes = {
  id: string;
};

export type ProjectUpdateRes = {
  id: string;
};

export type ProjectGetRes = {
  id: string;
  name: string;
  duration: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectListRes = {
  projects: ProjectGetRes[];
  total: number;
};