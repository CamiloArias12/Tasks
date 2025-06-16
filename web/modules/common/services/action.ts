import {z} from 'zod';
import {CommonActionState} from '../types/action';

function formDataToObject(formData: FormData) {
  // Converts FormData to a plain object.
  // If there are multiple values for the same key in FormData, they are collected into an array.
  const entries: Record<string, any> = {};

  formData.forEach((v: any, k: string) => {
    if (!entries[k]) {
      entries[k] = v;
      return;
    }

    if (!Array.isArray(entries[k])) {
      entries[k] = [entries[k]];
    }
    entries[k].push(v);
  });

  return entries;
}

function processSpecialArrayFields(formData: FormData) {
  const data: Record<string, any> = {};
  const arrays: Record<string, string[]> = {};
  
  formData.forEach((value, key) => {
    const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);
    
    if (arrayMatch) {
      const [, fieldName, index] = arrayMatch;
      
      if (!arrays[fieldName]) {
        arrays[fieldName] = [];
      }
      
      arrays[fieldName].push(value as string);
    } else {
      if (!data[key]) {
        data[key] = value;
      } else {
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(value);
      }
    }
  });
  
  Object.entries(arrays).forEach(([fieldName, arrayValues]) => {
    if (arrayValues.length > 0) {
      data[fieldName] = arrayValues;
    }
  });
  
  return data;
}

export async function BaseFormActionService(
  state: CommonActionState,
  payload: FormData | Record<string, any>,
  validator: z.ZodObject<any>,
  service: (req: any) => null | any
): Promise<CommonActionState> {
  
  let objectData: Record<string, any>;
  
  if (payload instanceof FormData) {
    const hasSpecialArrays = Array.from(payload.keys()).some(key => 
      /^.+\[\d+\]$/.test(key)
    );
    
    if (hasSpecialArrays) {
      objectData = processSpecialArrayFields(payload);
    } else {
      objectData = formDataToObject(payload);
    }
  } else {
    objectData = payload;
  }

  const validateFields = validator.safeParse(objectData);

  if (validateFields.error) {
    return {
      errors: Object.entries(validateFields.error.flatten().fieldErrors).map(e => e[1]),
    };
  }

  return await service(validateFields.data);
}
