"use client"
import { useAtom } from 'jotai';
import { Profile } from '../components/profile';
import { UserRes } from '../types';
import { Routes } from './routes';
import { clientState } from '@/modules/auth/context/client';
import { useEffect } from 'react';

type SideBarProps = {
    clientInfo: UserRes;
};
export function SideBar(props: SideBarProps) {

    const [_, setClient] = useAtom(clientState);

    useEffect(() => {
        setClient(props.clientInfo)
    }, [props.clientInfo])

    return (
        <div className="hidden w-[300px] md:flex h-full flex-col pt-8 px-4">
            <Profile clientInfo={props.clientInfo} />
            <Routes clientInfo={props.clientInfo} />
        </div>
    );
}
