import { ImagePlus, X } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { cn } from "@/lib/cn";

export type ImageUploadProps = {
  label: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
  accept?: string;
  /** Max file size in bytes (e.g. 5 * 1024 * 1024 for 5MB) */
  maxSize?: number;
  /**
   * Controlled: current file. Use `null` when nothing selected.
   * For string fields (URL only), keep using a text field or map File → URL in the parent.
   */
  file?: File | null;
  /** Required for normal use; spreads from `register()` won’t work — use `Controller`. */
  onFileChange?: (file: File | null) => void;
  /** When editing, show an existing image from the server */
  existingImageUrl?: string | null;
};

/**
 * File picker + preview. For `react-hook-form`, use `Controller` and wire
 * `onFileChange` to `field.onChange` and `file` to `field.value` (as `File | null`).
 */
export const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(
  function ImageUpload(
    {
      label,
      error,
      hint,
      disabled,
      className,
      accept = "image/jpeg,image/png,image/webp,image/gif",
      maxSize,
      file = null,
      onFileChange: onFileChangeProp,
      existingImageUrl,
    },
    ref
  ) {
    const onFileChange = onFileChangeProp ?? (() => {});
    const inputRef = useRef<HTMLInputElement>(null);
    const id = useId();
    const inputId = `${id}-file`;
    const [preview, setPreview] = useState<string | null>(null);
    const [sizeError, setSizeError] = useState<string | null>(null);

    const setInputRef = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const revokeIfObjectUrl = useCallback((url: string | null) => {
      if (url?.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    }, []);

    useEffect(() => {
      if (file) {
        const url = URL.createObjectURL(file);
        setPreview((prev) => {
          revokeIfObjectUrl(prev);
          return url;
        });
        return () => {
          URL.revokeObjectURL(url);
        };
      }
      setPreview((prev) => {
        revokeIfObjectUrl(prev);
        return null;
      });
    }, [file, revokeIfObjectUrl]);

    const showImage = preview ?? existingImageUrl ?? null;
    const message = error ?? sizeError;

    const handlePick = () => {
      if (!disabled) inputRef.current?.click();
    };

    const onDropZoneKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handlePick();
      }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setSizeError(null);
      const picked = e.target.files?.[0] ?? null;
      e.target.value = "";
      if (!picked) {
        onFileChange(null);
        return;
      }
      if (maxSize && picked.size > maxSize) {
        setSizeError(
          `File is too large (max ${formatBytes(maxSize)}).`
        );
        onFileChange(null);
        return;
      }
      onFileChange(picked);
    };

    const handleClear = (e: MouseEvent) => {
      e.stopPropagation();
      setSizeError(null);
      onFileChange(null);
      if (inputRef.current) inputRef.current.value = "";
    };

    return (
      <div className={cn("space-y-2", className)}>
        <label htmlFor={inputId} className="block text-sm font-medium text-grocery-900">
          {label}
        </label>

        <input
          ref={setInputRef}
          id={inputId}
          type="file"
          accept={accept}
          className="sr-only"
          disabled={disabled}
          onChange={handleChange}
          aria-invalid={Boolean(message)}
          aria-describedby={hint ? `${id}-hint` : undefined}
        />

        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onClick={handlePick}
          onKeyDown={onDropZoneKeyDown}
          className={cn(
            "relative flex min-h-[140px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed transition outline-none focus-visible:ring-2 focus-visible:ring-grocery-200",
            message
              ? "border-red-300 bg-red-50/50"
              : "border-grocery-200 bg-grocery-50/80 hover:border-grocery-400 hover:bg-grocery-50",
            disabled && "pointer-events-none cursor-not-allowed opacity-50"
          )}
        >
          {showImage ? (
            <>
              <img
                src={showImage}
                alt=""
                className="max-h-28 max-w-[90%] rounded-lg object-contain"
              />
              <span className="text-xs text-grocery-600">
                {file?.name ?? "Current image"}
              </span>
              {!disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2 top-2 inline-flex rounded-full bg-white/90 p-1.5 shadow-sm ring-1 ring-grocery-200 hover:bg-white"
                  aria-label="Remove image"
                >
                  <X className="size-4 text-grocery-700" />
                </button>
              )}
            </>
          ) : (
            <>
              <ImagePlus className="size-10 text-grocery-500" strokeWidth={1.5} />
              <span className="text-sm text-grocery-600">Click to upload an image</span>
              <span className="text-xs text-grocery-500">PNG, JPG, WebP, GIF</span>
            </>
          )}
        </div>

        {hint && !message && (
          <p id={`${id}-hint`} className="text-xs text-grocery-500">
            {hint}
          </p>
        )}
        {message && <p className="text-xs text-red-600">{message}</p>}
      </div>
    );
  }
);

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
