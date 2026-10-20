import type { AccountStatus } from "@/lib/mock-data"
import { accountStatusLabel } from "@/lib/mock-data"
import { StatusPill, type StatusPillTone } from "@/components/orders/status-pill"

// Estado de una cuenta (por pagar / por cobrar): pagado/cobrado resuelto en
// gris, pendiente en naranja, vencido en rojo.
const config: Record<AccountStatus, { tone: StatusPillTone; resolved: boolean }> = {
  pagado: { tone: "success", resolved: true },
  cobrado: { tone: "success", resolved: true },
  pendiente: { tone: "warning", resolved: false },
  vencido: { tone: "critical", resolved: false },
}

export function AccountStatusBadge({ status }: { status: AccountStatus }) {
  const { tone, resolved } = config[status]
  return (
    <StatusPill tone={tone} resolved={resolved}>
      {accountStatusLabel[status]}
    </StatusPill>
  )
}
