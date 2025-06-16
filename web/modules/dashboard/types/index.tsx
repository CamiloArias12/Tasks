import {ROLES, STATUS_CLIENT} from '@/modules/auth/types/enum';
import {ReactNode} from 'react';
import { BiUser } from 'react-icons/bi';
import {FiBox, FiFile, FiHelpCircle, FiHome, FiMeh, FiSettings} from 'react-icons/fi';

export enum ROUTES_CONFIG {
  ACTIVATE_ACCOUNT = '/activate-account',
}
export enum ROUTES_SIDEBAR {
  DASHBOARD = '/dashboard',
  PROJECTS = '/dashboard/projects',
  USER = '/dashboard/users',
}
export type Route = {
  route: string;
  name: string;
  icon: ReactNode;
  role: ROLES | 'all';
};

export const routesSidebarUp: Route[] = [
  {
    route: ROUTES_SIDEBAR.DASHBOARD,
    name: 'Inicio',
    icon: <FiHome />,
    role: 'all',
  },
  {
    route: ROUTES_SIDEBAR.USER,
    name: 'Usuarios',
    icon: <BiUser />,
    role: ROLES.ADMIN,
  },
  {
    route: ROUTES_SIDEBAR.PROJECTS,
    name: 'Proyectos',
    icon: <BiUser />,
    role: "all",
  },

];


export type UserRes = {
  id: string;
  name: string;
  status: STATUS_CLIENT;
  email: string;
  role: ROLES;
};
export type UserResData = {
  users: UserRes[];
  total: number;
};


export type Role = {
  id: string;
  roleName: ROLES;
  description: string;
};
