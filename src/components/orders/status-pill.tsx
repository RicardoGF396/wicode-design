import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Estándar semántico de estados (único para todas las tablas · semáforo):
//   success  → verde    · resultado positivo confirmado (pagado, en stock)
//   info     → azul     · en tránsito / informativo activo (enviado)
//   warning  → amarillo · requiere atención (pendiente, sin preparar, bajo)
//   critical → rojo     · negativo / urgente (vencido, agotado, cancelado)
//   neutral  → gris     · sin carga / no aplica (no se requiere)
export type StatusPillTone =
  | "neutral"
  | "success"
  | "info"
  | "warning"
  | "critical"

const toneStyles: Record<StatusPillTone, string> = {
  neutral: "bg-badge-neutral",
  success: "bg-badge-success",
  info: "bg-badge-info",
  warning: "bg-badge-warning",
  critical: "bg-badge-critical",
}

// Pastilla de estado (patrón Orders): relleno suave, texto normal.
// "resolved" muestra punto relleno (estado asentado/terminal); si no, un
// círculo abierto (estado activo que pide seguimiento: pendiente, vencido…).
export function StatusPill({
  tone,
  resolved = false,
  children,
}: {
  tone: StatusPillTone
  resolved?: boolean
  children: ReactNode
}) {
  return (
    <Badge
      variant="secondary"
      className={cn("gap-1.5 font-normal text-foreground", toneStyles[tone])}
    >
      {resolved ? (
        <span className="size-1.5 rounded-full bg-foreground/70" />
      ) : (
        <span className="size-2 rounded-full border-[1.5px] border-foreground/60" />
      )}
      {children}
    </Badge>
  )
}
