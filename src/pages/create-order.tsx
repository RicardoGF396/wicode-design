import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Check,
  ChevronsUpDown,
  Plus,
  Search,
  ShoppingCart,
  TriangleAlert,
  X,
} from "lucide-react"
import { toast } from "sonner"

import {
  customers,
  formatCurrency,
  inventory,
  orderTypes,
  saleTypes,
  salesReps,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { PageActions } from "@/components/layout/page-actions"
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
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

const pickerFilters: Record<string, string> = {
  todo: "Todo",
  stock: "En stock",
  agotado: "Agotado",
}

type CartLine = {
  sku: string
  name: string
  price: number
  qty: number
  available: number
}

const TAX_RATE = 0.16

export function CreateOrderPage() {
  const navigate = useNavigate()

  // Detalles del pedido
  const [customer, setCustomer] = useState("")
  const [customerOpen, setCustomerOpen] = useState(false)
  const [rep, setRep] = useState("")
  const [secondaryRep, setSecondaryRep] = useState("")
  const [orderType, setOrderType] = useState("venta")
  const [saleType, setSaleType] = useState("contado")
  const [notes, setNotes] = useState("")

  // Carrito
  const [cart, setCart] = useState<CartLine[]>([])
  const [discount, setDiscount] = useState("")
  const [shipping, setShipping] = useState("")
  const [taxable, setTaxable] = useState(true)

  // Selector de productos
  const [productsOpen, setProductsOpen] = useState(false)
  const [pickerSearch, setPickerSearch] = useState("")
  const [pickerFilter, setPickerFilter] = useState("todo")
  const [pickerSelected, setPickerSelected] = useState<Set<string>>(new Set())

  const setQty = (sku: string, qty: number) =>
    setCart((prev) =>
      prev.map((line) =>
        line.sku === sku ? { ...line, qty: Math.max(1, qty) } : line
      )
    )

  const removeLine = (sku: string) =>
    setCart((prev) => prev.filter((line) => line.sku !== sku))

  const subtotal = cart.reduce((sum, line) => sum + line.price * line.qty, 0)
  const discountValue = Math.min(Number(discount) || 0, subtotal)
  const shippingValue = Number(shipping) || 0
  const taxBase = Math.max(0, subtotal - discountValue)
  const taxValue = taxable ? taxBase * TAX_RATE : 0
  const total = taxBase + shippingValue + taxValue
  const itemCount = cart.reduce((sum, line) => sum + line.qty, 0)

  // Abre el selector sincronizando la selección con el carrito actual
  const openPicker = () => {
    setPickerSelected(new Set(cart.map((line) => line.sku)))
    setPickerSearch("")
    setPickerFilter("todo")
    setProductsOpen(true)
  }

  const filteredInventory = useMemo(() => {
    const q = pickerSearch.trim().toLowerCase()
    return inventory.filter((item) => {
      const matchesText =
        !q ||
        item.product.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q)
      const matchesFilter =
        pickerFilter === "todo" ||
        (pickerFilter === "stock" ? item.available > 0 : item.available <= 0)
      return matchesText && matchesFilter
    })
  }, [pickerSearch, pickerFilter])

  const togglePick = (sku: string) =>
    setPickerSelected((prev) => {
      const next = new Set(prev)
      if (next.has(sku)) next.delete(sku)
      else next.add(sku)
      return next
    })

  const allFilteredSelected =
    filteredInventory.length > 0 &&
    filteredInventory.every((item) => pickerSelected.has(item.sku))

  const toggleAllPick = () =>
    setPickerSelected((prev) => {
      const next = new Set(prev)
      if (allFilteredSelected)
        filteredInventory.forEach((item) => next.delete(item.sku))
      else filteredInventory.forEach((item) => next.add(item.sku))
      return next
    })

  // Confirma la selección: conserva cantidades de lo ya elegido, agrega lo
  // nuevo y descarta lo que se haya deseleccionado.
  const confirmProducts = () => {
    setCart((prev) => {
      const kept = prev.filter((line) => pickerSelected.has(line.sku))
      const keptSkus = new Set(kept.map((line) => line.sku))
      const additions = inventory
        .filter((item) => pickerSelected.has(item.sku) && !keptSkus.has(item.sku))
        .map((item) => ({
          sku: item.sku,
          name: item.product,
          price: item.unitCost,
          qty: 1,
          available: item.available,
        }))
      return [...kept, ...additions]
    })
    setProductsOpen(false)
  }

  const create = () => {
    if (!customer) {
      toast.error("Selecciona un cliente.")
      return
    }
    if (cart.length === 0) {
      toast.error("Agrega al menos un producto.")
      return
    }
    toast.success(`Pedido creado para ${customer} · ${formatCurrency(total)}`)
    navigate("/table")
  }

  return (
    <>
      <PageActions>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline" />}>
            Descartar
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Descartar el pedido?</AlertDialogTitle>
              <AlertDialogDescription>
                Se perderá lo capturado. Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Seguir editando</AlertDialogCancel>
              <AlertDialogAction onClick={() => navigate("/table")}>
                Descartar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button onClick={create}>Crear pedido</Button>
      </PageActions>

      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-3">
        {/* Columna principal: productos + pago */}
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <Card className="gap-0 py-0">
            <CardHeader className="py-3">
              <CardTitle className="text-base">Productos</CardTitle>
              {cart.length > 0 && (
                <CardAction className="self-center">
                  <Button size="sm" onClick={openPicker}>
                    <Plus data-icon="inline-start" />
                    Agregar producto
                  </Button>
                </CardAction>
              )}
            </CardHeader>
            <CardContent className="p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center text-sm text-muted-foreground">
                  <ShoppingCart className="size-6" />
                  Aún no has agregado productos.
                  <Button variant="outline" size="sm" onClick={openPicker}>
                    <Plus data-icon="inline-start" />
                    Agregar producto
                  </Button>
                </div>
              ) : (
                <div>
                  {cart.map((line, i) => (
                    <div key={line.sku}>
                      {i > 0 && <Separator className="my-3" />}
                      {line.available <= 0 && (
                        <div className="mb-3 flex items-center gap-2 rounded-lg bg-badge-warning/25 px-3 py-2 text-sm text-foreground">
                          <TriangleAlert className="size-4 shrink-0 text-warning" />
                          Este producto tiene 0 unidades en existencias.
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="size-10 shrink-0 rounded-md bg-muted" />
                        <p className="min-w-0 flex-1 truncate text-sm">
                          {line.name}
                          <span className="block font-mono text-xs text-muted-foreground">
                            {line.sku}
                          </span>
                        </p>
                        <span className="w-24 text-right text-sm tabular-nums text-primary">
                          {formatCurrency(line.price)}
                        </span>
                        <Input
                          type="number"
                          min={1}
                          aria-label={`Cantidad de ${line.name}`}
                          value={line.qty}
                          onChange={(e) =>
                            setQty(line.sku, Number(e.target.value))
                          }
                          className="h-8 w-16 text-center"
                        />
                        <span className="w-24 text-right text-sm font-medium tabular-nums">
                          {formatCurrency(line.price * line.qty)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Quitar producto"
                          onClick={() => removeLine(line.sku)}
                        >
                          <X />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumen de pago */}
          <Card className="gap-0 py-0">
            <CardHeader className="py-3">
              <CardTitle className="text-base">Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Subtotal · {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
                </span>
                <span className="tabular-nums">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Descuento</span>
                <InputGroup className="h-8 w-36">
                  <InputGroupAddon>
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    type="number"
                    placeholder="0.00"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </InputGroup>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Envío o entrega</span>
                <InputGroup className="h-8 w-36">
                  <InputGroupAddon>
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    type="number"
                    placeholder="0.00"
                    value={shipping}
                    onChange={(e) => setShipping(e.target.value)}
                  />
                </InputGroup>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={taxable}
                    onChange={(e) => setTaxable(e.target.checked)}
                    className="accent-primary"
                  />
                  IVA (16%)
                </label>
                <span className="tabular-nums">{formatCurrency(taxValue)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-base font-medium">
                <span>Total</span>
                <span className="tabular-nums">{formatCurrency(total)} MXN</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna lateral: detalles del pedido */}
        <div className="min-w-0 space-y-6">
          <Card className="gap-0 py-0">
            <CardHeader className="py-3">
              <CardTitle className="text-base">Detalles del pedido</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <FieldGroup>
                {/* Cliente: combobox con búsqueda */}
                <Field>
                  <FieldLabel>Cliente</FieldLabel>
                  <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          className="w-full justify-between font-normal"
                        />
                      }
                    >
                      <span
                        className={cn("truncate", !customer && "text-muted-foreground")}
                      >
                        {customer || "Busca o selecciona un cliente"}
                      </span>
                      <ChevronsUpDown
                        data-icon="inline-end"
                        className="text-muted-foreground"
                      />
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-(--anchor-width) p-0">
                      <Command>
                        <CommandInput placeholder="Buscar cliente…" />
                        <CommandList>
                          <CommandEmpty>Sin resultados.</CommandEmpty>
                          <CommandGroup>
                            {customers.map((name) => (
                              <CommandItem
                                key={name}
                                value={name}
                                onSelect={(value) => {
                                  setCustomer(value)
                                  setCustomerOpen(false)
                                }}
                              >
                                {name}
                                {customer === name && (
                                  <Check className="ml-auto" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </Field>

                {/* Vendedor */}
                <Field>
                  <FieldLabel>Vendedor</FieldLabel>
                  <Select
                    items={Object.fromEntries(salesReps.map((r) => [r, r]))}
                    value={rep || null}
                    onValueChange={(v) => setRep(v ?? "")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un vendedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {salesReps.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                {/* Tipo de pedido */}
                <Field>
                  <FieldLabel>Tipo de pedido</FieldLabel>
                  <Select
                    items={orderTypes}
                    value={orderType}
                    onValueChange={(v) => setOrderType(v ?? "venta")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.entries(orderTypes).map(([v, label]) => (
                          <SelectItem key={v} value={v}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                {/* Vendedor secundario (opcional) */}
                <Field>
                  <FieldLabel>Vendedor secundario (opcional)</FieldLabel>
                  <Select
                    items={Object.fromEntries(salesReps.map((r) => [r, r]))}
                    value={secondaryRep || null}
                    onValueChange={(v) => setSecondaryRep(v ?? "")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sin vendedor secundario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {salesReps
                          .filter((r) => r !== rep)
                          .map((r) => (
                            <SelectItem key={r} value={r}>
                              {r}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                {/* Tipo de venta */}
                <Field>
                  <FieldLabel>Tipo de venta</FieldLabel>
                  <Select
                    items={saleTypes}
                    value={saleType}
                    onValueChange={(v) => setSaleType(v ?? "contado")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.entries(saleTypes).map(([v, label]) => (
                          <SelectItem key={v} value={v}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Notas */}
          <Card className="gap-0 py-0">
            <CardHeader className="py-3">
              <CardTitle className="text-base">Notas</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <Textarea
                rows={3}
                placeholder="Notas internas del pedido…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog: selector de productos del inventario, con estilo de tabla */}
      <Dialog open={productsOpen} onOpenChange={setProductsOpen}>
        <DialogContent className="flex max-h-[80vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="px-4 pt-4 pb-3">
            <DialogTitle>Seleccionar productos</DialogTitle>
            <DialogDescription className="sr-only">
              Busca en tu inventario y selecciona los productos del pedido.
            </DialogDescription>
          </DialogHeader>

          {/* Barra de búsqueda y filtro */}
          <div className="flex items-center gap-2 px-4 pb-3">
            <InputGroup className="h-9 flex-1">
              <InputGroupAddon>
                <Search className="size-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Buscar producto o SKU…"
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
              />
            </InputGroup>
            <Select
              items={pickerFilters}
              value={pickerFilter}
              onValueChange={(v) => setPickerFilter(v ?? "todo")}
            >
              <SelectTrigger className="h-9 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(pickerFilters).map(([v, label]) => (
                    <SelectItem key={v} value={v}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Tabla de inventario con selección múltiple */}
          <div className="min-h-0 flex-1 overflow-y-auto border-t">
            <Table className="data-table table-sticky-header">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 pl-4">
                    <Checkbox
                      checked={allFilteredSelected}
                      onCheckedChange={toggleAllPick}
                      aria-label="Seleccionar todos"
                    />
                  </TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Disponible</TableHead>
                  <TableHead className="pr-4 text-right">Precio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-10 text-center text-sm text-muted-foreground"
                    >
                      Sin resultados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <TableRow
                      key={item.sku}
                      className="cursor-pointer"
                      data-state={
                        pickerSelected.has(item.sku) ? "selected" : undefined
                      }
                      onClick={() => togglePick(item.sku)}
                    >
                      <TableCell className="pl-4">
                        <Checkbox
                          checked={pickerSelected.has(item.sku)}
                          onCheckedChange={() => togglePick(item.sku)}
                          aria-label={`Seleccionar ${item.product}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="size-9 shrink-0 rounded-md bg-muted" />
                          <p className="min-w-0 truncate font-normal text-foreground">
                            {item.product}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {item.available <= 0 ? (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <TriangleAlert className="size-3.5 text-warning" />
                            0
                          </span>
                        ) : (
                          item.available
                        )}
                      </TableCell>
                      <TableCell className="pr-4 text-right tabular-nums">
                        {formatCurrency(item.unitCost)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <DialogFooter className="mx-0 mb-0 items-center px-4 py-3">
            <span className="mr-auto text-sm text-muted-foreground">
              {pickerSelected.size}{" "}
              {pickerSelected.size === 1 ? "seleccionado" : "seleccionados"}
            </span>
            <Button variant="outline" onClick={() => setProductsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmProducts}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
