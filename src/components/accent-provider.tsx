import * as React from "react"

// Acentos disponibles. "neutral" es el por defecto (sin data-accent).
export const ACCENTS = [
  { value: "neutral", label: "Neutral", swatch: "oklch(0.45 0 0)" },
  { value: "azul", label: "Azul", swatch: "oklch(0.546 0.2 262)" },
  { value: "verde", label: "Verde", swatch: "oklch(0.52 0.15 150)" },
  { value: "violeta", label: "Violeta", swatch: "oklch(0.51 0.23 277)" },
  { value: "rosa", label: "Rosa", swatch: "oklch(0.58 0.22 15)" },
  { value: "naranja", label: "Naranja", swatch: "oklch(0.65 0.18 50)" },
  { value: "ambar", label: "Ámbar", swatch: "oklch(0.76 0.16 85)" },
] as const

export type Accent = (typeof ACCENTS)[number]["value"]

type AccentState = { accent: Accent; setAccent: (accent: Accent) => void }

const AccentContext = React.createContext<AccentState | undefined>(undefined)

const STORAGE_KEY = "accent"

function isAccent(value: string | null): value is Accent {
  return !!value && ACCENTS.some((a) => a.value === value)
}

function apply(accent: Accent) {
  const root = document.documentElement
  if (accent === "neutral") {
    root.removeAttribute("data-accent")
  } else {
    root.setAttribute("data-accent", accent)
  }
}

export function AccentProvider({
  children,
  defaultAccent = "neutral",
}: {
  children: React.ReactNode
  defaultAccent?: Accent
}) {
  const [accent, setAccentState] = React.useState<Accent>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isAccent(stored) ? stored : defaultAccent
  })

  React.useEffect(() => {
    apply(accent)
  }, [accent])

  const setAccent = React.useCallback((next: Accent) => {
    localStorage.setItem(STORAGE_KEY, next)
    setAccentState(next)
  }, [])

  const value = React.useMemo(() => ({ accent, setAccent }), [accent, setAccent])

  return (
    <AccentContext.Provider value={value}>{children}</AccentContext.Provider>
  )
}

export function useAccent() {
  const context = React.useContext(AccentContext)
  if (!context) {
    throw new Error("useAccent must be used within an AccentProvider")
  }
  return context
}
