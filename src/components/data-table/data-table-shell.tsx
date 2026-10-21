import { useMemo, useState, type ReactNode } from "react"
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Columns3,
  MoreHorizontal,
  Search,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Sparkline } from "@/components/dashboard/sparkline"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type DataTableMetric = {
  label: string
  value: string
  spark: number[]
}

export type DataColumn<T> = {
  key: string
  label: string
  headClass?: string
  cellClass?: string
  cell: (row: T) => ReactNode
}

type DataTableShellProps<T> = {
  /** Franja de métricas del periodo */
  metrics: DataTableMetric[]
  /** Chip de periodo a la izquierda de las métricas */
  metricsLabel?: string
  /** Opciones del select de estado (clave → etiqueta); la primera es el default */
  filterItems: Record<string, string>
  matchesFilter: (row: T, filter: string) => boolean
  matchesSearch: (row: T, query: string) => boolean
  searchPlaceholder?: string
  /** Columna fija (sticky) junto al checkbox */
  primaryHeader: string
  primaryHeadClass?: string
  primaryCell: (row: T) => ReactNode
  /** Columnas configurables (mostrar/ocultar) */
  columns: DataColumn<T>[]
  rows: T[]
  getRowId: (row: T) => string
  isRowCancelled?: (row: T) => boolean
  onRowClick?: (row: T) => void
  /** Items del menú de acciones por fila (dentro de un DropdownMenuContent) */
  rowActions?: (row: T) => ReactNode
  /** Nombre plural de la entidad para el contador del pie */
  entityPlural: string
}

const PAGE_SIZES: Record<string, string> = {
  "10": "10",
  "25": "25",
  "50": "50",
  "100": "100",
}

