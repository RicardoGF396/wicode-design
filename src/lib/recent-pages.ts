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

export type SearchablePage = {
  path: string
  title: string
  section: string
  icon: LucideIcon
  keywords?: string
}

// Registro único de páginas buscables del sistema.
export const searchablePages: SearchablePage[] = [
  { path: "/", title: "Inicio", section: "General", icon: Home, keywords: "dashboard analytics métricas" },
  { path: "/table", title: "Pedidos", section: "General", icon: ShoppingBag, keywords: "órdenes ventas" },
  { path: "/drawer-detail", title: "Clientes", section: "General", icon: Users, keywords: "contactos compradores" },
  { path: "/inventory", title: "Inventario", section: "General", icon: Boxes, keywords: "stock existencias productos" },
  { path: "/accounts-payable", title: "Cuentas por pagar", section: "Finanzas", icon: ArrowUpFromLine, keywords: "facturas proveedores" },
  { path: "/accounts-receivable", title: "Cuentas por cobrar", section: "Finanzas", icon: ArrowDownToLine, keywords: "facturas clientes cobros" },
  { path: "/forms", title: "Formularios", section: "General", icon: FileText, keywords: "producto captura" },
  { path: "/mcp-guide", title: "Guía MCP", section: "Recursos", icon: Cable, keywords: "integración agentes" },
  { path: "/docs", title: "Documentación", section: "Recursos", icon: BookOpen, keywords: "reglas tokens" },
]

const STORAGE_KEY = "recent-pages"
const MAX_RECENT = 4

export function pushRecentPage(path: string) {
  if (!searchablePages.some((p) => p.path === path)) return
  try {
    const current = getRecentPaths().filter((p) => p !== path)
    const next = [path, ...current].slice(0, MAX_RECENT)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // almacenamiento no disponible: ignorar
  }
}

export function getRecentPaths(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(parsed) ? parsed.filter((p): p is string => typeof p === "string") : []
  } catch {
    return []
  }
}

export function getRecentPages(): SearchablePage[] {
  const byPath = new Map(searchablePages.map((p) => [p.path, p]))
  return getRecentPaths()
    .map((path) => byPath.get(path))
    .filter((p): p is SearchablePage => Boolean(p))
}
