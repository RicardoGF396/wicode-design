import type { OrderStatus } from "@/lib/mock-data"
import { orderStatusLabel } from "@/lib/mock-data"
import { StatusPill, type StatusPillTone } from "@/components/orders/status-pill"

// Estado de pago (patrón Orders): gris con punto relleno para estados
// resueltos; naranja con círculo abierto cuando requiere acción.
const statusConfig: Record<OrderStatus, { tone: StatusPillTone; resolved: boolean }> = {
  pagado: { tone: "success", resolved: true },
  enviado: { tone: "info", resolved: true },
  cancelado: { tone: "critical", resolved: true },
  pendiente: { tone: "warning", resolved: false },
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { tone, resolved } = statusConfig[status]
  return (
    <StatusPill tone={tone} resolved={resolved}>
      {orderStatusLabel[status]}
    </StatusPill>
  )
}
