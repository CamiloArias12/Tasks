import { clx } from '@/utils/clx';
import { Button as ButtonNext, ButtonProps } from '@heroui/button';

export function Button({ className, title, type, children, ...props }: ButtonProps) {
  return (
    <ButtonNext
      radius="none"
      type={type}
      className={clx(className)}
      {...props}
    >
      {children}
    </ButtonNext>
  );
}