// Receta Table reutilizable (patrón Orders): métricas con sparkline, filtro
// integrado con buscador y selector de columnas, selección, sticky y
// paginación con filas por página. Ver docs/PAGES.md.
export function DataTableShell<T>({
  metrics,
  metricsLabel = "Hoy",
  filterItems,
  matchesFilter,
  matchesSearch,
  searchPlaceholder = "Buscar y filtrar",
  primaryHeader,
  primaryHeadClass = "min-w-32",
  primaryCell,
  columns,
  rows,
  getRowId,
  isRowCancelled,
  onRowClick,
  rowActions,
  entityPlural,
}: DataTableShellProps<T>) {
  const filterKeys = Object.keys(filterItems)
  const [filter, setFilter] = useState(filterKeys[0] ?? "todos")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set())

  const visibleColumns = columns.filter((col) => !hiddenColumns.has(col.key))

  const toggleColumn = (key: string) => {
    const next = new Set(hiddenColumns)
    next.has(key) ? next.delete(key) : next.add(key)
    setHiddenColumns(next)
  }

  const filtered = useMemo(
    () =>
      rows.filter(
        (row) => matchesFilter(row, filter) && matchesSearch(row, search)
      ),
    [rows, filter, search, matchesFilter, matchesSearch]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const allPageSelected =
    pageRows.length > 0 && pageRows.every((row) => selected.has(getRowId(row)))

  const toggleAll = () => {
    const next = new Set(selected)
    if (allPageSelected) {
      pageRows.forEach((row) => next.delete(getRowId(row)))
    } else {
      pageRows.forEach((row) => next.add(getRowId(row)))
    }
    setSelected(next)
  }

  const toggleRow = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  const colSpan = visibleColumns.length + 2 + (rowActions ? 1 : 0)

  return (
    <>
      {/* Métricas del periodo: card segmentada con chip, label punteado y spark */}
      <Card className="flex-row items-stretch gap-0 py-0">
        <div className="flex shrink-0 items-center gap-2 border-r px-5 text-sm">
          <CalendarDays className="size-4 text-muted-foreground" />
          {metricsLabel}
        </div>
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={cn(
              "flex min-w-0 flex-1 items-center justify-between gap-3 px-4 py-3",
              index > 0 && "border-l"
            )}
          >
            <div className="min-w-0 space-y-1">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <p className="truncate text-sm font-medium underline decoration-muted-foreground/40 decoration-dotted underline-offset-4" />
                  }
                >
                  {metric.label}
                </TooltipTrigger>
                <TooltipContent>{metric.label}</TooltipContent>
              </Tooltip>
              <p className="text-sm font-medium tabular-nums">{metric.value}</p>
            </div>
            <Sparkline data={metric.spark} interactive className="hidden xl:block" />
          </div>
        ))}
      </Card>

      {/* Card única: filtro integrado + tabla; la paginación queda visible */}
      <Card className="min-h-0 flex-1 !shrink gap-0 overflow-hidden py-0">
        <div className="flex shrink-0 items-stretch">
          <div className="flex items-center border-r px-1.5">
            <Select
              items={filterItems}
              value={filter}
              onValueChange={(value) => {
                setFilter(value ?? filterKeys[0])
                setPage(1)
              }}
            >
              <SelectTrigger className="h-11 w-auto gap-1.5 border-0 bg-transparent px-2.5 font-medium text-foreground shadow-none focus-visible:ring-0 dark:bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(filterItems).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className="h-11 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
            />
          </div>
          <div className="flex items-center border-l px-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Configurar columnas"
                  />
                }
              >
                <Columns3 />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Columnas</DropdownMenuLabel>
                  {columns.map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.key}
                      checked={!hiddenColumns.has(col.key)}
                      onCheckedChange={() => toggleColumn(col.key)}
                      closeOnClick={false}
                    >
                      {col.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Table className="data-table table-sticky-header table-sticky-col">
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">
                <Checkbox
                  checked={allPageSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Seleccionar todos"
                />
              </TableHead>
              <TableHead className={primaryHeadClass}>{primaryHeader}</TableHead>
              {visibleColumns.map((col) => (
                <TableHead key={col.key} className={col.headClass}>
                  {col.label}
                </TableHead>
              ))}
              {rowActions && <TableHead className="w-10" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>Sin resultados</EmptyTitle>
                      <EmptyDescription>
                        No hay {entityPlural} que coincidan con tu búsqueda.
                        Intenta con otros filtros.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row) => {
                const id = getRowId(row)
                return (
                  <TableRow
                    key={id}
                    className={onRowClick ? "cursor-pointer" : undefined}
                    data-state={selected.has(id) ? "selected" : undefined}
                    data-cancelled={isRowCancelled?.(row) ? "" : undefined}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    <TableCell
                      className="pl-4"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Checkbox
                        checked={selected.has(id)}
                        onCheckedChange={() => toggleRow(id)}
                        aria-label={`Seleccionar ${id}`}
                      />
                    </TableCell>
                    <TableCell>{primaryCell(row)}</TableCell>
                    {visibleColumns.map((col) => (
                      <TableCell key={col.key} className={col.cellClass}>
                        {col.cell(row)}
                      </TableCell>
                    ))}
                    {rowActions && (
                      <TableCell onClick={(event) => event.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Acciones"
                              />
                            }
                          >
                            <MoreHorizontal />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {rowActions(row)}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>

        {/* Pie dentro de la card: fila con el fondo del encabezado — resumen
            de selección + filas por página + paginación con chevrons */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-t bg-table-header px-4 py-2.5 text-sm text-muted-foreground">
          <span className="truncate">
            {selected.size} de {filtered.length} {entityPlural} seleccionados
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Filas por página</span>
              <Select
                items={PAGE_SIZES}
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value ?? 25))
                  setPage(1)
                }}
              >
                <SelectTrigger size="sm" className="w-auto gap-1 bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.keys(PAGE_SIZES).map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <span className="hidden whitespace-nowrap sm:inline">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Página anterior"
                className="bg-card"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Página siguiente"
                className="bg-card"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  )
}
