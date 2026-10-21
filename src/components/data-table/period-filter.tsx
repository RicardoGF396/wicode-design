import { CalendarDays } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Opciones de periodo estándar. Homologa el filtro por fecha de todas las
// páginas con métricas + tabla; se usa en la primera celda de la franja de
// métricas (ver docs/PAGES.md).
export const periodItems: Record<string, string> = {
  hoy: "Hoy",
  "7d": "Últimos 7 días",
  "30d": "Últimos 30 días",
  mes: "Este mes",
}

export function PeriodFilter({
  value,
  onValueChange,
  items = periodItems,
  className,
}: {
  value: string
  onValueChange: (value: string) => void
  items?: Record<string, string>
  className?: string
}) {
  const keys = Object.keys(items)
  return (
    <Select
      items={items}
      value={value}
      onValueChange={(v) => onValueChange(v ?? keys[0])}
    >
      <SelectTrigger
        size="sm"
        className={cn(
          "w-auto gap-1.5 border-0 bg-transparent font-medium text-foreground shadow-none focus-visible:ring-0 dark:bg-transparent",
          className
        )}
      >
        <CalendarDays className="size-4 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {Object.entries(items).map(([v, label]) => (
            <SelectItem key={v} value={v}>
              {label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
