import { useState } from "react"
import {
  ChevronDown,
  Download,
  PackagePlus,
  Pencil,
  SlidersHorizontal,
} from "lucide-react"
import { toast } from "sonner"

import {
  formatCurrency,
  inventory,
  inventoryMetrics,
  stockStatusLabel,
  type InventoryItem,
  type StockStatus,
} from "@/lib/mock-data"
import { PageActions } from "@/components/layout/page-actions"
import {
  DataTableShell,
  type DataColumn,
} from "@/components/data-table/data-table-shell"
import { StockStatusBadge } from "@/components/inventory/stock-status-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

const filterItems: Record<string, string> = {
  todos: "Todos",
  en_stock: "En stock",
  bajo: "Bajo stock",
  agotado: "Agotados",
}

export function InventoryPage() {
  const [rows, setRows] = useState<InventoryItem[]>(inventory)
  // Edición rápida de costo unitario
  const [costEdit, setCostEdit] = useState<InventoryItem | null>(null)
  const [costValue, setCostValue] = useState("")

  const setStatus = (sku: string, status: StockStatus) =>
    setRows((prev) =>
      prev.map((row) => (row.sku === sku ? { ...row, status } : row))
    )

  const openCostEdit = (row: InventoryItem) => {
    setCostValue(String(row.unitCost))
    setCostEdit(row)
  }

  const saveCost = () => {
    if (!costEdit) return
    const value = Number(costValue)
    if (!Number.isFinite(value) || value < 0) {
      toast.error("Ingresa un costo válido.")
      return
    }
    setRows((prev) =>
      prev.map((row) =>
        row.sku === costEdit.sku ? { ...row, unitCost: value } : row
      )
    )
    toast.success(`Costo actualizado para ${costEdit.sku}`)
    setCostEdit(null)
  }

  const columns: DataColumn<InventoryItem>[] = [
    { key: "sku", label: "SKU", headClass: "min-w-40", cellClass: "font-mono text-xs", cell: (r) => r.sku },
    { key: "categoria", label: "Categoría", headClass: "min-w-32", cell: (r) => r.category },
    { key: "ubicacion", label: "Ubicación", headClass: "min-w-36", cell: (r) => r.location },
    {
      key: "disponible",
      label: "Disponible",
      headClass: "min-w-28 text-right",
      cellClass: "text-right tabular-nums",
      cell: (r) => r.available,
    },
    {
      key: "comprometido",
      label: "Comprometido",
      headClass: "min-w-32 text-right",
      cellClass: "text-right tabular-nums text-muted-foreground",
      cell: (r) => r.committed,
    },
    {
      key: "existencias",
      label: "En existencia",
      headClass: "min-w-32 text-right",
      cellClass: "text-right tabular-nums",
      cell: (r) => r.onHand,
    },
    {
      key: "estado",
      label: "Estado",
      headClass: "min-w-32",
      // Edición rápida: clic sobre el estado para cambiarlo; se cierra al elegir.
      cell: (r) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button type="button" className="inline-flex cursor-pointer" />
            }
          >
            <StockStatusBadge status={r.status} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuRadioGroup
              value={r.status}
              onValueChange={(value) => setStatus(r.sku, value as StockStatus)}
            >
              <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
              {Object.entries(stockStatusLabel).map(([value, label]) => (
                <DropdownMenuRadioItem key={value} value={value} closeOnClick>
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      key: "costo",
      label: "Costo unitario",
      headClass: "min-w-32 text-right",
      // Celda editable: el botón se posiciona absoluto para cubrir toda la
      // altura de la celda; hover cambia el fondo y muestra chevron; clic abre
      // el dialog.
      cellClass: "relative p-0",
      cell: (r) => (
        <button
          type="button"
          onClick={() => openCostEdit(r)}
          className="group/cost absolute inset-0 flex cursor-pointer items-center justify-end gap-1 px-3 tabular-nums transition-colors hover:bg-foreground/10"
        >
          {formatCurrency(r.unitCost)}
          <ChevronDown className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover/cost:opacity-100" />
        </button>
      ),
    },
  ]

  return (
    <>
      <PageActions>
        <Button variant="outline">
          <Download data-icon="inline-start" />
          Exportar
        </Button>
        <Button>
          <PackagePlus data-icon="inline-start" />
          Agregar producto
        </Button>
      </PageActions>

      <DataTableShell
        metrics={inventoryMetrics}
        filterItems={filterItems}
        matchesFilter={(row, filter) => filter === "todos" || row.status === filter}
        matchesSearch={(row, query) =>
          row.product.toLowerCase().includes(query.toLowerCase()) ||
          row.sku.toLowerCase().includes(query.toLowerCase())
        }
        searchPlaceholder="Buscar por producto o SKU"
        primaryHeader="Producto"
        primaryHeadClass="min-w-56"
        primaryCell={(row) => row.product}
        columns={columns}
        rows={rows}
        getRowId={(row) => row.sku}
        entityPlural="productos"
        rowActions={(row) => (
          <>
            <DropdownMenuItem onClick={() => toast.info(`Editando ${row.sku}`)}>
              <Pencil />
              Editar producto
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => toast.success(`Ajuste de inventario para ${row.sku}`)}
            >
              <SlidersHorizontal />
              Ajustar existencias
            </DropdownMenuItem>
          </>
        )}
      />

      {/* Dialog de edición rápida de costo unitario */}
      <Dialog
        open={!!costEdit}
        onOpenChange={(open) => !open && setCostEdit(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Editar costo unitario</DialogTitle>
            <DialogDescription>{costEdit?.product}</DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="cost-value">Costo unitario</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="cost-value"
                type="number"
                min={0}
                step="0.01"
                value={costValue}
                onChange={(e) => setCostValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveCost()}
                autoFocus
              />
            </InputGroup>
          </Field>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancelar
            </DialogClose>
            <Button onClick={saveCost}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
