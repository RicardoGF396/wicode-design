import { useMemo, useState, type ReactNode } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Columns3,
  Download,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
} from "lucide-react"
import {
  formatCurrency,
  formatDate,
  orders,
  customerMetrics,
  type Order,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { PageActions } from "@/components/layout/page-actions"
import { PeriodFilter } from "@/components/data-table/period-filter"
import { Sparkline } from "@/components/dashboard/sparkline"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Customer = {
  name: string
  email: string
  address: string
  segment: string
  orders: Order[]
  totalSpent: number
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

const segmentItems: Record<string, string> = {
  todos: "Todos",
  vip: "VIP",
  mayoreo: "Mayoreo",
  frágil: "Frágil",
}

const pageSizeItems: Record<string, string> = {
  "10": "10",
  "25": "25",
  "50": "50",
  "100": "100",
}

// Columnas configurables (mismo patrón que Pedidos); "Cliente" es fija.
type ColumnDef = {
  key: string
  label: string
  headClass?: string
  cellClass?: string
  cell: (customer: Customer) => ReactNode
}

const columns: ColumnDef[] = [
  {
    key: "correo",
    label: "Correo",
    headClass: "min-w-56",
    cellClass: "text-muted-foreground",
    cell: (c) => c.email,
  },
  { key: "ubicacion", label: "Ubicación", headClass: "min-w-56", cell: (c) => c.address },
  {
    key: "segmento",
    label: "Segmento",
    headClass: "min-w-28",
    cell: (c) =>
      c.segment ? (
        <Badge
          variant="secondary"
          className="bg-badge-neutral font-normal text-foreground capitalize"
        >
          {c.segment}
        </Badge>
      ) : null,
  },
  {
    key: "pedidos",
    label: "Pedidos",
    headClass: "min-w-24",
    cellClass: "tabular-nums",
    cell: (c) => c.orders.length,
  },
  {
    key: "gastado",
    label: "Total gastado",
    headClass: "min-w-32 text-right",
    cellClass: "text-right tabular-nums",
    cell: (c) => formatCurrency(c.totalSpent),
  },
]

export function DrawerDetailPage() {
  const customers = useMemo<Customer[]>(() => {
    const byEmail = new Map<string, Customer>()
    for (const order of orders) {
      const existing = byEmail.get(order.email)
      if (existing) {
        existing.orders.push(order)
        existing.totalSpent += order.total
        if (!existing.segment && order.tags) existing.segment = order.tags
      } else {
        byEmail.set(order.email, {
          name: order.customer,
          email: order.email,
          address: order.address,
          segment: order.tags,
          orders: [order],
          totalSpent: order.total,
        })
      }
    }
    return [...byEmail.values()].sort((a, b) => b.totalSpent - a.totalSpent)
  }, [])

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [search, setSearch] = useState("")
  const [segment, setSegment] = useState("todos")
  const [period, setPeriod] = useState("30d")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [checked, setChecked] = useState<Set<string>>(new Set())
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
    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase())
      const matchesSegment = segment === "todos" || customer.segment === segment
      return matchesSearch && matchesSegment
    })
  }, [customers, search, segment])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const allPageChecked =
    pageRows.length > 0 && pageRows.every((row) => checked.has(row.email))

  const toggleAll = () => {
    const next = new Set(checked)
    if (allPageChecked) {
      pageRows.forEach((row) => next.delete(row.email))
    } else {
      pageRows.forEach((row) => next.add(row.email))
    }
    setChecked(next)
  }

  const toggleRow = (email: string) => {
    const next = new Set(checked)
    if (next.has(email)) {
      next.delete(email)
    } else {
      next.add(email)
    }
    setChecked(next)
  }

  return (
    <>
      <PageActions>
        <Button variant="outline">
          <Download data-icon="inline-start" />
          Exportar
        </Button>
        <Button>
          <Plus data-icon="inline-start" />
          Agregar cliente
        </Button>
      </PageActions>

      {/* Métricas del periodo (mismo patrón que Pedidos) */}
      <Card className="flex-row items-stretch gap-0 py-0">
        <div className="flex shrink-0 items-center border-r px-2">
          <PeriodFilter value={period} onValueChange={setPeriod} />
        </div>
        {customerMetrics.map((metric, index) => (
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

      {/* Card única: filtro integrado + tabla; el clic en fila abre el drawer */}
      <Card className="min-h-0 flex-1 !shrink gap-0 overflow-hidden py-0">
        <div className="flex shrink-0 items-stretch">
          <div className="flex items-center border-r px-1.5">
            <Select
              items={segmentItems}
              value={segment}
              onValueChange={(value) => {
                setSegment(value ?? "todos")
                setPage(1)
              }}
            >
              <SelectTrigger className="h-11 w-auto gap-1.5 border-0 bg-transparent px-2.5 font-medium text-foreground shadow-none focus-visible:ring-0 dark:bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(segmentItems).map(([value, label]) => (
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
              placeholder="Buscar y filtrar"
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
                  checked={allPageChecked}
                  onCheckedChange={toggleAll}
                  aria-label="Seleccionar todos"
                />
              </TableHead>
              <TableHead className="min-w-56">Cliente</TableHead>
              {visibleColumns.map((col) => (
                <TableHead key={col.key} className={col.headClass}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 2}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>Sin resultados</EmptyTitle>
                      <EmptyDescription>
                        No hay clientes que coincidan con tu búsqueda. Intenta
                        con otros filtros.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((customer) => (
                <TableRow
                  key={customer.email}
                  className="cursor-pointer"
                  data-state={checked.has(customer.email) ? "selected" : undefined}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <TableCell
                    className="pl-4"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Checkbox
                      checked={checked.has(customer.email)}
                      onCheckedChange={() => toggleRow(customer.email)}
                      aria-label={`Seleccionar ${customer.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-6">
                        <AvatarFallback className="text-[10px]">
                          {initials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{customer.name}</span>
                    </div>
                  </TableCell>
                  {visibleColumns.map((col) => (
                    <TableCell key={col.key} className={col.cellClass}>
                      {col.cell(customer)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pie dentro de la card: fondo del encabezado + paginación con chevrons */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-t bg-table-header px-4 py-2.5 text-sm text-muted-foreground">
          <span className="truncate">
            {checked.size} de {filtered.length} clientes seleccionados
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

      {/* Drawer de detalle: un solo Sheet controlado para toda la lista */}
      <Sheet
        open={selectedCustomer !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedCustomer(null)
        }}
      >
        {/* Drawer flotante: márgenes a los lados y esquinas redondeadas.
            Se sobrescribe la posición base con la MISMA variante data-[side=right] */}
        <SheetContent className="gap-0 overflow-hidden rounded-xl p-0 data-[side=right]:inset-y-3 data-[side=right]:right-3 data-[side=right]:h-auto data-[side=right]:border data-[side=right]:sm:max-w-xl">
          {selectedCustomer && (
            <>
              {/* Header con borde inferior: avatar + nombre + segmento */}
              <SheetHeader className="flex-row items-center gap-3 border-b p-6 pr-12">
                <Avatar className="size-11">
                  <AvatarFallback>
                    {initials(selectedCustomer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <SheetTitle className="truncate">
                      {selectedCustomer.name}
                    </SheetTitle>
                    {selectedCustomer.segment && (
                      <Badge
                        variant="secondary"
                        className="shrink-0 bg-badge-neutral font-normal text-foreground capitalize"
                      >
                        {selectedCustomer.segment}
                      </Badge>
                    )}
                  </div>
                  <SheetDescription>Cliente desde octubre 2026</SheetDescription>
                </div>
              </SheetHeader>

              <div className="flex-1 space-y-6 overflow-y-auto p-6">
                {/* Resumen rápido */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 rounded-lg border bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground">Pedidos</p>
                    <p className="text-2xl font-medium tabular-nums">
                      {selectedCustomer.orders.length}
                    </p>
                  </div>
                  <div className="space-y-1 rounded-lg border bg-muted/40 p-4">
                    <p className="text-xs text-muted-foreground">
                      Total gastado
                    </p>
                    <p className="text-2xl font-medium tabular-nums">
                      {formatCurrency(selectedCustomer.totalSpent)}
                    </p>
                  </div>
                </div>

                {/* Datos de contacto en tarjeta con divisores */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Contacto</h3>
                  <div className="divide-y overflow-hidden rounded-lg border text-sm">
                    <p className="flex items-center gap-3 px-4 py-3">
                      <Mail className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{selectedCustomer.email}</span>
                    </p>
                    <p className="flex items-center gap-3 px-4 py-3">
                      <Phone className="size-4 shrink-0 text-muted-foreground" />
                      +52 55 0000 0000
                    </p>
                    <p className="flex items-center gap-3 px-4 py-3">
                      <MapPin className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{selectedCustomer.address}</span>
                    </p>
                  </div>
                </div>

                {/* Pestañas de contenido secundario */}
                <Tabs defaultValue="pedidos">
                  <TabsList className="w-full">
                    <TabsTrigger value="pedidos" className="flex-1">
                      Pedidos
                    </TabsTrigger>
                    <TabsTrigger value="actividad" className="flex-1">
                      Actividad
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="pedidos" className="space-y-3 pt-3">
                    {selectedCustomer.orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50"
                      >
                        <div className="grid">
                          <span className="font-medium">{order.id}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(order.date)} · {order.items}{" "}
                            {order.items === 1 ? "artículo" : "artículos"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <OrderStatusBadge status={order.status} />
                          <span className="font-medium tabular-nums">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="actividad" className="pt-3">
                    <div className="divide-y overflow-hidden rounded-lg border text-sm">
                      {[
                        { label: "Pedido creado", date: "18 oct 2026" },
                        { label: "Correo de bienvenida enviado", date: "17 oct 2026" },
                        { label: "Cuenta creada", date: "16 oct 2026" },
                      ].map((event) => (
                        <div
                          key={event.label}
                          className="flex items-center justify-between px-4 py-3"
                        >
                          <span>{event.label}</span>
                          <span className="text-xs text-muted-foreground tabular-nums">
                            {event.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
