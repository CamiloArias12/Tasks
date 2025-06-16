'use client';

import Link from 'next/link';
import {ROUTES_SIDEBAR, Route} from '../../types';
import {ROLES} from '@/modules/auth/types/enum';
import {usePathname} from 'next/navigation';

type RoutesSidebarProps = {
  routes: Route[];
  rol: ROLES;
};

export function RoutesSidebar(props: RoutesSidebarProps) {
  const pathname = usePathname();

  const isActiveRoute = (routePath: string): boolean => {
    if (pathname === routePath) return true;

    const routePathSplit = routePath.split(ROUTES_SIDEBAR.DASHBOARD).join('');
    return Boolean(routePathSplit) && pathname.includes(routePathSplit);
  };

  return (
    <div className="flex flex-col gap-2">
      {props.routes.map((route, index) => (
        <div key={`route-${route.route}-${index}`}>
          {/* Check if the route is accessible based on the user's role */}
          {(route.role === 'all' || route.role === props.rol) && (
            <Link
              href={route.route}
              className={`flex p-[10px] flex-row gap-x-4 ${
                isActiveRoute(route.route) ? 'bg-gray-100' : ''
              } items-center rounded-md hover:bg-gray-50 transition-colors`}
            >
              {route.icon}
              <span className="text-sm">{route.name}</span>
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
