import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  getRecentPages,
  pushRecentPage,
  searchablePages,
  type SearchablePage,
} from "@/lib/recent-pages"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

// Buscador global tipo paleta de comandos (⌘K). Dividido en "Recientes" y
// las páginas del sistema por sección. Abierto desde el buscador del sidebar.
export function GlobalSearch({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()
  const [recent, setRecent] = useState<SearchablePage[]>([])

  // Refresca los recientes cada vez que se abre
  useEffect(() => {
    if (open) setRecent(getRecentPages())
  }, [open])

  // Atajo global ⌘K / Ctrl+K
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [open, onOpenChange])

  const go = (page: SearchablePage) => {
    pushRecentPage(page.path)
    onOpenChange(false)
    navigate(page.path)
  }

  // Agrupa las páginas por sección, excluyendo las ya mostradas en recientes
  const grouped = useMemo(() => {
    const recentPaths = new Set(recent.map((p) => p.path))
    const bySection = new Map<string, SearchablePage[]>()
    for (const page of searchablePages) {
      if (recentPaths.has(page.path)) continue
      const list = bySection.get(page.section) ?? []
      list.push(page)
      bySection.set(page.section, list)
    }
    return [...bySection.entries()]
  }, [recent])

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Buscar en Wicode"
      description="Busca páginas del sistema"
      className="sm:max-w-xl"
    >
      <Command>
        <CommandInput placeholder="Buscar páginas…" />
        <CommandList>
        <CommandEmpty>Sin resultados.</CommandEmpty>
        {recent.length > 0 && (
          <>
            <CommandGroup heading="Recientes">
              {recent.map((page) => (
                <CommandItem
                  key={page.path}
                  value={`reciente ${page.title} ${page.keywords ?? ""}`}
                  onSelect={() => go(page)}
                >
                  <page.icon />
                  {page.title}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}
        {grouped.map(([section, pages]) => (
          <CommandGroup key={section} heading={section}>
            {pages.map((page) => (
              <CommandItem
                key={page.path}
                value={`${page.title} ${page.keywords ?? ""}`}
                onSelect={() => go(page)}
              >
                <page.icon />
                {page.title}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
