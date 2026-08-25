import { useCallback, useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'

const LEN = 6

const cellClass =
  'text-grocery-900 border-grocery-200 focus:border-grocery-500 focus:ring-grocery-200 h-12 w-10 shrink-0 rounded-[10px] border bg-white text-center text-lg font-semibold tabular-nums outline-none transition focus:ring-2 sm:h-14 sm:w-12 sm:text-xl'

type OtpInputSixProps = {
  value: string[]
  onChange: (digits: string[]) => void
  disabled?: boolean
  className?: string
}

function normalizeDigits(value: string[]): string[] {
  return Array.from({ length: LEN }, (_, i) => (value[i] ?? '').replace(/\D/g, '').slice(0, 1))
}

export function OtpInputSix({
  value,
  onChange,
  disabled,
  className,
}: OtpInputSixProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const digits = normalizeDigits(value)

  const setDigits = useCallback(
    (next: string[]) => {
      onChange(normalizeDigits(next))
    },
    [onChange],
  )

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      refs.current[0]?.focus()
    })
    return () => cancelAnimationFrame(id)
  }, [])

  function focusAt(i: number) {
    const el = refs.current[i]
    if (el) {
      el.focus()
      el.select()
    }
  }

  function handleChange(i: number, raw: string) {
    const only = raw.replace(/\D/g, '')
    const next = [...digits]

    if (only.length > 1) {
      const spread = only.slice(0, LEN).split('')
      for (let j = 0; j < LEN; j++) {
        next[j] = spread[j] ?? ''
      }
      setDigits(next)
      focusAt(Math.min(only.length, LEN - 1))
      return
    }

    if (only) {
      next[i] = only
      setDigits(next)
      if (i < LEN - 1) {
        focusAt(i + 1)
      }
      return
    }

    next[i] = ''
    setDigits(next)
  }

  function handleKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (digits[i]) {
        return
      }
      e.preventDefault()
      if (i > 0) {
        const next = [...digits]
        next[i - 1] = ''
        setDigits(next)
        focusAt(i - 1)
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      e.preventDefault()
      focusAt(i - 1)
    } else if (e.key === 'ArrowRight' && i < LEN - 1) {
      e.preventDefault()
      focusAt(i + 1)
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LEN)
    if (!pasted) {
      return
    }
    const next = Array.from({ length: LEN }, (_, j) => pasted[j] ?? '')
    setDigits(next)
    focusAt(Math.min(pasted.length, LEN - 1))
  }

  return (
    <fieldset className={cn('w-full border-0 p-0', className)}>
      <legend className="text-grocery-500 sr-only">6-digit verification code</legend>
      <div className="flex justify-center gap-2 sm:gap-3" role="group" aria-label="Enter 6-digit code">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            disabled={disabled}
            value={d}
            aria-label={`Digit ${i + 1} of ${LEN}`}
            className={cellClass}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
    </fieldset>
  )
}
