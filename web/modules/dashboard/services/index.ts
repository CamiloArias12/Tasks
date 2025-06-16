import {apiGet, apiSecureGet} from '@/modules/common/services';
import {UserRes as UserRes, UserResData} from '../types';
import {ApiResponse, CommonServiceRes} from '@/modules/common/types';


export async function getUserInfoByTokenService(): Promise<CommonServiceRes<UserRes | null>> {
  try {
    const res = await apiSecureGet<ApiResponse<UserRes>>('/user');
    if (!res) {
      return {
        errors: [['']],
      };
    }
    console.log('getUserInfoByTokenService', res);
    return {
      data: res?.data
    };
  } catch (e) {
    const error = e as Error;
    return {
      errors: [[error.message]],
    };
  }
}

export async function getAllUsersService(): Promise<CommonServiceRes<UserRes[]>> {
  try {
    const res = await apiSecureGet<ApiResponse<UserRes[]>>('/user/list');
    if (!res) {
      return {
        errors: [['']],
      };
    }
    return {
      data: res.data,
    };
  } catch (e) {
    const error = e as Error;
    return {
      errors: [[error.message]],
    };
  }
}
