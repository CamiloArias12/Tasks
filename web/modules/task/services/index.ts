import { apiSecureGet, apiSecurePost, apiSecurePut, apiSecureDelete } from '@/modules/common/services';
import { CommonServiceRes } from '@/modules/common/types';
import { TaskFormData } from '../../project/types';
import { Task } from '@/modules/task/types';

export async function createTaskService(
    createTask: TaskFormData
): Promise<CommonServiceRes<Task | null>> {
    try {
        const data = await apiSecurePost<Task>('/task', createTask);
        if (!data) {
            return { errors: [['No se ha registrado la tarea.']] };
        }
        return {
            data,
            messages: ['Tarea ha sido creada correctamente.'],
        };
    } catch (e) {
        const error = e as Error;
        return {
            errors: [[error.message]],
        };
    }
}

export async function updateTaskService(
    updateTask: TaskFormData & { id: string }
): Promise<CommonServiceRes<Task| null>> {
    try {
        const { id, ...taskData } = updateTask;
        const data = await apiSecurePut<Task>(`/task/${id}`, taskData);
        if (!data) {
            return { errors: [['No se ha actualizado la tarea.']] };
        }
        return {
            data,
            messages: ['Tarea ha sido actualizada correctamente.'],
        };
    } catch (e) {
        const error = e as Error;
        return {
            errors: [[error.message]],
        };
    }
}

export async function getTaskService(id: string): Promise<CommonServiceRes<Task | null>> {
    try {
        const data = await apiSecureGet<Task>(`/task/${id}`);
        if (!data) {
            return { errors: [['No se encuentra la tarea.']] };
        }
        return {
            data,
        };
    } catch (e) {
        const error = e as Error;
        return {
            errors: [[error.message]],
        };
    }
}

export async function deleteTaskService(id: string): Promise<CommonServiceRes<null>> {
    try {
        await apiSecureDelete(`/task/${id}`);
        return {
            data: null,
            messages: ['Tarea ha sido eliminada correctamente.'],
        };
    } catch (e) {
        const error = e as Error;
        return {
            errors: [[error.message]],
        };
    }
}

export interface GetTasksByProjectParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    userId?: string;
    dueDate?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
export type GetTaskResponse ={
    success: boolean;
    message: string;
    data:GetTasksByProjectResponse ;
}

export interface GetTasksByProjectResponse {
    tasks: Task[];
    page: number;
    totalPages: number;
    total: number;
    limit: number;
}

export async function getTasksByProjectService(
    projectId: string,
    params: GetTasksByProjectParams = {}
): Promise<CommonServiceRes<GetTasksByProjectResponse>> {
    try {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                queryParams.append(key, value.toString());
            }
        });

        const url = queryParams.toString()
            ? `/task/project/${projectId}?${queryParams.toString()}`
            : `/task/project/${projectId}`;

        const data = await apiSecureGet<GetTaskResponse>(url);

        if (!data) {
            return { errors: [['No se pudieron obtener las tareas del proyecto.']] };
        }

        return data;
    } catch (e) {
        const error = e as Error;
        return {
            errors: [[error.message]],
        };
    }
}