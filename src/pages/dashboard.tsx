import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  ArrowLeftRight,
  CalendarDays,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react"
import type { DateRange } from "react-day-picker"
import {
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  analyticsKpis,
  aovOverTime,
  formatCurrency,
  salesBreakdown,
  salesByChannel,
  salesByProduct,
  salesOverTime,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { PageActions } from "@/components/layout/page-actions"
import { Sparkline } from "@/components/dashboard/sparkline"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Config compartida de series: periodo actual + periodo anterior (comparativo)
const periodChartConfig = {
  actual: {
    label: "12 jun – 12 jul 2026",
    color: "var(--chart-2)",
  },
  anterior: {
    label: "12 may – 11 jun 2026",
    color: "color-mix(in oklab, var(--chart-2) 35%, transparent)",
  },
} satisfies ChartConfig

const channelChartConfig = {
  "Tienda en línea": { label: "Tienda en línea", color: "var(--chart-2)" },
  "Punto de venta": { label: "Punto de venta", color: "var(--chart-3)" },
} satisfies ChartConfig

const presetItems: Record<string, string> = {
  hoy: "Hoy",
  "7d": "Últimos 7 días",
  "30d": "Últimos 30 días",
  "90d": "Últimos 90 días",
  personalizado: "Personalizado",
}

const DAY_MS = 86_400_000

function PeriodLegend() {
  return (
    <div className="flex items-center justify-center gap-6 pt-2 text-xs text-muted-foreground">
      {Object.values(periodChartConfig).map((serie) => (
        <span key={serie.label} className="flex items-center gap-1.5">
          <span
            className="size-2 rounded-full"
            style={{ background: serie.color }}
          />
          {serie.label}
        </span>
      ))}
    </div>
  )
}

// Encabezado de métrica: label con subrayado punteado + valor + guion de tendencia
function MetricLabel({ children }: { children: string }) {
  return (
    <p className="truncate text-sm font-medium underline decoration-muted-foreground/40 decoration-dotted underline-offset-4">
      {children}
    </p>
  )
}

export function DashboardPage() {
  const [preset, setPreset] = useState("30d")
  const [pickerMode, setPickerMode] = useState<"rango" | "dia">("rango")
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 5, 12),
    to: new Date(2026, 6, 12),
  })
  const [singleDay, setSingleDay] = useState<Date | undefined>(
    new Date(2026, 6, 6)
  )

  const applyPreset = (value: string) => {
    setPreset(value)
    if (value === "personalizado") return
    const today = new Date()
    const days = value === "hoy" ? 0 : Number(value.replace("d", ""))
    setPickerMode(value === "hoy" ? "dia" : "rango")
    if (value === "hoy") {
      setSingleDay(today)
    } else {
      setRange({ from: new Date(today.getTime() - days * DAY_MS), to: today })
    }
  }

  const formatDay = (date: Date) => format(date, "d MMM yyyy", { locale: es })
  const dateLabel =
    pickerMode === "dia"
      ? singleDay
        ? formatDay(singleDay)
        : "Selecciona un día"
      : range?.from
        ? `${format(range.from, "d MMM", { locale: es })} – ${
            range.to ? formatDay(range.to) : "…"
          }`
        : "Selecciona un rango"

  return (
    <>
      {/* Solo acciones secundarias: el dashboard no tiene acción principal */}
      <PageActions>
        <Button variant="outline" size="icon" aria-label="Más opciones">
          <MoreHorizontal />
        </Button>
        <Button variant="outline">Nueva exploración</Button>
      </PageActions>

      {/* Filtros de periodo: preset + calendario (día o rango) + moneda */}
      <div className="flex flex-wrap items-center gap-2">
        <Select items={presetItems} value={preset} onValueChange={(v) => applyPreset(v ?? "30d")}>
          <SelectTrigger className="w-auto gap-1.5 bg-card font-medium text-foreground">
            <CalendarDays className="size-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(presetItems).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>
            <ArrowLeftRight data-icon="inline-start" />
            {dateLabel}
            <ChevronDown data-icon="inline-end" />
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <div className="border-b p-2">
              <Tabs
                value={pickerMode}
                onValueChange={(value) => {
                  setPickerMode(value as "rango" | "dia")
                  setPreset("personalizado")
                }}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="rango" className="flex-1">
                    Rango
                  </TabsTrigger>
                  <TabsTrigger value="dia" className="flex-1">
                    Día
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {pickerMode === "rango" ? (
              <Calendar
                mode="range"
                numberOfMonths={2}
                locale={es}
                defaultMonth={range?.from}
                selected={range}
                onSelect={(value) => {
                  setRange(value)
                  setPreset("personalizado")
                }}
              />
            ) : (
              <Calendar
                mode="single"
                locale={es}
                defaultMonth={singleDay}
                selected={singleDay}
                onSelect={(value) => {
                  setSingleDay(value)
                  setPreset("personalizado")
                }}
              />
            )}
          </PopoverContent>
        </Popover>

        <Button variant="outline">USD $</Button>
        <span className="ml-auto text-xs text-muted-foreground">
          Última actualización: 8:55 p.m.
        </span>
      </div>

      {/* KPIs del periodo */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {analyticsKpis.map((kpi) => (
          <Card key={kpi.label} className="flex-row items-center gap-3 px-5 py-4">
            <div className="min-w-0 flex-1 space-y-1">
              <MetricLabel>{kpi.label}</MetricLabel>
              <p className="text-lg font-semibold tabular-nums">
                {kpi.value}{" "}
                <span className="align-middle text-muted-foreground">—</span>
              </p>
            </div>
            <Sparkline data={kpi.spark} />
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Ventas totales en el tiempo */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <MetricLabel>Ventas totales en el tiempo</MetricLabel>
            <CardTitle className="text-2xl tabular-nums">
              $827.20{" "}
              <span className="align-middle text-base text-muted-foreground">
                —
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={periodChartConfig} className="h-72 w-full">
              <LineChart data={salesOverTime} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  tickFormatter={(value: number) => `$${value}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey="anterior"
                  type="monotone"
                  stroke="var(--color-anterior)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="actual"
                  type="monotone"
                  stroke="var(--color-actual)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
            <PeriodLegend />
          </CardContent>
        </Card>

        {/* Desglose de ventas totales */}
        <Card>
          <CardHeader>
            <MetricLabel>Desglose de ventas totales</MetricLabel>
          </CardHeader>
          <CardContent className="space-y-0.5">
            {salesBreakdown.map((row, index) => (
              <div
                key={row.label}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm",
                  index % 2 === 1 && "bg-muted/50"
                )}
              >
                <span className="text-info">{row.label}</span>
                <span className="flex items-center gap-2 tabular-nums">
                  {row.value < 0
                    ? `-${formatCurrency(Math.abs(row.value))}`
                    : formatCurrency(row.value)}
                  <span className="text-muted-foreground">—</span>
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Ventas por canal (dona) */}
        <Card>
          <CardHeader>
            <MetricLabel>Ventas totales por canal</MetricLabel>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <div className="relative">
              <ChartContainer
                config={channelChartConfig}
                className="aspect-square h-44"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={salesByChannel.map((item) => ({
                      ...item,
                      fill:
                        channelChartConfig[
                          item.channel as keyof typeof channelChartConfig
                        ].color,
                    }))}
                    dataKey="value"
                    nameKey="channel"
                    innerRadius={58}
                    outerRadius={80}
                    strokeWidth={2}
                  />
                </PieChart>
              </ChartContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-semibold tabular-nums">$827</span>
                <span className="text-muted-foreground">—</span>
              </div>
            </div>
            <div className="flex-1 space-y-2 text-sm">
              {salesByChannel.map((item) => (
                <div
                  key={item.channel}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className="size-2.5 rounded-xs"
                      style={{
                        background:
                          channelChartConfig[
                            item.channel as keyof typeof channelChartConfig
                          ].color,
                      }}
                    />
                    {item.channel}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {formatCurrency(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Valor promedio de pedido */}
        <Card>
          <CardHeader>
            <MetricLabel>Valor promedio del pedido</MetricLabel>
            <CardTitle className="text-xl tabular-nums">
              $201.84{" "}
              <span className="align-middle text-sm text-muted-foreground">
                —
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={periodChartConfig} className="h-40 w-full">
              <LineChart data={aovOverTime} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  dataKey="anterior"
                  type="monotone"
                  stroke="var(--color-anterior)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="actual"
                  type="monotone"
                  stroke="var(--color-actual)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
            <PeriodLegend />
          </CardContent>
        </Card>

        {/* Ventas por producto */}
        <Card>
          <CardHeader>
            <MetricLabel>Ventas totales por producto</MetricLabel>
          </CardHeader>
          <CardContent className="space-y-4">
            {salesByProduct.map((product) => {
              const max = Math.max(...salesByProduct.map((p) => p.value))
              const width = Math.max((product.value / max) * 100, 2)
              return (
                <div key={product.name} className="space-y-1">
                  <p className="truncate text-sm">{product.name}</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 shrink-0 rounded-xs"
                      style={{
                        width: `${width}%`,
                        background: "var(--chart-2)",
                      }}
                    />
                    <span className="text-sm tabular-nums">
                      {formatCurrency(product.value)}
                    </span>
                    <span className="text-muted-foreground">—</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-2 w-px bg-border" />
                    {formatCurrency(product.previous)}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
