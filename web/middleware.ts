import NextAuth from 'next-auth';
import {authConfig} from './auth.config';
import {ROUTES_AUTH} from './modules/auth/types/auth';
import {ROUTES_CONFIG, ROUTES_SIDEBAR} from './modules/dashboard/types';
import {NextResponse} from 'next/server';
import {getUserInfoByTokenService} from './modules/dashboard/services';
import { clientState } from './modules/auth/context/client';

const publicRoutes = new Set<string>([
  ROUTES_AUTH.LOGIN,
  ROUTES_AUTH.PRINCIPAL,
  

]);

const secureRoutes = new Set<string>([
  ROUTES_SIDEBAR.DASHBOARD,
]);
export default NextAuth(authConfig).auth(async req => {
  const isLoggedIn = !!req.auth?.user;
  const {pathname} = req.nextUrl;

  if(pathname.includes("/dashboard/users") && !isLoggedIn) {
    return NextResponse.redirect(new URL(ROUTES_SIDEBAR.DASHBOARD, req.nextUrl));
  }

  if (!isLoggedIn && secureRoutes.has(pathname)) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }
  const client = (await getUserInfoByTokenService()).data;
  if(pathname.includes("/dashboard/users") && isLoggedIn && client?.role !== 'admin') {
    return NextResponse.redirect(new URL(ROUTES_SIDEBAR.DASHBOARD, req.nextUrl));

  }
  if (isLoggedIn && publicRoutes.has(pathname)) {
    return NextResponse.redirect(new URL(ROUTES_SIDEBAR.DASHBOARD, req.nextUrl));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
