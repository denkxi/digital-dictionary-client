import { SelectHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import clsx from "clsx";

type Props = {
  label: string;
  register: UseFormRegisterReturn;
  className?: string;
  children: React.ReactNode;
  value?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export default function SelectField({
  label,
  register,
  className,
  children,
  value,
  ...props
}: Props) {
  return (
    <div className="relative w-full">
      <select
        {...register}
        {...props}
        value={value}
        className={clsx(
          "peer block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 pt-5 pb-2 text-sm text-text shadow-sm focus:border-title focus:outline-none focus:ring-1 focus:ring-title",
          className
        )}
      >
        {children}
      </select>
      <label className="absolute left-4 -top-2 text-xs text-title bg-white px-1 pointer-events-none">
        {label}
      </label>

      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
        ▼
      </div>
    </div>
  );
}
