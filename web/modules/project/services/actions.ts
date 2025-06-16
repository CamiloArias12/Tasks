'use server';

import { CommonActionState } from '@/modules/common/types/action';
import { createProjectService, deleteProjectService, updateProjectService } from '.';
import { CreateProjectReqValidator, DeleteProjectReqValidator, UpdateProjectReqValidator } from '../types';
import { BaseFormActionService } from '@/modules/common/services/action';


export async function createProjectForm(
  state: CommonActionState,
  payload: FormData
): Promise<CommonActionState> {

  return await BaseFormActionService(state, payload, CreateProjectReqValidator, createProjectService);
}

export async function updateProjectForm(
  state: CommonActionState,
  payload: FormData
): Promise<CommonActionState> {

  return await BaseFormActionService(state, payload, UpdateProjectReqValidator, updateProjectService);
}

export async function deleteProjectForm(
  state: CommonActionState,
  payload: FormData
): Promise<CommonActionState> {
  return await BaseFormActionService(state, payload, DeleteProjectReqValidator, deleteProjectService);
}