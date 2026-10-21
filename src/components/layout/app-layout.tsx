import { useEffect, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  BookOpen,
  Boxes,
  Cable,
  FileText,
  Home,
  ShoppingBag,
  Users,
  type LucideIcon,
} from "lucide-react"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { PageActionsProvider } from "@/components/layout/page-actions"
import { pushRecentPage } from "@/lib/recent-pages"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

const pages: Record<string, { title: string; icon: LucideIcon }> = {
  "/": { title: "Inicio", icon: Home },
  "/table": { title: "Pedidos", icon: ShoppingBag },
  "/orders/new": { title: "Crear pedido", icon: ShoppingBag },
  "/drawer-detail": { title: "Clientes", icon: Users },
  "/accounts-payable": { title: "Cuentas por pagar", icon: ArrowUpFromLine },
  "/accounts-receivable": { title: "Cuentas por cobrar", icon: ArrowDownToLine },
  "/inventory": { title: "Inventario", icon: Boxes },
  "/forms": { title: "Formularios", icon: FileText },
  "/mcp-guide": { title: "Guía MCP", icon: Cable },
  "/docs": { title: "Documentación", icon: BookOpen },
}

export function AppLayout() {
  const location = useLocation()
  const page = pages[location.pathname] ?? { title: "Página", icon: Home }
  const PageIcon = page.icon
  const [actionsSlot, setActionsSlot] = useState<HTMLElement | null>(null)

  // Registra la página visitada para "Recientes" del buscador global
  useEffect(() => {
    pushRecentPage(location.pathname)
  }, [location.pathname])

  return (
    <SidebarProvider>
      <AppSidebar />
      {/* Altura fija a la ventana: el borde redondeado inferior siempre es
          visible y el scroll ocurre dentro del contenedor. */}
      <SidebarInset className="h-svh overflow-hidden md:h-[calc(100svh-1rem)]">
        {/* Header estándar: compacto, sin borde inferior. Icono + título a la
            izquierda; acciones principales de la página a la derecha. */}
        {/* px-6 alinea icono, título y acciones con el p-6 del contenido */}
        <header className="flex h-14 shrink-0 items-center gap-2.5 px-6">
          <PageIcon className="size-5 text-muted-foreground" />
          <span className="text-base font-medium">{page.title}</span>
          {/* Solo acciones de página: notificaciones y tema viven en el sidebar */}
          <div ref={setActionsSlot} className="ml-auto flex items-center gap-2" />
        </header>
        <PageActionsProvider value={actionsSlot}>
          {/* SidebarInset ya es el <main> semántico; este div es el área con
              scroll. *:shrink-0 evita que los hijos se compriman: el contenido
              excedente genera scroll interno en lugar de aplastarse. */}
          <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6 pt-2 *:shrink-0">
            <Outlet />
          </div>
        </PageActionsProvider>
      </SidebarInset>
    </SidebarProvider>
  )
}
