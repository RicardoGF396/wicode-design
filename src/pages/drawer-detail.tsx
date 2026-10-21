import { useMemo, useState, type ReactNode } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Download,
  EllipsisVertical,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Tag,
} from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
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

// Segmentos seleccionables al dar de alta un cliente (sin la opción "Todos")
const customerSegments: Record<string, string> = {
  vip: "VIP",
  mayoreo: "Mayoreo",
  frágil: "Frágil",
}

// Alta de cliente: nombre y correo obligatorios; dirección y segmento opcionales
const customerFormSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.email("Correo inválido"),
  address: z.string().optional(),
  segment: z.string(),
})
type CustomerFormValues = z.infer<typeof customerFormSchema>

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
  const derivedCustomers = useMemo<Customer[]>(() => {
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

  // Clientes dados de alta en la sesión (modal). Se muestran primero.
  const [addedCustomers, setAddedCustomers] = useState<Customer[]>([])
  const customers = useMemo(
    () => [...addedCustomers, ...derivedCustomers],
    [addedCustomers, derivedCustomers]
  )

  const [addOpen, setAddOpen] = useState(false)
  const addForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: { name: "", email: "", address: "", segment: "" },
  })
  const addErrors = addForm.formState.errors

  const onAddCustomer = (values: CustomerFormValues) => {
    setAddedCustomers((prev) => [
      {
        name: values.name,
        email: values.email,
        address: values.address ?? "",
        segment: values.segment,
        orders: [],
        totalSpent: 0,
      },
      ...prev,
    ])
    toast.success(`Cliente "${values.name}" agregado`)
    setAddOpen(false)
    addForm.reset()
  }

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
        <Button onClick={() => setAddOpen(true)}>
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
        <SheetContent className="gap-0 overflow-hidden rounded-xl p-0 data-[side=right]:inset-y-3 data-[side=right]:right-3 data-[side=right]:h-auto data-[side=right]:border data-[side=right]:sm:max-w-md">
          {selectedCustomer && (
            <div className="flex h-full flex-col overflow-y-auto">
              {/* Barra superior: menú de acciones a la izquierda; la X de cerrar
                  la pinta el propio SheetContent a la derecha */}
              <div className="flex items-center px-4 pt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Acciones del cliente"
                      />
                    }
                  >
                    <EllipsisVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-fit">
                    <DropdownMenuItem onClick={() => toast.info("Crear pedido")}>
                      <Plus />
                      Crear pedido
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info("Enviar correo")}>
                      <Mail />
                      Enviar correo
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => toast.info("Archivar cliente")}
                    >
                      <Archive />
                      Archivar cliente
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Identidad centrada */}
              <SheetHeader className="items-center gap-0 border-0 px-6 pt-1 pb-6 text-center">
                <Avatar className="size-16">
                  <AvatarFallback className="bg-primary text-lg text-primary-foreground">
                    {initials(selectedCustomer.name)}
                  </AvatarFallback>
                </Avatar>
                <SheetTitle className="mt-3 text-xl">
                  {selectedCustomer.name}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Detalle del cliente {selectedCustomer.name}
                </SheetDescription>
                <button
                  type="button"
                  onClick={() => toast.info(`Editar ${selectedCustomer.name}`)}
                  className="mt-1 text-sm font-medium text-primary hover:underline"
                >
                  Editar información
                </button>
              </SheetHeader>

              {/* Métricas 2-up */}
              <div className="grid grid-cols-2 gap-3 px-6">
                <div className="rounded-xl border p-4">
                  <p className="text-sm text-muted-foreground">Total gastado</p>
                  <p className="text-lg font-medium tabular-nums">
                    {formatCurrency(selectedCustomer.totalSpent)}
                  </p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="text-sm text-muted-foreground">Pedidos</p>
                  <p className="text-lg font-medium tabular-nums">
                    {selectedCustomer.orders.length}
                  </p>
                </div>
              </div>

              {/* Sección: Detalles — el ícono indica el campo; solo se muestra el valor */}
              <div className="mt-6">
                <h3 className="px-6 pb-2 text-base font-medium">Detalles</h3>
                <div className="divide-y border-y">
                  {[
                    { icon: Mail, label: "Correo", value: selectedCustomer.email },
                    { icon: Phone, label: "Teléfono", value: "+52 55 0000 0000" },
                    {
                      icon: MapPin,
                      label: "Dirección",
                      value: selectedCustomer.address || "—",
                    },
                    {
                      icon: Tag,
                      label: "Segmento",
                      value: selectedCustomer.segment
                        ? customerSegments[selectedCustomer.segment] ??
                          selectedCustomer.segment
                        : "Sin segmento",
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      aria-label={row.label}
                      className="flex items-center gap-3 px-6 py-3 text-sm"
                    >
                      <row.icon
                        aria-hidden
                        className="size-4 shrink-0 text-muted-foreground"
                      />
                      <span className="min-w-0 truncate">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sección: Pedidos — tabla data-table con margen respecto a los bordes */}
              <div className="mt-6 px-6 pb-6">
                <h3 className="pb-2 text-base font-medium">Pedidos</h3>
                {selectedCustomer.orders.length > 0 ? (
                  <div className="overflow-hidden rounded-lg border">
                    <Table className="data-table">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="pl-3">Pedido</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="pr-3 text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCustomer.orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="pl-3">
                              <p className="font-medium">{order.id}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(order.date)}
                              </p>
                            </TableCell>
                            <TableCell>
                              <OrderStatusBadge status={order.status} />
                            </TableCell>
                            <TableCell className="pr-3 text-right tabular-nums">
                              {formatCurrency(order.total)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="rounded-lg border px-4 py-4 text-sm text-muted-foreground">
                    Este cliente aún no tiene pedidos.
                  </p>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Modal: alta de cliente (react-hook-form + zod) */}
      <Dialog
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open)
          if (!open) addForm.reset()
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar cliente</DialogTitle>
            <DialogDescription>
              Registra un nuevo cliente en tu directorio.
            </DialogDescription>
          </DialogHeader>
          <form
            id="add-customer-form"
            onSubmit={addForm.handleSubmit(onAddCustomer)}
            noValidate
          >
            <FieldGroup>
              <Field data-invalid={!!addErrors.name || undefined}>
                <FieldLabel htmlFor="customer-name">Nombre</FieldLabel>
                <Input
                  id="customer-name"
                  placeholder="María González"
                  aria-invalid={!!addErrors.name}
                  {...addForm.register("name")}
                />
                <FieldError errors={addErrors.name ? [addErrors.name] : undefined} />
              </Field>
              <Field data-invalid={!!addErrors.email || undefined}>
                <FieldLabel htmlFor="customer-email">Correo</FieldLabel>
                <Input
                  id="customer-email"
                  type="email"
                  placeholder="maria@example.com"
                  aria-invalid={!!addErrors.email}
                  {...addForm.register("email")}
                />
                <FieldError
                  errors={addErrors.email ? [addErrors.email] : undefined}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="customer-address">
                  Dirección (opcional)
                </FieldLabel>
                <Input
                  id="customer-address"
                  placeholder="Av. Reforma 123, CDMX"
                  {...addForm.register("address")}
                />
              </Field>
              <Field>
                <FieldLabel>Segmento</FieldLabel>
                <Controller
                  control={addForm.control}
                  name="segment"
                  render={({ field }) => (
                    <Select
                      items={customerSegments}
                      value={field.value || null}
                      onValueChange={(v) => field.onChange(v ?? "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sin segmento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {Object.entries(customerSegments).map(([v, label]) => (
                            <SelectItem key={v} value={v}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </FieldGroup>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="add-customer-form">
              Agregar cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
