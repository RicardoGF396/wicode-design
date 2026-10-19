import { Link } from "react-router-dom"
import { ArrowRight, Package, Rocket, Sparkles } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { metrics, salesByMonth } from "@/lib/mock-data"
import { MetricCard } from "@/components/dashboard/metric-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  ventas: {
    label: "Ventas",
    color: "var(--chart-1)",
  },
  pedidos: {
    label: "Pedidos",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const quickActions = [
  {
    icon: Package,
    title: "Agrega tu primer producto",
    description:
      "Sube fotos, define precios y publica tu catálogo en minutos.",
    cta: "Agregar producto",
    to: "/forms",
  },
  {
    icon: Rocket,
    title: "Realiza tus primeras 10 ventas",
    description:
      "Comparte tu tienda en redes y haz crecer tu negocio desde el día uno.",
    cta: "Comenzar",
    to: "/table",
  },
  {
    icon: Sparkles,
    title: "Personaliza tu página de inicio",
    description:
      "Mejora la conversión con una página de inicio hecha a tu medida.",
    cta: "Consultar la guía",
    to: "/drawer-detail",
  },
]

export function DashboardPage() {
  return (
    <>
      {/* Saludo: es contenido de la página, no header (el header del layout
          ya muestra el título "Inicio") */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            ¡Buenos días!
          </h1>
          <p className="text-sm text-muted-foreground">
            Sigamos haciendo crecer tu negocio.
          </p>
        </div>
        <Badge variant="secondary" className="gap-1.5">
          <span className="size-2 rounded-full bg-success" />
          Visitantes en vivo: 3
        </Badge>
      </div>

      {/* Franja de métricas: últimos 30 días */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Gráfica principal */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ventas totales</CardTitle>
            <CardDescription>Mayo – Octubre 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <AreaChart data={salesByMonth} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="fillVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-ventas)"
                      stopOpacity={0.6}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-ventas)"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="ventas"
                  type="natural"
                  fill="url(#fillVentas)"
                  stroke="var(--color-ventas)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Resumen lateral */}
        <Card>
          <CardHeader>
            <CardTitle>Tareas pendientes</CardTitle>
            <CardDescription>0 de 5 tareas completadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              "Configura los envíos",
              "Conecta tu dominio",
              "Activa los pagos",
              "Agrega tu primer producto",
              "Publica tu tienda",
            ].map((task) => (
              <label
                key={task}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <span className="size-4 rounded-full border" />
                {task}
              </label>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Ver todas las tareas
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Tarjetas de acción (patrón de onboarding del layout base) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Card key={action.title}>
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
                <action.icon className="size-5" />
              </div>
              <CardTitle className="text-base">{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link to={action.to} />}
              >
                {action.cta}
                <ArrowRight data-icon="inline-end" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}
