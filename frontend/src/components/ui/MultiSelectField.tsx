import { ChevronDown } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/cn";
import type { SelectFieldOption } from "./SelectField";

export type { SelectFieldOption as MultiSelectFieldOption } from "./SelectField";

export type MultiSelectFieldProps = {
  id?: string;
  className?: string;
  label: string;
  options: SelectFieldOption[];
  /** Selected option values (controlled) */
  value: string[];
  onChange: (values: string[]) => void;
  /** Shown in the trigger when nothing is selected */
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  /** Cap how many options can be selected */
  maxSelections?: number;
  /** Shows required asterisk on label (validation still via schema / form) */
  required?: boolean;
};

const triggerBase =
  "flex h-12 w-full items-center justify-between gap-2 rounded-[10px] border border-grocery-200 bg-white px-3 text-left text-sm text-grocery-900 outline-none transition focus:border-grocery-500 focus:ring-2 focus:ring-grocery-200 disabled:cursor-not-allowed disabled:bg-grocery-50 disabled:text-grocery-400";

export const MultiSelectField = forwardRef<HTMLButtonElement, MultiSelectFieldProps>(
  function MultiSelectField(
    {
      id,
      className,
      label,
      options,
      value,
      onChange,
      placeholder = "Select…",
      error,
      disabled,
      maxSelections,
      required,
    },
    ref
  ) {
    const autoId = useId();
    const listId = `${autoId}-list`;
    const fieldId = id ?? autoId;
    const containerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    const summary = (() => {
      const labels = value
        .map((v) => options.find((o) => o.value === v)?.label)
        .filter(Boolean);
      if (labels.length === 0) return placeholder;
      return labels.join(", ");
    })();

    const toggle = useCallback(
      (optionValue: string, optionDisabled?: boolean) => {
        if (disabled || optionDisabled) return;
        const next = new Set(value);
        if (next.has(optionValue)) {
          next.delete(optionValue);
        } else {
          if (maxSelections != null && next.size >= maxSelections) return;
          next.add(optionValue);
        }
        onChange(Array.from(next));
      },
      [disabled, maxSelections, onChange, value]
    );

    useEffect(() => {
      if (!open) return;
      function onPointerDown(ev: PointerEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(ev.target as Node)
        ) {
          setOpen(false);
        }
      }
      function onKey(ev: KeyboardEvent) {
        if (ev.key === "Escape") setOpen(false);
      }
      document.addEventListener("pointerdown", onPointerDown);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("pointerdown", onPointerDown);
        document.removeEventListener("keydown", onKey);
      };
    }, [open]);

    return (
      <div ref={containerRef} className={cn("relative w-full space-y-1", className)}>
        <span className="block text-sm font-medium text-grocery-900" id={`${fieldId}-label`}>
          {label}
          {required ? (
            <span className="text-red-600" aria-hidden>
              {" "}
              *
            </span>
          ) : null}
        </span>

        <button
          ref={ref}
          id={fieldId}
          type="button"
          disabled={disabled}
          aria-expanded={open}
          aria-controls={listId}
          aria-haspopup="listbox"
          aria-labelledby={`${fieldId}-label`}
          aria-invalid={Boolean(error)}
          onClick={() => !disabled && setOpen((o) => !o)}
          className={cn(
            triggerBase,
            error && "border-red-400 focus:border-red-500 focus:ring-red-200"
          )}
        >
          <span className="min-w-0 flex-1 truncate text-left">{summary}</span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-grocery-400 transition",
              open && "rotate-180"
            )}
            aria-hidden
            strokeWidth={2}
          />
        </button>

        {open && !disabled ? (
          <div
            id={listId}
            role="listbox"
            aria-multiselectable
            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-auto rounded-[10px] border border-grocery-200 bg-white py-1 shadow-lg"
          >
            {options.map((opt) => {
              const checked = value.includes(opt.value);
              const atCap =
                maxSelections != null &&
                !checked &&
                value.length >= maxSelections;
              const rowDisabled = Boolean(opt.disabled || atCap);
              return (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-grocery-50",
                    rowDisabled && "cursor-not-allowed opacity-50 hover:bg-transparent"
                  )}
                >
                  <input
                    type="checkbox"
                    className="size-4 rounded border-grocery-300 text-grocery-900 focus:ring-grocery-200"
                    checked={checked}
                    disabled={rowDisabled}
                    onChange={() => toggle(opt.value, opt.disabled)}
                  />
                  <span className="text-grocery-900">{opt.label}</span>
                </label>
              );
            })}
          </div>
        ) : null}

        {error ? <p className="text-xs text-red-600">{error}</p> : null}
      </div>
    );
  }
);
