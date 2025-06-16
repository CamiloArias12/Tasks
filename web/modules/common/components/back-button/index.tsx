import Link from 'next/link';
import {FiArrowLeftCircle} from 'react-icons/fi';

export type BackButtonProps = {
  href: string;
  title: string;
};

export function BackButton(props: BackButtonProps) {
  return (
    <Link href={props.href}>
      <div className="flex items-center gap-2">
        <FiArrowLeftCircle className="h-7 w-7" />
        <span>{props.title}</span>
      </div>
    </Link>
  );
}
