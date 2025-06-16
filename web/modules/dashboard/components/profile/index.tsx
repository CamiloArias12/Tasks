"use client";
import { UserRes } from '../../types';
type ProfileProps = {
    clientInfo: UserRes;
};
export function Profile(props: ProfileProps) {
    const rol = props.clientInfo?.role;
    return (
        <div className=" flex flex-row gap-2 ">
            <img
                className="bg-white md:bg-gray-200 text-xs  text-black h-12 w-12 "
                src="https://cdn1.iconfinder.com/data/icons/pretty-office-part-8/256/user_yellow-512.png"
            />
            <div className=" flex flex-col justify-end ">
                <span className="text-sm">{`${props.clientInfo?.name}`}</span>
                <span className="text-gray-500 text-xs font-bold">
                    {rol === 'admin' ? 'Administrador' : 'Usuario'}
                </span>
            </div>
        </div>
    );
}
