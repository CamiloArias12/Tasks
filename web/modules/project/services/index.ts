import { apiSecureGet, apiSecurePost, apiSecurePut, apiSecureDelete } from '@/modules/common/services';
import { Project, ProjectData, ProjectFormData } from '../types';
import { ApiResponse, CommonServiceRes } from '@/modules/common/types';

export async function createProjectService(
    createProject: ProjectFormData
): Promise<CommonServiceRes<Project | null>> {
    console.log('createProjectService', createProject);
    try {
        const data = await apiSecurePost<Project>('/project', createProject);
        if (!data) {
            return { errors: [['No se ha registrado los datos.']] };
        }
        return {
            data,
            messages: ['Proyecto ha sido creado correctamente.'],
        };
    } catch (e) {
        const error = e as Error;
        return {
            errors: [[error.message]],
        };
    }
}

export async function updateProjectService(
    updateProject: ProjectFormData
): Promise<CommonServiceRes<Project | null>> {
    console.log('updateProjectService', updateProject);
    try {
        console.log('updateProjectService', updateProject);
        const data = await apiSecurePut<Project>(`/project/${updateProject.id}`, updateProject);
        if (!data) {
            return { errors: [['No se ha actualizado los datos.']] };
        }
        return {
            data,
            messages: ['Proyecto ha sido actualizado correctamente.'],
        };
    } catch (e) {
        console.log(e);
        const error = e as Error;
        return {
            errors: [[error.message]],
        };
    }
}

export async function getProjectService(id: string): Promise<CommonServiceRes<Project | null>> {
    try {
        const res = await apiSecureGet<ApiResponse<Project>>(`/project/${id}`);
        if (!res) {
            return { errors: [['No se encuentra el proyecto.']] };
        }
        return {data: res.data};
    } catch (e) {
        const error = e as Error;
        return {
            errors: [[error.message]],
        };
    }
}

export async function deleteProjectService(data:ProjectFormData): Promise<CommonServiceRes<null>> {
    try {
        await apiSecureDelete(`/project/${data.id}`);
        return {
            data: null,
            messages: ['Proyecto ha sido eliminado correctamente.'],
        };
    } catch (e) {
        const error = e as Error;
        return {
            errors: [[error.message]],
        };
    }
}

export async function getAllProjectsService(): Promise<CommonServiceRes<Project[]>> {
    try {
        const res = await apiSecureGet<ApiResponse<ProjectData>>('/project');
        if (!res) {
            return { errors: [['No se encuentran proyectos.']] };
        }
        return  {data:res.data.projects};
            
    } catch (e) {
        const error = e as Error;
        return {
            errors: [[error.message]],
        };
    }
}


