import { useMemo, useRef, useState } from 'react'

type Point = {
  date: string
  revenue: number
  orders: number
}

type RevenueChartProps = {
  data: Point[]
  currency?: string
}

/** Chart is drawn in this coordinate space and scaled by CSS. */
const VIEW = { width: 760, height: 240 }
const PAD = { top: 16, right: 16, bottom: 28, left: 52 }

const PLOT_WIDTH = VIEW.width - PAD.left - PAD.right
const PLOT_HEIGHT = VIEW.height - PAD.top - PAD.bottom

function formatDay(iso: string) {
  const date = new Date(`${iso}T00:00:00`)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function formatMoney(value: number, currency: string, fractionDigits = 0) {
  return `${currency}${value.toLocaleString(undefined, { maximumFractionDigits: fractionDigits })}`
}

/**
 * Revenue over time — one series, so the title carries identity and there is no
 * legend. Hover exposes the exact day; the axis stays sparse and recessive.
 */
export function RevenueChart({ data, currency = '$' }: RevenueChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const { linePath, areaPath, ticks, tickDigits, maxValue, xFor, yFor } = useMemo(() => {
    const max = Math.max(1, ...data.map((point) => point.revenue))
    // Round the top of the scale up so the gridline labels are readable numbers.
    const magnitude = 10 ** Math.floor(Math.log10(max))
    const niceMax = Math.ceil(max / magnitude) * magnitude

    const x = (index: number) =>
      data.length <= 1 ? PAD.left : PAD.left + (index / (data.length - 1)) * PLOT_WIDTH
    const y = (value: number) => PAD.top + PLOT_HEIGHT - (value / niceMax) * PLOT_HEIGHT

    const line = data
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(point.revenue)}`)
      .join(' ')

    const area =
      data.length > 0
        ? `${line} L ${x(data.length - 1)} ${PAD.top + PLOT_HEIGHT} L ${x(0)} ${PAD.top + PLOT_HEIGHT} Z`
        : ''

    return {
      linePath: line,
      areaPath: area,
      ticks: [0, 0.5, 1].map((fraction) => ({
        value: niceMax * fraction,
        y: y(niceMax * fraction),
      })),
      tickDigits: niceMax < 10 ? 1 : 0,
      maxValue: niceMax,
      xFor: x,
      yFor: y,
    }
  }, [data])

  if (data.length === 0) {
    return (
      <p className="text-grocery-500 grid h-[240px] place-items-center text-sm">
        No revenue in this period.
      </p>
    )
  }

  function handleMove(event: React.PointerEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) {
      return
    }
    // Map the pointer into chart space, then snap to the nearest day.
    const ratio = (event.clientX - rect.left) / rect.width
    const plotRatio = (ratio * VIEW.width - PAD.left) / PLOT_WIDTH
    const index = Math.round(plotRatio * (data.length - 1))
    setActiveIndex(Math.max(0, Math.min(data.length - 1, index)))
  }

  const active = activeIndex === null ? null : data[activeIndex]
  const labelEvery = Math.max(1, Math.ceil(data.length / 7))

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        className="h-auto w-full touch-none"
        role="img"
        aria-label={`Daily revenue, peaking at ${formatMoney(maxValue, currency)}`}
        onPointerMove={handleMove}
        onPointerLeave={() => setActiveIndex(null)}
      >
        <defs>
          <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-grocery-900)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-grocery-900)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Recessive grid + value labels. */}
        {ticks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={PAD.left}
              x2={VIEW.width - PAD.right}
              y1={tick.y}
              y2={tick.y}
              stroke="var(--color-line)"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 8}
              y={tick.y + 4}
              textAnchor="end"
              className="fill-grocery-300 text-[11px]"
            >
              {formatMoney(tick.value, currency, tickDigits)}
            </text>
          </g>
        ))}

        <path d={areaPath} fill="url(#revenue-fill)" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-grocery-900)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((point, index) =>
          index % labelEvery === 0 ? (
            <text
              key={point.date}
              x={xFor(index)}
              y={VIEW.height - 8}
              textAnchor="middle"
              className="fill-grocery-300 text-[11px]"
            >
              {formatDay(point.date)}
            </text>
          ) : null,
        )}

        {active && activeIndex !== null ? (
          <g>
            <line
              x1={xFor(activeIndex)}
              x2={xFor(activeIndex)}
              y1={PAD.top}
              y2={PAD.top + PLOT_HEIGHT}
              stroke="var(--color-grocery-300)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            {/* Surface ring keeps the marker readable where it sits on the line. */}
            <circle
              cx={xFor(activeIndex)}
              cy={yFor(active.revenue)}
              r="5"
              fill="var(--color-grocery-900)"
              stroke="var(--color-surface)"
              strokeWidth="2"
            />
          </g>
        ) : null}
      </svg>

      {active ? (
        <div
          className="border-line bg-surface text-grocery-900 pointer-events-none absolute top-2 rounded-lg border px-3 py-2 text-xs shadow-sm"
          style={{
            left: `${(xFor(activeIndex as number) / VIEW.width) * 100}%`,
            transform: 'translateX(-50%)',
          }}
        >
          <p className="text-grocery-500">{formatDay(active.date)}</p>
          <p className="font-semibold tabular-nums">{formatMoney(active.revenue, currency)}</p>
          <p className="text-grocery-500 tabular-nums">
            {active.orders} order{active.orders === 1 ? '' : 's'}
          </p>
        </div>
      ) : null}
    </div>
  )
}
