import { useMemo, useState, type ReactNode } from "react"
import {
  Archive,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Copy,
  Download,
  ListFilter,
  MoreHorizontal,
  Pencil,
  Plus,
  Printer,
  Search,
  Tags,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import { toast } from "sonner"

import {
  fulfillmentLabel,
  formatCurrency,
  formatDate,
  orders,
  orderStatusLabel,
  todayOrderMetrics,
  type FulfillmentStatus,
  type Order,
  type OrderStatus,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { LoadingOverlay } from "@/components/layout/loading-overlay"
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
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

const channelOptions = [
  "Tienda en línea",
  "Punto de venta",
  "Instagram",
  "Facebook",
]

const statusItems: Record<string, string> = {
  pagado: orderStatusLabel.pagado,
  pendiente: orderStatusLabel.pendiente,
  enviado: orderStatusLabel.enviado,
  cancelado: orderStatusLabel.cancelado,
}
const fulfillmentItems: Record<string, string> = {
  preparado: fulfillmentLabel.preparado,
  sin_preparar: fulfillmentLabel.sin_preparar,
  no_requerido: fulfillmentLabel.no_requerido,
}
const periodItems: Record<string, string> = {
  hoy: "Hoy",
  "7d": "Últimos 7 días",
  "30d": "Últimos 30 días",
  mes: "Este mes",
}

// Dialog para crear o editar un pedido. Se remonta por `key` para resetear.
function OrderFormDialog({
  open,
  onOpenChange,
  order,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
}) {
  const isEdit = Boolean(order)
  const [customer, setCustomer] = useState(order?.customer ?? "")
  const [channel, setChannel] = useState(order?.channel ?? "Tienda en línea")
  const [total, setTotal] = useState(order ? String(order.total) : "")
  const [status, setStatus] = useState<string>(order?.status ?? "pendiente")
  const [fulfillment, setFulfillment] = useState<string>(
    order?.fulfillment ?? "sin_preparar"
  )
  const [saving, setSaving] = useState(false)

  const submit = () => {
    if (!customer.trim() || !total) {
      toast.error("Captura el cliente y el total.")
      return
    }
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      onOpenChange(false)
      toast.success(
        isEdit
          ? `Pedido ${order?.id} actualizado`
          : `Pedido creado para ${customer}`
      )
    }, 700)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Editar pedido ${order?.id}` : "Crear pedido"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Actualiza los datos del pedido."
              : "Captura un nuevo pedido manualmente."}
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="o-customer">Cliente</FieldLabel>
            <Input
              id="o-customer"
              placeholder="Nombre del cliente"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Canal</FieldLabel>
              <Select
                items={Object.fromEntries(channelOptions.map((c) => [c, c]))}
                value={channel}
                onValueChange={(v) => setChannel(v ?? "Tienda en línea")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {channelOptions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="o-total">Total</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>$</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="o-total"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                />
              </InputGroup>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Estado del pago</FieldLabel>
              <Select items={statusItems} value={status} onValueChange={(v) => setStatus(v ?? "pendiente")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(statusItems).map(([v, label]) => (
                      <SelectItem key={v} value={v}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Preparación</FieldLabel>
              <Select
                items={fulfillmentItems}
                value={fulfillment}
                onValueChange={(v) => setFulfillment(v ?? "sin_preparar")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.entries(fulfillmentItems).map(([v, label]) => (
                      <SelectItem key={v} value={v}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </FieldGroup>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
          <Button onClick={submit} disabled={saving}>
            {isEdit ? "Guardar cambios" : "Crear pedido"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function TablePage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos")
  const [channelFilter, setChannelFilter] = useState<Set<string>>(new Set())
  const [fulfillmentFilter, setFulfillmentFilter] = useState<Set<FulfillmentStatus>>(
    new Set()
  )
  const [period, setPeriod] = useState("hoy")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set())
  const [orderDialog, setOrderDialog] = useState<{ open: boolean; order: Order | null }>(
    { open: false, order: null }
  )
  const [importing, setImporting] = useState(false)

  // Acción bloqueante: muestra el overlay de carga mientras "importa"
  const importOrders = () => {
    setImporting(true)
    setTimeout(() => {
      setImporting(false)
      toast.success("Se importaron 24 pedidos")
    }, 2200)
  }

  const activeFilters = channelFilter.size + fulfillmentFilter.size

  const toggleChannel = (channel: string) => {
    const next = new Set(channelFilter)
    next.has(channel) ? next.delete(channel) : next.add(channel)
    setChannelFilter(next)
    setPage(1)
  }
  const toggleFulfillment = (value: FulfillmentStatus) => {
    const next = new Set(fulfillmentFilter)
    next.has(value) ? next.delete(value) : next.add(value)
    setFulfillmentFilter(next)
    setPage(1)
  }
  const clearFilters = () => {
    setChannelFilter(new Set())
    setFulfillmentFilter(new Set())
    setPage(1)
  }

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
      const matchesChannel =
        channelFilter.size === 0 || channelFilter.has(order.channel)
      const matchesFulfillment =
        fulfillmentFilter.size === 0 || fulfillmentFilter.has(order.fulfillment)
      return (
        matchesSearch && matchesStatus && matchesChannel && matchesFulfillment
      )
    })
  }, [search, statusFilter, channelFilter, fulfillmentFilter])

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
            <DropdownMenuItem onClick={importOrders}>
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
        <Button onClick={() => setOrderDialog({ open: true, order: null })}>
          <Plus data-icon="inline-start" />
          Crear pedido
        </Button>
      </PageActions>

      {/* Métricas del periodo (patrón Orders): card blanca segmentada con
          chip de fecha, indicadores con subrayado punteado y sparkline */}
      <Card className="flex-row items-stretch gap-0 py-0">
        <div className="flex shrink-0 items-center border-r px-2">
          <Select
            items={periodItems}
            value={period}
            onValueChange={(v) => setPeriod(v ?? "hoy")}
          >
            <SelectTrigger
              size="sm"
              className="w-auto gap-1.5 border-0 bg-transparent font-medium text-foreground shadow-none focus-visible:ring-0 dark:bg-transparent"
            >
              <CalendarDays className="size-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(periodItems).map(([v, label]) => (
                  <SelectItem key={v} value={v}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
              <p className="text-sm font-medium tabular-nums">
                {metric.value}
              </p>
            </div>
            <Sparkline data={metric.spark} interactive className="hidden xl:block" />
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
          {/* Filtros de la tabla (canal + preparación) */}
          <div className="flex items-center border-l px-1.5">
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Filtrar"
                    className="relative"
                  />
                }
              >
                <ListFilter />
                {activeFilters > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {activeFilters}
                  </span>
                )}
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64 p-0">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm font-medium">Filtros</span>
                  {activeFilters > 0 && (
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-muted-foreground"
                      onClick={clearFilters}
                    >
                      <X data-icon="inline-start" />
                      Limpiar
                    </Button>
                  )}
                </div>
                <div className="max-h-80 space-y-4 overflow-y-auto p-3">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Canal
                    </p>
                    {channelOptions.map((channel) => (
                      <label
                        key={channel}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={channelFilter.has(channel)}
                          onCheckedChange={() => toggleChannel(channel)}
                        />
                        {channel}
                      </label>
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Preparación
                    </p>
                    {(
                      Object.keys(fulfillmentItems) as FulfillmentStatus[]
                    ).map((value) => (
                      <label
                        key={value}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={fulfillmentFilter.has(value)}
                          onCheckedChange={() => toggleFulfillment(value)}
                        />
                        {fulfillmentItems[value]}
                      </label>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
                          onClick={() => setOrderDialog({ open: true, order })}
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

        {/* Pie dentro de la card: fondo del encabezado + paginación con chevrons */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-t bg-table-header px-4 py-2.5 text-sm text-muted-foreground">
          <span className="truncate">
            {selected.size} de {filtered.length} pedidos seleccionados
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Filas por página</span>
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

      {/* Overlay de carga a pantalla completa para acciones bloqueantes */}
      <LoadingOverlay open={importing} label="Importando pedidos…" />

      {/* Dialog de crear / editar pedido (remontado por key para resetear) */}
      <OrderFormDialog
        key={orderDialog.order?.id ?? "nuevo"}
        open={orderDialog.open}
        order={orderDialog.order}
        onOpenChange={(open) =>
          setOrderDialog((prev) => ({ ...prev, open }))
        }
      />
    </>
  )
}
