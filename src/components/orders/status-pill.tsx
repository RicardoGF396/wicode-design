import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export type StatusPillTone = "neutral" | "caution" | "attention"

const toneStyles: Record<StatusPillTone, string> = {
  neutral: "bg-badge-neutral",
  caution: "bg-badge-caution",
  attention: "bg-badge-attention",
}

// Pastilla de estado (patrón Orders): relleno suave, texto normal.
// "resolved" muestra punto relleno (estado terminado); si no, un círculo
// abierto (estado pendiente de acción).
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
