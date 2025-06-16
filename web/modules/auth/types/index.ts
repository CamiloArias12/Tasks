export type Auth = {
  email: string;
  password: string;
};

declare module 'next-auth' {
  interface Session {
    user: {
      token: string;
    };
  }
  interface User {
    token: string;
  }
}
