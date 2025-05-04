import { TextareaHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import clsx from "clsx";

type Props = {
  label: string;
  register: UseFormRegisterReturn;
  value?: string;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextareaField({
  label,
  register,
  className,
  ...props
}: Props) {
  const isFloating = props.value && props.value.length > 0;
  return (
    <div className="relative w-full">
      <textarea
        {...register}
        {...props}
        placeholder=" "
        className={clsx(
          "peer block w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 pt-5 pb-2 text-sm text-text shadow-sm focus:border-title focus:outline-none focus:ring-1 focus:ring-primary-2 resize-none",
          className
        )}
      />
      <label
        className={clsx(
          "pointer-events-none absolute left-4 text-base text-gray-500 transition-all bg-white px-1",
          isFloating ? "-top-2 text-title" : "top-3.5",
          "peer-focus:-top-2 peer-focus:text-title"
        )}
      >
        {label}
      </label>
    </div>
  );
}
