import { useState } from "react"

import { cn } from "@/lib/utils"

// Mini gráfica de tendencia para franjas de métricas (patrón Orders).
// Con `interactive`, muestra un punto y el valor al pasar el cursor.
export function Sparkline({
  data,
  className,
  interactive = false,
  formatValue = (value: number) => String(value),
}: {
  data: number[]
  className?: string
  interactive?: boolean
  formatValue?: (value: number) => string
}) {
  const width = 56
  const height = 20
  const [hover, setHover] = useState<number | null>(null)

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const coords = data.map((value, index) => ({
    x: (index / (data.length - 1)) * width,
    y: height - 2 - ((value - min) / range) * (height - 4),
    value,
  }))
  const points = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ")

  const svg = (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className={cn("shrink-0", interactive && "cursor-crosshair", className)}
      onMouseMove={
        interactive
          ? (event) => {
              const rect = event.currentTarget.getBoundingClientRect()
              const ratio = (event.clientX - rect.left) / rect.width
              const index = Math.round(ratio * (data.length - 1))
              setHover(Math.max(0, Math.min(data.length - 1, index)))
            }
          : undefined
      }
      onMouseLeave={interactive ? () => setHover(null) : undefined}
    >
      <polyline
        points={points}
        fill="none"
        stroke="var(--chart-2)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {interactive && hover !== null && (
        <>
          <line
            x1={coords[hover].x}
            y1={0}
            x2={coords[hover].x}
            y2={height}
            stroke="var(--border)"
            strokeWidth="1"
          />
          <circle
            cx={coords[hover].x}
            cy={coords[hover].y}
            r="2.5"
            fill="var(--chart-2)"
            stroke="var(--card)"
            strokeWidth="1.5"
          />
        </>
      )}
    </svg>
  )

  if (!interactive) return svg

  return (
    <div className={cn("relative", className)}>
      {svg}
      {hover !== null && (
        <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-background tabular-nums">
          {formatValue(data[hover])}
        </span>
      )}
    </div>
  )
}
