import { useEffect, useMemo, useState } from "react"
import {
  CheckCheck,
  MoreHorizontal,
  Package,
  Settings,
  TriangleAlert,
  Wallet,
  X,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import {
  notifications as seed,
  type AppNotification,
  type NotificationKind,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const kindIcon: Record<NotificationKind, LucideIcon> = {
  pedido: Package,
  pago: Wallet,
  inventario: TriangleAlert,
  mencion: CheckCheck,
}

function NotificationItem({ item }: { item: AppNotification }) {
  const Icon = kindIcon[item.kind]
  return (
    <div className="flex gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-muted/60">
      <div className="relative">
        <span className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </span>
        {item.unread && (
          <span className="absolute -top-0.5 -left-0.5 size-2 rounded-full bg-destructive ring-2 ring-popover" />
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm font-medium">{item.title}</p>
        <p className="text-sm text-muted-foreground">{item.description}</p>
        <p className="text-xs text-muted-foreground">{item.time}</p>
      </div>
    </div>
  )
}

// Panel de notificaciones que se despliega pegado al borde derecho del
// sidebar, a toda altura (patrón flyout). Controlado desde AppSidebar.
export function NotificationsPanel({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { state, isMobile } = useSidebar()
  const [onlyUnread, setOnlyUnread] = useState(false)
  const [tab, setTab] = useState("todas")

  // Cierra con Escape
  useEffect(() => {
    if (!open) return
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false)
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [open, onOpenChange])

  const unreadCount = seed.filter((n) => n.unread).length

  const visible = useMemo(() => {
    return seed.filter((n) => {
      if (onlyUnread && !n.unread) return false
      if (tab === "menciones" && !n.mention) return false
      return true
    })
  }, [onlyUnread, tab])

  // Offset izquierdo = ancho del sidebar + separación (panel flotante)
  const left = isMobile
    ? "0.75rem"
    : state === "collapsed"
      ? "calc(var(--sidebar-width-icon) + 0.75rem)"
      : "calc(var(--sidebar-width) + 0.75rem)"

  return (
    <>
      {/* Captura de clic exterior (sin oscurecer) */}
      <div
        aria-hidden
        onClick={() => onOpenChange(false)}
        className={cn(
          "fixed inset-0 z-40",
          open ? "block" : "hidden"
        )}
      />
      <aside
        role="dialog"
        aria-label="Notificaciones"
        data-open={open}
        style={{ left }}
        className="fixed inset-y-3 z-50 flex w-96 max-w-[calc(100vw-5rem)] flex-col overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-xl transition-[transform,opacity] duration-200 ease-out data-[open=false]:pointer-events-none data-[open=false]:-translate-x-3 data-[open=false]:opacity-0"
      >
        {/* Encabezado */}
        <div className="flex items-center gap-2 px-4 py-3">
          <h2 className="font-heading text-base font-medium">Notificaciones</h2>
          {unreadCount > 0 && (
            <Badge className="h-5 min-w-5 justify-center rounded-full bg-destructive px-1.5 text-white">
              {unreadCount}
            </Badge>
          )}
          <div className="ml-auto flex items-center gap-1">
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
              <Switch
                size="sm"
                checked={onlyUnread}
                onCheckedChange={setOnlyUnread}
              />
              No leídas
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon-sm" aria-label="Opciones" />
                }
              >
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <CheckCheck />
                    Marcar todo como leído
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings />
                    Configurar notificaciones
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Cerrar"
              onClick={() => onOpenChange(false)}
            >
              <X />
            </Button>
          </div>
        </div>

        {/* Pestañas */}
        <Tabs value={tab} onValueChange={setTab} className="min-h-0 flex-1">
          <div className="border-b px-3">
            <TabsList variant="line" className="h-10 w-full justify-start gap-4">
              <TabsTrigger value="todas" className="flex-none px-0">
                Todas
              </TabsTrigger>
              <TabsTrigger value="menciones" className="flex-none px-0">
                Menciones
              </TabsTrigger>
              <TabsTrigger value="acciones" className="flex-none px-0">
                Acciones
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={tab} className="min-h-0 flex-1">
            <ScrollArea className="h-full">
              <div className="p-2">
                <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Recientes
                </p>
                {visible.length === 0 ? (
                  <p className="px-2 py-8 text-center text-sm text-muted-foreground">
                    No hay notificaciones.
                  </p>
                ) : (
                  visible.map((item) => (
                    <NotificationItem key={item.id} item={item} />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </aside>
    </>
  )
}
