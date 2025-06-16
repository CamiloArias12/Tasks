'use client';
import {useState, useEffect, useRef} from 'react';
import {Button} from '@/modules/common/components/button';
import {FiArrowLeft, FiInfo, FiMenu, FiPauseCircle} from 'react-icons/fi';
import {Routes} from './routes';
import {UserRes} from '../types';
import ClickOutside from '@/modules/common/components/click-outside';
type TopBarProps = {
  clientInfo: UserRes;
};
export function TopBar(props: TopBarProps) {
  const [isRoutesVisible, setIsRoutesVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const routesRef = useRef(null);

  const toggleRoutes = () => {
    setIsRoutesVisible(!isRoutesVisible);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (routesRef.current && event.target instanceof Node) {
        if (!(routesRef.current as HTMLElement).contains(event.target as Node)) {
          setIsRoutesVisible(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div className="flex h-20 flex-row p-5 md:bg-transparent bg-white items-center justify-between w-screen md:w-full gap-4">
        <img
          className="w-10 h-20 md:w-20 md:h-14 "
          src="https://inlaze.com/wp-content/uploads/2025/03/cropped-Logo-inlaze.png"
          alt="Profile"
        />
        <div className="w-6 h-6 md:hidden" /> 
      </div>
    );
  }

  return (
    <div className="flex h-20 flex-row p-5 md:bg-transparent bg-white items-center justify-between w-screen md:w-full gap-4">
      <img
        className="w-10 h-20 md:w-20 md:h-14 object-contain"
        src="https://inlaze.com/wp-content/uploads/2025/03/cropped-Logo-inlaze.png"
        alt="Profile"
      />
      <FiMenu 
        className="w-6 h-6 md:hidden cursor-pointer" 
        onClick={toggleRoutes} 
      />

      {isRoutesVisible && (
        <ClickOutside
          className="fixed top-0 shadow-md left-0 w-[280px] h-full bg-white z-50"
          onClick={toggleRoutes}
        >
          <div className="flex flex-col gap-4 h-full w-full py-8 px-2">
            <div
              className="flex flex-row items-center cursor-pointer gap-3 px-2 md:hidden"
              onClick={toggleRoutes}
            >
              <FiArrowLeft className="w-6 h-6 cursor-pointer" />
              <p className="text-sm">Atrás</p>
            </div>

            <Routes clientInfo={props.clientInfo} />
          </div>
        </ClickOutside>
      )}
    </div>
  );
}
