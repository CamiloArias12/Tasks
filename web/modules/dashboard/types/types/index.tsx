import {ReactNode} from 'react';
import {FiFile, FiHelpCircle, FiHome, FiMeh, FiSettings} from 'react-icons/fi';

export enum ROUTES_CONFIG {
  ACTIVATE_ACCOUNT = '/activate-account',
}
export enum ROUTES_SIDEBAR {
  DASHBOARD = '/dashboard',
  SETTINGS = '/dashboard/settings/general-details',
  FILES = '/dashboard/files',
  ASESOR = '/dashboard/user',
  HELP = '/dashboard/help',
}
export type route = {
  route: string;
  name: string;
  icon: ReactNode;
};

export const routesSidebarUp = [
  {
    route: ROUTES_SIDEBAR.DASHBOARD,
    name: 'Inicio',
    icon: <FiHome />,
  },
  {
    route: ROUTES_SIDEBAR.ASESOR,
    name: 'User',
    icon: <FiMeh />,
  },
  {
    route: ROUTES_SIDEBAR.FILES,
    name: 'Archivos',
    icon: <FiFile />,
  },
];

export const routesSidebarDown = [
  {
    route: ROUTES_SIDEBAR.SETTINGS,
    name: 'Configuracion',
    icon: <FiSettings />,
  },
  {
    route: ROUTES_SIDEBAR.HELP,
    name: 'Ayuda',
    icon: <FiHelpCircle />,
  },
];
