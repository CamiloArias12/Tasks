'use server';

import { CommonActionState } from '@/modules/common/types/action';
import { createCommentService, updateCommentService, deleteCommentService, getCommentsByTaskService } from '.';
import { CreateCommentReqValidator, UpdateCommentReqValidator, DeleteCommentReqValidator } from '../types';
import { BaseFormActionService } from '@/modules/common/services/action';

export async function createCommentForm(
  state: CommonActionState,
  payload: FormData
): Promise<CommonActionState> {
  return await BaseFormActionService(state, payload, CreateCommentReqValidator, createCommentService);
}

export async function updateCommentForm(
  state: CommonActionState,
  payload: FormData
): Promise<CommonActionState> {
  return await BaseFormActionService(state, payload, UpdateCommentReqValidator, updateCommentService);
}

export async function deleteCommentForm(
  state: CommonActionState,
  payload: FormData
): Promise<CommonActionState> {
  return await BaseFormActionService(state, payload, DeleteCommentReqValidator, deleteCommentService);
}

export async function getCommentsByTaskAction(
  state: CommonActionState,
  payload: FormData
): Promise<CommonActionState> {
  const taskId = payload.get('taskId') as string;
  
  if (!taskId) {
    return {
      messages: [],
      errors: [['ID de tarea es requerido']],
    };
  }

  const result = await getCommentsByTaskService(taskId);
  console.log('getCommentsByTaskAction', result);

   return {
    ...state,
    data: result.data,
    messages: result.messages || [],
    errors: result.errors || [],
  };
}