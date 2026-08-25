import { cn } from "@/lib/cn";

function formatCount(n: number): string {
  return n.toLocaleString("en-GB");
}

type ProgressProps = {
  /** Progress percentage (0–100). Used when `current` / `max` are omitted. */
  value?: number;
  current?: number;
  max?: number;
  label?: string;
  unit?: string;
  /** Shown under the bar. Auto-derived from current/max when omitted. */
  helperText?: string;
  className?: string;
};

export function Progress({
  value,
  current,
  max,
  label,
  unit = "pts",
  helperText,
  className,
}: ProgressProps) {
  const hasRange = current !== undefined && max !== undefined && max > 0;
  const percent = hasRange
    ? Math.min(100, Math.max(0, (current / max) * 100))
    : Math.min(100, Math.max(0, value ?? 0));

  const resolvedHelper =
    helperText ??
    (hasRange && current < max
      ? `${formatCount(max - current)} points to go!`
      : undefined);

  const showHeader = Boolean(label || hasRange);

  return (
    <div className={cn("w-full space-y-2", className)}>
      {showHeader && (
        <div className="flex items-baseline justify-between gap-4">
          {label ? (
            <p className="text-sm font-bold text-grocery-900">{label}</p>
          ) : (
            <span />
          )}
          {hasRange && (
            <p className="shrink-0 text-sm text-grocery-600 tabular-nums">
              {formatCount(current)} / {formatCount(max)}{" "}
              <span className="text-grocery-500">{unit}</span>
            </p>
          )}
        </div>
      )}

      <div
        className="h-2 w-full overflow-hidden rounded-full bg-grocery-100"
        role="progressbar"
        aria-valuenow={hasRange ? current : percent}
        aria-valuemin={0}
        aria-valuemax={hasRange ? max : 100}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#e6f2f7] via-grocery-200 to-grocery-900 transition-[width] duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {resolvedHelper ? (
        <p className="text-xs text-grocery-300">{resolvedHelper}</p>
      ) : null}
    </div>
  );
}
