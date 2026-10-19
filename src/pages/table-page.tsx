import { useMemo, useState, type ReactNode } from "react"
import {
  Archive,
  CalendarDays,
  ChevronDown,
  Columns3,
  Copy,
  Download,
  MoreHorizontal,
  Pencil,
  Plus,
  Printer,
  Search,
  Tags,
  Trash2,
  Upload,
} from "lucide-react"
import { toast } from "sonner"

import {
  formatCurrency,
  formatDate,
  orders,
  todayOrderMetrics,
  type Order,
  type OrderStatus,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { PageActions } from "@/components/layout/page-actions"
import { Sparkline } from "@/components/dashboard/sparkline"
import { OrderFulfillmentBadge } from "@/components/orders/order-fulfillment-badge"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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

const pageSizeItems: Record<string, string> = {
  "10": "10",
  "25": "25",
  "50": "50",
  "100": "100",
}

type StatusFilter = OrderStatus | "todos"

const statusFilterItems: Record<StatusFilter, string> = {
  todos: "Todos",
  pagado: "Pagados",
  pendiente: "Pendientes",
  enviado: "Enviados",
  cancelado: "Cancelados",
}

// Columnas configurables: el selector de columnas del filtro las muestra u
// oculta. "Pedido" y las acciones son fijas y no aparecen en el selector.
type ColumnDef = {
  key: string
  label: string
  headClass?: string
  cellClass?: string
  cell: (order: Order) => ReactNode
}

const columns: ColumnDef[] = [
  { key: "fecha", label: "Fecha", headClass: "min-w-32", cell: (o) => formatDate(o.date) },
  { key: "cliente", label: "Cliente", headClass: "min-w-48", cell: (o) => o.customer },
  { key: "canal", label: "Canal", headClass: "min-w-40", cell: (o) => o.channel },
  {
    key: "total",
    label: "Total",
    headClass: "min-w-28 text-right",
    cellClass: "text-right tabular-nums",
    cell: (o) => formatCurrency(o.total),
  },
  {
    key: "pago",
    label: "Estado del pago",
    headClass: "min-w-36",
    cell: (o) => <OrderStatusBadge status={o.status} />,
  },
  {
    key: "preparacion",
    label: "Preparación",
    headClass: "min-w-36",
    cell: (o) => <OrderFulfillmentBadge status={o.fulfillment} />,
  },
  {
    key: "articulos",
    label: "Artículos",
    headClass: "min-w-28",
    cellClass: "tabular-nums",
    cell: (o) => `${o.items} ${o.items === 1 ? "artículo" : "artículos"}`,
  },
  { key: "entrega", label: "Forma de entrega", headClass: "min-w-40", cell: (o) => o.delivery },
  { key: "destino", label: "Destino", headClass: "min-w-32", cell: (o) => o.destination },
  {
    key: "etiquetas",
    label: "Etiquetas",
    headClass: "min-w-28",
    cell: (o) =>
      o.tags ? (
        <Badge
          variant="secondary"
          className="bg-badge-neutral font-normal text-foreground capitalize"
        >
          {o.tags}
        </Badge>
      ) : null,
  },
]

export function TablePage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set())

  const visibleColumns = columns.filter((col) => !hiddenColumns.has(col.key))

  const toggleColumn = (key: string) => {
    const next = new Set(hiddenColumns)
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    setHiddenColumns(next)
  }

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.id.includes(search)
      const matchesStatus =
        statusFilter === "todos" || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const allPageSelected =
    pageRows.length > 0 && pageRows.every((row) => selected.has(row.id))

  const toggleAll = () => {
    const next = new Set(selected)
    if (allPageSelected) {
      pageRows.forEach((row) => next.delete(row.id))
    } else {
      pageRows.forEach((row) => next.add(row.id))
    }
    setSelected(next)
  }

  const toggleRow = (id: string) => {
    const next = new Set(selected)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelected(next)
  }

  return (
    <>
      {/* Acciones principales: viven en el header del layout. Las acciones
          secundarias se agrupan en "Más acciones". */}
      <PageActions>
        <Button variant="outline">
          <Download data-icon="inline-start" />
          Exportar
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            Más acciones
            <ChevronDown data-icon="inline-end" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => toast.info("Importando pedidos…")}>
              <Upload />
              Importar pedidos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Preparando impresión…")}>
              <Printer />
              Imprimir lista
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.info("Administrando etiquetas…")}
            >
              <Tags />
              Administrar etiquetas
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => toast.success("Pedidos seleccionados archivados")}
            >
              <Archive />
              Archivar seleccionados
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button>
          <Plus data-icon="inline-start" />
          Crear pedido
        </Button>
      </PageActions>

      {/* Métricas del periodo (patrón Orders): card blanca segmentada con
          chip de fecha, indicadores con subrayado punteado y sparkline */}
      <Card className="flex-row items-stretch gap-0 py-0">
        <div className="flex shrink-0 items-center gap-2 border-r px-5 text-sm">
          <CalendarDays className="size-4 text-muted-foreground" />
          Hoy
        </div>
        {todayOrderMetrics.map((metric, index) => (
          <div
            key={metric.label}
            className={cn(
              "flex min-w-0 flex-1 items-center justify-between gap-3 px-4 py-3",
              index > 0 && "border-l"
            )}
          >
            <div className="min-w-0 space-y-1">
              {/* La etiqueta puede truncarse: el tooltip muestra el nombre
                  completo de la métrica */}
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
              <p className="text-sm font-semibold tabular-nums">
                {metric.value}
              </p>
            </div>
            <Sparkline data={metric.spark} className="hidden xl:block" />
          </div>
        ))}
      </Card>

      {/* Card única: barra de filtro integrada arriba de la tabla.
          flex-1 + !shrink + min-h-0: la tabla ocupa la altura disponible y
          scrollea por dentro, dejando la paginación siempre visible. */}
      <Card className="min-h-0 flex-1 !shrink gap-0 overflow-hidden py-0">
        {/* El borde inferior lo pone el borde superior del thead */}
        <div className="flex shrink-0 items-stretch">
          {/* Filtro de estado */}
          <div className="flex items-center border-r px-1.5">
            <Select
              items={statusFilterItems}
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter((value as StatusFilter) ?? "todos")
                setPage(1)
              }}
            >
              <SelectTrigger className="h-11 w-auto gap-1.5 border-0 bg-transparent px-2.5 font-medium text-foreground shadow-none focus-visible:ring-0 dark:bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(statusFilterItems).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* Búsqueda */}
          <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Input
              placeholder="Buscar y filtrar"
              className="h-11 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
            />
          </div>
          {/* Selector de columnas visibles */}
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

        {/* Sticky: header fijo al hacer scroll vertical; checkbox + folio
            fijos al hacer scroll horizontal */}
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
              <TableHead className="min-w-24">Pedido</TableHead>
              {visibleColumns.map((col) => (
                <TableHead key={col.key} className={col.headClass}>
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 3}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>Sin resultados</EmptyTitle>
                      <EmptyDescription>
                        No hay pedidos que coincidan con tu búsqueda. Intenta
                        con otros filtros.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((order) => (
                <TableRow
                  key={order.id}
                  data-state={selected.has(order.id) ? "selected" : undefined}
                  data-cancelled={order.status === "cancelado" ? "" : undefined}
                >
                  <TableCell className="pl-4">
                    <Checkbox
                      checked={selected.has(order.id)}
                      onCheckedChange={() => toggleRow(order.id)}
                      aria-label={`Seleccionar ${order.id}`}
                    />
                  </TableCell>
                  <TableCell>{order.id}</TableCell>
                  {visibleColumns.map((col) => (
                    <TableCell key={col.key} className={col.cellClass}>
                      {col.cell(order)}
                    </TableCell>
                  ))}
                  <TableCell>
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
                        <DropdownMenuItem
                          onClick={() => toast.info(`Editando ${order.id}`)}
                        >
                          <Pencil />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(order.id)
                            toast.success("Folio copiado")
                          }}
                        >
                          <Copy />
                          Copiar folio
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <DropdownMenuItem
                                variant="destructive"
                                closeOnClick={false}
                              />
                            }
                          >
                            <Trash2 />
                            Eliminar
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Eliminar el pedido {order.id}?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. El pedido se
                                eliminará permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  toast.success(`Pedido ${order.id} eliminado`)
                                }
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pie de tabla: resumen de selección + paginación */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {selected.size} de {filtered.length} pedidos seleccionados
        </span>
        <div className="flex items-center gap-2">
          <span>Filas por página</span>
          <Select
            items={pageSizeItems}
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
                {Object.keys(pageSizeItems).map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <span className="ml-2">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </>
  )
}
