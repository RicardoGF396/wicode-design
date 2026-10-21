import * as React from "react"

// Color de la barra de navegación (sidebar). "oscuro" es el por defecto
// (sin data-nav). Cada proyecto/cliente puede designar el suyo desde
// Configuración o fijándolo por código con data-nav en <html>.
export const NAV_COLORS = [
  { value: "oscuro", label: "Oscuro", swatch: "oklch(0.17 0 0)" },
  { value: "pizarra", label: "Pizarra", swatch: "oklch(0.24 0.02 250)" },
  { value: "azul", label: "Azul", swatch: "oklch(0.27 0.06 255)" },
  { value: "verde", label: "Verde", swatch: "oklch(0.26 0.05 160)" },
  { value: "violeta", label: "Violeta", swatch: "oklch(0.26 0.07 285)" },
  { value: "vino", label: "Vino", swatch: "oklch(0.27 0.07 20)" },
] as const

export type NavColor = (typeof NAV_COLORS)[number]["value"]

type NavColorState = {
  navColor: NavColor
  setNavColor: (navColor: NavColor) => void
}

const NavColorContext = React.createContext<NavColorState | undefined>(undefined)

const STORAGE_KEY = "nav-color"

function isNavColor(value: string | null): value is NavColor {
  return !!value && NAV_COLORS.some((c) => c.value === value)
}

function apply(navColor: NavColor) {
  const root = document.documentElement
  if (navColor === "oscuro") {
    root.removeAttribute("data-nav")
  } else {
    root.setAttribute("data-nav", navColor)
  }
}

export function NavColorProvider({
  children,
  defaultNavColor = "oscuro",
}: {
  children: React.ReactNode
  defaultNavColor?: NavColor
}) {
  const [navColor, setNavColorState] = React.useState<NavColor>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isNavColor(stored) ? stored : defaultNavColor
  })

  React.useEffect(() => {
    apply(navColor)
  }, [navColor])

  const setNavColor = React.useCallback((next: NavColor) => {
    localStorage.setItem(STORAGE_KEY, next)
    setNavColorState(next)
  }, [])

  const value = React.useMemo(
    () => ({ navColor, setNavColor }),
    [navColor, setNavColor]
  )

  return (
    <NavColorContext.Provider value={value}>
      {children}
    </NavColorContext.Provider>
  )
}

export function useNavColor() {
  const context = React.useContext(NavColorContext)
  if (!context) {
    throw new Error("useNavColor must be used within a NavColorProvider")
  }
  return context
}
