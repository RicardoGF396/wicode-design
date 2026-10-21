import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

import {
  formatCurrency,
  formatDate,
  orders,
  type Order,
  type OrderStatus,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { PageActions } from "@/components/layout/page-actions"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Los datos demo viven en octubre 2026; fijamos "hoy" ahí para el resaltado.
const TODAY = new Date(2026, 9, 21)
const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

// Mayúscula inicial (date-fns en español devuelve minúsculas)
const cap = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

// Tono del chip según el estado del pedido (mismo semáforo que StatusPill)
const ORDER_TONE: Record<OrderStatus, string> = {
  pagado: "bg-badge-success",
  enviado: "bg-badge-info",
  pendiente: "bg-badge-warning",
  cancelado: "bg-badge-critical",
}

function OrderChip({ order, onClick }: { order: Order; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center truncate rounded-md px-1.5 py-0.5 text-left text-xs text-foreground transition-opacity hover:opacity-80",
        ORDER_TONE[order.status]
      )}
    >
      <span className="truncate">{order.customer}</span>
    </button>
  )
}

export function CalendarPage() {
  const navigate = useNavigate()
  const [month, setMonth] = useState(new Date(2026, 9, 1))
  const [selected, setSelected] = useState<Order | null>(null)

  // Pedidos agrupados por fecha ISO
  const byDate = useMemo(() => {
    const map = new Map<string, Order[]>()
    for (const order of orders) {
      const list = map.get(order.date) ?? []
      list.push(order)
      map.set(order.date, list)
    }
    return map
  }, [])

  // Días visibles: semanas completas que cubren el mes
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 })
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 })
    return eachDayOfInterval({ start, end })
  }, [month])

  return (
    <>
      <PageActions>
        <Button onClick={() => navigate("/orders/new")}>
          <Plus data-icon="inline-start" />
          Crear pedido
        </Button>
      </PageActions>

      <Card className="min-h-0 flex-1 !shrink gap-0 overflow-hidden py-0">
        {/* Barra de navegación del mes */}
        <div className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
          <Button variant="outline" size="sm" onClick={() => setMonth(TODAY)}>
            Hoy
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Mes anterior"
              onClick={() => setMonth(subMonths(month, 1))}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Mes siguiente"
              onClick={() => setMonth(addMonths(month, 1))}
            >
              <ChevronRight />
            </Button>
          </div>
          <h2 className="text-base font-medium">
            {cap(format(month, "MMMM yyyy", { locale: es }))}
          </h2>
        </div>

        {/* Encabezado de días de la semana */}
        <div
          className="grid shrink-0 border-b"
          style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
        >
          {WEEKDAYS.map((weekday) => (
            <div
              key={weekday}
              className="px-2 py-2 text-xs font-medium text-muted-foreground"
            >
              {weekday}
            </div>
          ))}
        </div>

        {/* Rejilla del mes */}
        <div
          className="grid min-h-0 flex-1 auto-rows-fr overflow-y-auto"
          style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}
        >
          {days.map((day) => {
            const iso = format(day, "yyyy-MM-dd")
            const dayOrders = byDate.get(iso) ?? []
            const inMonth = isSameMonth(day, month)
            const isToday = isSameDay(day, TODAY)
            return (
              <div
                key={iso}
                className={cn(
                  "min-h-28 border-r border-b px-2.5 py-1.5 [&:nth-child(7n)]:border-r-0",
                  !inMonth && "bg-muted/30 text-muted-foreground"
                )}
              >
                <div className="px-0.5">
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full text-sm tabular-nums",
                      isToday && "bg-primary font-medium text-primary-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                </div>
                <div className="mt-1 space-y-1">
                  {dayOrders.slice(0, 2).map((order) => (
                    <OrderChip
                      key={order.id}
                      order={order}
                      onClick={() => setSelected(order)}
                    />
                  ))}
                  {dayOrders.length > 2 && (
                    <Popover>
                      <PopoverTrigger
                        render={
                          <button className="w-full rounded-md px-1.5 py-0.5 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-muted" />
                        }
                      >
                        +{dayOrders.length - 2} más
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-60 p-2">
                        <p className="px-1 pb-1.5 text-sm font-medium">
                          {cap(format(day, "EEEE d 'de' MMMM", { locale: es }))}
                        </p>
                        <div className="space-y-1">
                          {dayOrders.map((order) => (
                            <OrderChip
                              key={order.id}
                              order={order}
                              onClick={() => setSelected(order)}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Dialog: detalle del pedido */}
      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="sm:max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle>Pedido {selected.id}</DialogTitle>
                  <OrderStatusBadge status={selected.status} />
                </div>
                <DialogDescription>
                  {selected.customer} · {formatDate(selected.date)}
                </DialogDescription>
              </DialogHeader>
              <dl className="divide-y overflow-hidden rounded-lg border text-sm">
                {[
                  { label: "Total", value: formatCurrency(selected.total) },
                  { label: "Artículos", value: String(selected.items) },
                  { label: "Canal", value: selected.channel },
                  { label: "Entrega", value: selected.delivery },
                  { label: "Destino", value: selected.destination },
                  { label: "Dirección", value: selected.address },
                  { label: "Correo", value: selected.email },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-3 px-3 py-2"
                  >
                    <dt className="shrink-0 text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd className="min-w-0 truncate text-right">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Cerrar
                </Button>
                <Button onClick={() => navigate("/table")}>
                  Ver en Pedidos
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
