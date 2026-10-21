import { createPortal } from "react-dom"

import { Spinner } from "@/components/ui/spinner"

// Overlay de carga a pantalla completa: cubre todo el viewport, bloquea la
// interacción y muestra un spinner con mensaje. Úsalo para acciones que no
// deben interrumpirse (importar, procesar, sincronizar…).
export function LoadingOverlay({
  open,
  label = "Cargando…",
}: {
  open: boolean
  label?: string
}) {
  if (!open) return null

  return createPortal(
    <div
      role="status"
      aria-live="assertive"
      aria-busy="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-background/70 backdrop-blur-sm"
    >
      <Spinner className="size-8 text-primary" />
      <p className="text-sm font-medium text-foreground">{label}</p>
    </div>,
    document.body
  )
}
