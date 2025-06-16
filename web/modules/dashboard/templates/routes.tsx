'use client';
import { UserRes, routesSidebarUp } from '../types';
import { RoutesSidebar } from '../components/routes-sidebar';

type SideBarRoutesProps = {
    clientInfo: UserRes;
};

export function Routes(props: SideBarRoutesProps) {
    return (
        <div className="h-full flex flex-col pb-16 pt-10 md:pt-14 justify-between">
            <div className="md:flex md:flex-col md:flex-grow md:justify-between">
                <RoutesSidebar
                    rol={props.clientInfo.role}
                    routes={routesSidebarUp}
                />
            </div>
        </div>
    );
}
