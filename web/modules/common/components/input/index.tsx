import {Input as InputText, InputProps} from '@heroui/input';
import * as React from 'react';

export function Input({label, className, type, defaultValue, ...props}: InputProps) {
  return (
    <InputText
      className={className}
      label={label}
      labelPosition='start'
      color="default"
      type={type}
      radius="sm"
      variant="bordered"
      defaultValue={defaultValue}
      {...props}
    />
  );
}
