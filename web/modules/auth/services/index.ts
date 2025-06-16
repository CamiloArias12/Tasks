import {apiGet, apiPost} from '@/modules/common/services';
import {CommonServiceRes} from '@/modules/common/types';
import {
  ChangePasswordReq,
  ChangePasswordRes,
  LoginReq,
  LoginRes,
  RegisterReq,
  RegisterRes,
} from '../types/services';
import {signIn} from '@/auth';

export async function resetPasswordService(req: any): Promise<CommonServiceRes<boolean>> {
  try {
    const res = await apiPost('/client/reset-password', req);
    if (!res) {
      return {
        errors: [
          [
            'No es posible enviar correo electrónico con instrucciones para restablecer su contraseña',
          ],
        ],
      };
    }
    return {
      data: !!res,
      messages: [
        'Hemos enviado un correo electrónico con instrucciones para restablecer su contraseña',
      ],
    };
  } catch (e) {
    const error = e as Error;
    return {errors: [[error.message]]};
  }
}

export async function loginService(req: LoginReq): Promise<CommonServiceRes<LoginRes>> {
  try {
    const res = await apiPost<RegisterRes>('/login', req);
    console.log('loginService', res);
    return {
      data: {
        //@ts-ignore
        token: res?.data?.token || '',
      },
      messages: ['inicio de sesión exitosamente'],
    };
  } catch (e) {
    const error = e as Error;
    return {errors: [[error.message]]};
  }
}

export async function registerService(req: RegisterReq): Promise<CommonServiceRes<RegisterRes>> {
  try {
    const data = await apiPost<RegisterRes>('/client', {
      ...req,
      role: parseInt(req.role),
    });

    if (!data?.token) return {errors: [['El usuario no ha sido registrado.']]};

    const resData = await signIn('credentials', {
      redirect: false,
      email: req.email,
      password: req.password,
    });

    return {
      data: resData,
      messages: ['El usuario ha sido registrado exitosamente.'],
    };
  } catch (e) {
    const error = e as Error;
    return {errors: [[error.message]]};
  }
}

