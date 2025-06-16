import {clx} from '@/utils/clx';
import {useRef, useEffect, ReactNode} from 'react';

export type ClickOutsideProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

export default function ClickOutside(props: ClickOutsideProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickListener);

    return () => {
      document.removeEventListener('mousedown', handleClickListener);
    };
  }, []);

  const handleClickListener = (event: any) => {
    let clickedInside: any;
    clickedInside = wrapperRef.current && wrapperRef.current.contains(event.target);

    if (clickedInside) return;
    else props.onClick && props.onClick();
  };

  return (
    <div ref={wrapperRef} className={clx('h-full w-full', props.className)}>
      {props.children}
    </div>
  );
}
