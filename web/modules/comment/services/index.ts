import { apiSecureGet, apiSecurePost, apiSecurePut, apiSecureDelete } from '@/modules/common/services';
import { Comment, CommentData, CommentFormData } from '../types';
import { ApiResponse, CommonServiceRes } from '@/modules/common/types';

export async function createCommentService(
    createComment: CommentFormData
): Promise<CommonServiceRes<Comment | null>> {
    try {
        const data = await apiSecurePost<Comment>('/comment', createComment);
        if (!data) {
            return { errors: [['No se ha registrado el comentario.']] };
        }
        return {
            data,
            messages: ['Comentario ha sido creado correctamente.'],
        };
    } catch (e) {
        const error = e as Error;
        return {
            errors: [[error.message]],
        };
    }
}

export async function updateCommentService(
    updateComment: { id: string; description: string }
): Promise<CommonServiceRes<Comment | null>> {
    try {
        const { id, ...commentData } = updateComment;
        console.log('updateCommentService', updateComment);
        const data = await apiSecurePut<Comment>(`/comment/${id}`, commentData);
        if (!data) {
            return { errors: [['No se ha actualizado el comentario.']] };
        }
        return {
            data,
            messages: ['Comentario ha sido actualizado correctamente.'],
        };
    } catch (e) {
        const error = e as Error;
        return {
            errors: [[error.message]],
        };
    }
}

export async function getCommentService(id: string): Promise<CommonServiceRes<Comment | null>> {
    try {
        const data = await apiSecureGet<Comment>(`/comment/${id}`);
        if (!data) {
            return { errors: [['No se encuentra el comentario.']] };
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

export async function deleteCommentService(req:Comment): Promise<CommonServiceRes<null>> {
    try {
        await apiSecureDelete(`/comment/${req?.id}`);
        return {
            data: null,
            messages: ['Comentario ha sido eliminado correctamente.'],
        };
    } catch (e) {
        const error = e as Error;
        return {
            errors: [[error.message]],
        };
    }
}

export async function getCommentsByTaskService(taskId: string): Promise<CommonServiceRes<Comment[]>> {
    try {
        const res = await apiSecureGet<ApiResponse<CommentData>>(`/comment/task/${taskId}`);
        if (!res) {
            return { errors: [['No se encuentran comentarios.']] };
        }
        console.log('getCommentsByTaskServicesad', res);
        return {
            data: res.data.comments,
        };
    } catch (e) {
        const error = e as Error;
        return {
            errors: [[error.message]],
        };
    }
}