'use server';
import {signIn, signOut} from '@/auth';
import {AuthError} from 'next-auth';

export async function authenticate(state: string | undefined, payload: FormData) {
  try {
    await signIn('credentials', payload);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales invalidas.';
        default:
          return 'Error.';
      }
    }
    throw error;
  }
}


export async function signOutAction() {
  await signOut();
}
