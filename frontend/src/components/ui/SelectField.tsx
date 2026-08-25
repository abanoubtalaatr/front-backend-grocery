import { ChevronDown } from "lucide-react";
import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type SelectFieldOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectFieldProps = {
  id?: string;
  className?: string;
  selectClassName?: string;
  label: string;
  options: SelectFieldOption[];
  /** Shown as the first option when no value is chosen yet */
  placeholder?: string;
  error?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">;

const selectBase =
  "h-12 w-full appearance-none rounded-[10px] border border-grocery-200 bg-white pl-3 pr-10 text-sm text-grocery-900 outline-none transition focus:border-grocery-500 focus:ring-2 focus:ring-grocery-200 disabled:cursor-not-allowed disabled:bg-grocery-50 disabled:text-grocery-400";

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    {
      id,
      className,
      selectClassName,
      label,
      options,
      placeholder,
      error,
      required,
      ...rest
    },
    ref
  ) {
    const autoId = useId();
    const fieldId = id ?? autoId;

    return (
      <div className={cn("w-full space-y-1", className)}>
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-grocery-900"
        >
          {label}
          {required ? (
            <span className="text-red-600" aria-hidden>
              {" "}
              *
            </span>
          ) : null}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={fieldId}
            required={required}
            aria-invalid={Boolean(error)}
            aria-required={required}
            className={cn(
              selectBase,
              error && "border-red-400 focus:border-red-500 focus:ring-red-200",
              selectClassName
            )}
            {...rest}
          >
            {placeholder !== undefined ? (
              <option value="">{placeholder}</option>
            ) : null}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-grocery-400"
            aria-hidden
            strokeWidth={2}
          />
        </div>
        {error ? <p className="text-xs text-red-600">{error}</p> : null}
      </div>
    );
  }
);
