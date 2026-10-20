import type { StockStatus } from "@/lib/mock-data"
import { stockStatusLabel } from "@/lib/mock-data"
import { StatusPill, type StatusPillTone } from "@/components/orders/status-pill"

// Estado de existencias: en stock resuelto (gris), bajo (amarillo),
// agotado (rojo).
const config: Record<StockStatus, { tone: StatusPillTone; resolved: boolean }> = {
  en_stock: { tone: "success", resolved: true },
  bajo: { tone: "warning", resolved: false },
  agotado: { tone: "critical", resolved: false },
}

export function StockStatusBadge({ status }: { status: StockStatus }) {
  const { tone, resolved } = config[status]
  return (
    <StatusPill tone={tone} resolved={resolved}>
      {stockStatusLabel[status]}
    </StatusPill>
  )
}
