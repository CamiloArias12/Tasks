'use server';

import { CommonActionState } from '@/modules/common/types/action';
import { createUserService, updateUserService, deleteUserService } from '.';
import { CreateUserReqValidator, UpdateUserReqValidator, DeleteUserReqValidator } from '../types';
import { BaseFormActionService } from '@/modules/common/services/action';
import { getUserInfoByTokenService } from '@/modules/dashboard/services';

export async function createUserForm(
  state: CommonActionState,
  payload: FormData
): Promise<CommonActionState> {
  return await BaseFormActionService(state, payload, CreateUserReqValidator, createUserService);
}

export async function updateUserForm(
  state: CommonActionState,
  payload: FormData
): Promise<CommonActionState> {
  const clientInfo = await getUserInfoByTokenService();
  if (clientInfo.errors || !clientInfo.data) return clientInfo;

  return await BaseFormActionService(state, payload, UpdateUserReqValidator, updateUserService);
}

export async function deleteUserForm(
  state: CommonActionState,
  payload: FormData
): Promise<CommonActionState> {
  return await BaseFormActionService(state, payload, DeleteUserReqValidator, deleteUserService);
}