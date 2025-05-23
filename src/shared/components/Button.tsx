import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'tertiary';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export default function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const base =
    'px-4 py-2 text-sm font-semibold rounded-xl transition focus:outline-none cursor-pointer hover:scale-105';

  const variants: Record<Variant, string> = {
    primary: 'bg-primary-2/70 text-text hover:bg-primary-2',
    secondary: 'bg-yellow text-text hover:bg-yellow/80',
    tertiary: 'bg-orange text-text hover:bg-orange/80',
    danger: 'bg-red-100 text-red-700 hover:bg-red-200',
    ghost: 'bg-transparent text-text hover:bg-gray-100',
  };

  return (
    <button
      {...props}
      className={clsx(base, variants[variant], className)}
    />
  );
}
