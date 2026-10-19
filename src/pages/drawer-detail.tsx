import { useMemo, useState } from "react"
import { Mail, MapPin, Phone, Plus } from "lucide-react"
import { toast } from "sonner"

import {
  formatCurrency,
  formatDate,
  orders,
  type Order,
} from "@/lib/mock-data"
import { PageActions } from "@/components/layout/page-actions"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
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

type Customer = {
  name: string
  email: string
  address: string
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

export function DrawerDetailPage() {
  const customers = useMemo<Customer[]>(() => {
    const byEmail = new Map<string, Customer>()
    for (const order of orders) {
      const existing = byEmail.get(order.email)
      if (existing) {
        existing.orders.push(order)
        existing.totalSpent += order.total
      } else {
        byEmail.set(order.email, {
          name: order.customer,
          email: order.email,
          address: order.address,
          orders: [order],
          totalSpent: order.total,
        })
      }
    }
    return [...byEmail.values()].sort((a, b) => b.totalSpent - a.totalSpent)
  }, [])

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  return (
    <>
      <PageActions>
        <Button>
          <Plus data-icon="inline-start" />
          Agregar cliente
        </Button>
      </PageActions>

      <Card className="py-0">
        <CardContent className="px-0">
          <Table className="data-table">
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Cliente</TableHead>
                <TableHead className="hidden lg:table-cell">Correo</TableHead>
                <TableHead className="hidden md:table-cell">Ubicación</TableHead>
                <TableHead className="text-center">Pedidos</TableHead>
                <TableHead className="text-right pr-4">Total gastado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow
                  key={customer.email}
                  className="cursor-pointer"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <TableCell className="pl-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-6">
                        <AvatarFallback className="text-[10px]">
                          {initials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {customer.email}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {customer.address}
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {customer.orders.length}
                  </TableCell>
                  <TableCell className="pr-4 text-right tabular-nums">
                    {formatCurrency(customer.totalSpent)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Drawer de detalle: un solo Sheet controlado para toda la lista */}
      <Sheet
        open={selectedCustomer !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedCustomer(null)
        }}
      >
        <SheetContent className="w-full sm:max-w-md">
          {selectedCustomer && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback>
                      {initials(selectedCustomer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle>{selectedCustomer.name}</SheetTitle>
                    <SheetDescription>
                      Cliente desde octubre 2026
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 space-y-6 overflow-y-auto px-4">
                {/* Resumen rápido */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Pedidos</p>
                    <p className="text-lg font-semibold tabular-nums">
                      {selectedCustomer.orders.length}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">
                      Total gastado
                    </p>
                    <p className="text-lg font-semibold tabular-nums">
                      {formatCurrency(selectedCustomer.totalSpent)}
                    </p>
                  </div>
                </div>

                {/* Datos de contacto */}
                <div className="space-y-2 text-sm">
                  <h3 className="font-medium">Contacto</h3>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="size-4" />
                    {selectedCustomer.email}
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-4" />
                    +52 55 0000 0000
                  </p>
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="size-4" />
                    {selectedCustomer.address}
                  </p>
                </div>

                <Separator />

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
                  <TabsContent value="pedidos" className="space-y-3 pt-2">
                    {selectedCustomer.orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-lg border p-3 text-sm"
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
                  <TabsContent value="actividad" className="space-y-3 pt-2">
                    {[
                      { label: "Pedido creado", date: "18 oct 2026" },
                      { label: "Correo de bienvenida enviado", date: "17 oct 2026" },
                      { label: "Cuenta creada", date: "16 oct 2026" },
                    ].map((event) => (
                      <div
                        key={event.label}
                        className="flex items-center justify-between text-sm"
                      >
                        <span>{event.label}</span>
                        <Badge variant="secondary">{event.date}</Badge>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>

              <SheetFooter className="flex-row">
                <Button
                  className="flex-1"
                  onClick={() => toast.info("Abrir edición del cliente")}
                >
                  Editar cliente
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => toast.info("Creando pedido…")}
                >
                  Crear pedido
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
