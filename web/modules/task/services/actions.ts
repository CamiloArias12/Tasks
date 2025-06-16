'use server';

import { CommonActionState } from '@/modules/common/types/action';
import { createTaskService, deleteTaskService, updateTaskService } from '.';
import { CreateTaskReqValidator, DeleteTaskReqValidator, UpdateTaskReqValidator } from '../types';
import { BaseFormActionService } from '@/modules/common/services/action';

export async function createTaskForm(
  state: CommonActionState,
  payload: FormData
): Promise<CommonActionState> {
  
  return await BaseFormActionService(state, payload, CreateTaskReqValidator, createTaskService);
}

export async function updateTaskForm(
  state: CommonActionState,
  payload: FormData
): Promise<CommonActionState> {
  
  return await BaseFormActionService(state, payload, UpdateTaskReqValidator, updateTaskService);
}

export async function deleteTaskForm(
  state: CommonActionState,
  payload: FormData
): Promise<CommonActionState> {
  return await BaseFormActionService(state, payload, DeleteTaskReqValidator, deleteTaskService);
}

