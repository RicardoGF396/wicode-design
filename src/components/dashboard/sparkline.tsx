import { cn } from "@/lib/utils"

// Mini gráfica de tendencia para franjas de métricas (patrón Orders).
// Puramente decorativa: sin ejes, sin tooltip, color de la serie 2.
export function Sparkline({
  data,
  className,
}: {
  data: number[]
  className?: string
}) {
  const width = 56
  const height = 20
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - 2 - ((value - min) / range) * (height - 4)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <polyline
        points={points}
        fill="none"
        stroke="var(--chart-2)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
