import { apiSecureGet, apiSecurePost, apiSecurePut, apiSecureDelete } from '@/modules/common/services';
import { User, CreateUser, UpdateUser, GetUsersParams, GetUsersResponse, GetUsersData } from '../types';
import { CommonServiceRes } from '@/modules/common/types';
import { UserRes } from '@/modules/dashboard/types';

export async function createUserService(
    createUser: CreateUser
): Promise<CommonServiceRes<User | null>> {
    try {
        const data = await apiSecurePost<User>('/user', createUser);
        if (!data) {
            return { errors: [['No se ha registrado los datos.']] };
        }
        return {
            data,
            messages: ['Usuario ha sido creado correctamente.'],
        };
    } catch (e) {
        const error = e as Error;
        return {
            errors: [[error.message]],
        };
    }
}

export async function updateUserService(
    updateUser: UpdateUser
): Promise<CommonServiceRes<User | null>> {
    try {
        const { id, ...userData } = updateUser;
        console.log('updateUserService', updateUser);
        if(updateUser.password=== '') {
            delete userData.password;   
        }
        const data = await apiSecurePut<User>(`/user/${id}`, userData);
        if (!data) {
            return { errors: [['No se ha actualizado el usuario.']] };
        }
        return {
            data,
            messages: ['Usuario ha sido actualizado correctamente.'],
        };
    } catch (e) {
        const error = e as Error;
        return {
            errors: [[error.message]],
        };
    }
}

export async function getUserService(id: string): Promise<CommonServiceRes<User | null>> {
    try {
        const data = await apiSecureGet<User>(`/user/${id}`);
        if (!data) {
            return { errors: [['No se encuentra el usuario.']] };
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

export async function deleteUserService(data: UserRes): Promise<CommonServiceRes<null>> {
    try {
        const res = await apiSecureDelete(`/user/${data.id}`);
        console.log('deleteUserService', res);
        return {
            data: null,
            messages: ['Usuario ha sido eliminado correctamente.'],
        };
    } catch (e) {
        console.error('Error deleting user:', e);
        const error = e as Error;
        return {
            errors: [[error.message]],
        };
    }
}

export async function getUsersService(params: GetUsersParams = {}): Promise<CommonServiceRes<GetUsersData>> {
    try {
        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                queryParams.append(key, value.toString());
            }
        });
        const url = queryParams.toString() ? `/user/all?${queryParams.toString()}` : '/users';
        const data = await apiSecureGet<GetUsersResponse>(url);
        console.log('getUsersService', data);
        if (!data) {
            return { errors: [['No se pudieron obtener los usuarios.']] };
        }
        return data;
    } catch (e) {
        const error = e as Error;
        return {
            errors: [[error.message]],
        };
    }
}

