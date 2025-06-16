export type Auth = {
  email: string;
  password: string;
};

export enum ROUTES_AUTH {
  LOGIN = '/login',
  SIGN_UP = '/sign-up',
  PRINCIPAL = '/principal',
  DASHBOARD = '/dashboard',
  RESET_PASSWORD = '/reset-password',
  STEP1 = '/sign-up/step-one',
  STEP2 = '/sign-up/step-two',
  STEP3 = '/sign-up/step-three',
}
