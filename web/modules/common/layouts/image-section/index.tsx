'use client';

import {ReactNode} from 'react';
import {useWindowSize} from '../../hooks/use-window';

export type ImageSectionProps = {
  children: ReactNode;
  src: string;
};

export function ImageSection(props: ImageSectionProps) {
  const windowSize = useWindowSize();
  return (
    <>
      {windowSize.width > 640 ? (
        <div className="flex min-h-screen">
          <div className="w-full flex flex-col justify-center p-16">
            {/* TODO: Add logo component */}
            {props.children}
          </div>
          <img className="object-cover w-full" src={props.src} />
        </div>
      ) : (
        <div className="object-cover p-4" style={{backgroundImage: `url('${props.src}')`}}>
          {/* TODO: Add logo component */}
          <div className=" flex min-h-screen flex-col justify-center p-4 border rounded-2xl bg-white">
            {props.children}
          </div>
        </div>
      )}
    </>
  );
}
