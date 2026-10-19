import { TrendingDown, TrendingUp } from "lucide-react"

import type { Metric } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Tarjeta de métrica estándar: etiqueta, valor grande y variación con tendencia.
export function MetricCard({ metric }: { metric: Metric }) {
  const isPositive = metric.change >= 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <Card className="gap-2 py-4">
      <CardHeader className="px-4">
        <CardDescription>{metric.label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {metric.value}
        </CardTitle>
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            isPositive ? "text-success" : "text-destructive"
          )}
        >
          <TrendIcon className="size-3.5" />
          {isPositive ? "+" : ""}
          {metric.change}%
          <span className="font-normal text-muted-foreground">
            vs. mes anterior
          </span>
        </div>
      </CardHeader>
    </Card>
  )
}
