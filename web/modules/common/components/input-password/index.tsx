import {InputProps} from '@heroui/input';
import * as React from 'react';
import {EyeSlashFilledIcon} from '../../icons/EyeSlashFilledIcon';
import {EyeFilledIcon} from '../../icons/EyeFilledIcon';
import {Input} from '../input';

export function InputPassword({label, className, ...props}: InputProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      className={className}
      label={label}
      endContent={
        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
          {isVisible ? (
            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? 'text' : 'password'}
      {...props}
    />
  );
}
