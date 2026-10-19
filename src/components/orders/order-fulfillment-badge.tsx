import type { FulfillmentStatus } from "@/lib/mock-data"
import { fulfillmentLabel } from "@/lib/mock-data"
import { StatusPill, type StatusPillTone } from "@/components/orders/status-pill"

// Estado de preparación (patrón Orders): amarillo con círculo abierto
// mientras está pendiente; gris con punto relleno cuando está resuelto.
const fulfillmentConfig: Record<
  FulfillmentStatus,
  { tone: StatusPillTone; resolved: boolean }
> = {
  preparado: { tone: "neutral", resolved: true },
  no_requerido: { tone: "neutral", resolved: true },
  sin_preparar: { tone: "attention", resolved: false },
}

export function OrderFulfillmentBadge({ status }: { status: FulfillmentStatus }) {
  const { tone, resolved } = fulfillmentConfig[status]
  return (
    <StatusPill tone={tone} resolved={resolved}>
      {fulfillmentLabel[status]}
    </StatusPill>
  )
}
