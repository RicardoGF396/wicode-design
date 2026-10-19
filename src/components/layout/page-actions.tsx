import { createContext, useContext, type ReactNode } from "react"
import { createPortal } from "react-dom"

// Slot de acciones del header: las páginas declaran sus botones principales
// con <PageActions> y el layout los renderiza arriba a la derecha.
const PageActionsContext = createContext<HTMLElement | null>(null)

export const PageActionsProvider = PageActionsContext.Provider

export function PageActions({ children }: { children: ReactNode }) {
  const target = useContext(PageActionsContext)
  if (!target) return null
  return createPortal(children, target)
}
