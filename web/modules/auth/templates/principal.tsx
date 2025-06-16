'use client';
import Link from 'next/link';
import {SignOut} from '../components/sign-out';
import {ROUTES_AUTH} from '../types/auth';

export type PrincipalProps = {
  clientInfo: any;
};

export default function Principal(props: PrincipalProps) {
  return (
    <section className="flex flex-col items-center justify-center h-screen w-full">
      <div className="flex flex-col justify-center p-10 rounded-3xl gap-3 border border-black h-60 w-64">
        <div className="flex flex-col">
          <h1 className="text-2xl">Todo</h1>
          <p>Bienvenido de nuevo</p>
        </div>
        {props.clientInfo ? (
          <>
            <div className="flex flex-col font-bold justify-center">
              <p>{props.clientInfo.name}</p>

            </div>
            <SignOut />
          </>
        ) : (
          <div className="flex justify-between">
            <Link
              className="bg-black text-white p-1 border border-black rounded-md hover:bg-white hover:text-black text-xs"
              href={ROUTES_AUTH.LOGIN}
            >
              Iniciar sesión
            </Link>
            <Link
              className="bg-white p-1 border border-black rounded-md text-black hover:bg-black hover:text-white text-xs"
              href={ROUTES_AUTH.SIGN_UP}
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
