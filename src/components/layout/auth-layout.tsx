import type { ReactNode } from "react"
import { Link } from "react-router-dom"

import { WicodeLogo } from "@/components/brand/wicode-logo"

// Layout centrado para páginas de autenticación (login, sign up).
// Logo arriba, contenido (Card) al centro, legales abajo.
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-6 md:p-10">
      <Link to="/" aria-label="Wicode" className="self-center text-foreground">
        <WicodeLogo className="h-6 w-auto" />
      </Link>
      <div className="w-full max-w-sm">{children}</div>
      <p className="max-w-sm text-center text-xs text-balance text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-foreground">
        Al continuar, aceptas nuestros <a href="#">Términos de servicio</a> y{" "}
        <a href="#">Política de privacidad</a>.
      </p>
    </div>
  )
}
