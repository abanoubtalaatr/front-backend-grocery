/**
 * Relative time string via `Intl.RelativeTimeFormat` (no `date-fns` dependency).
 * Example (en): "3 days ago", "in 2 hours".
 */
export function formatDistanceToNow(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  const diffSec = Math.round((date.getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  const absSec = Math.abs(diffSec);
  const divisions: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  for (const { unit, seconds } of divisions) {
    if (absSec >= seconds || unit === "second") {
      const delta = Math.round(diffSec / seconds);
      return rtf.format(delta, unit);
    }
  }
  return rtf.format(0, "second");
}
