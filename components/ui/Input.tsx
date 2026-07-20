import type { InputHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  labelRight?: ReactNode;
  icon?: LucideIcon;
  rightElement?: ReactNode;
  helperText?: ReactNode;
  containerClassName?: string;
}

export default function Input({
  label,
  labelRight,
  icon: Icon,
  rightElement,
  helperText,
  containerClassName = "",
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {(label || labelRight) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label
              htmlFor={id}
              className="text-primary-dark flex items-center gap-1 text-sm font-semibold"
            >
              {label}
            </label>
          )}
          {labelRight && <div>{labelRight}</div>}
        </div>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
        )}
        <input
          id={id}
          className={`focus:border-primary-dark focus:ring-primary-dark/20 bg-background-light text-primary-dark w-full rounded-lg border border-slate-200 py-3 transition-all outline-none placeholder:text-slate-400 focus:ring-2 ${
            Icon ? "pl-10" : "pl-4"
          } ${rightElement ? "pr-12" : "pr-4"} ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {helperText && <div className="mt-0.5">{helperText}</div>}
    </div>
  );
}
