import {NextAuthConfig} from 'next-auth';
import {ROUTES_AUTH} from './modules/auth/types/auth';
import {ROUTES_SIDEBAR} from './modules/dashboard/types';

const isProd = process.env.ENV === 'prod';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: ROUTES_AUTH.LOGIN,
    newUser: ROUTES_AUTH.SIGN_UP,
  },
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.token = user.token;
      }
      return token;
    },
    async session({session, token}) {
      session.user.token = token.token as string;
      return session;
    },
    async redirect() {
      return ROUTES_SIDEBAR.DASHBOARD;
    },
  },
  debug: process.env.NODE_ENV !== 'production',
  basePath: ROUTES_SIDEBAR.DASHBOARD,
  providers: [],
  trustHost: isProd ? true : undefined,
} satisfies NextAuthConfig;
