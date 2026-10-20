import { Download, PackagePlus, Pencil, SlidersHorizontal } from "lucide-react"
import { toast } from "sonner"

import {
  formatCurrency,
  inventory,
  inventoryMetrics,
  type InventoryItem,
} from "@/lib/mock-data"
import { PageActions } from "@/components/layout/page-actions"
import {
  DataTableShell,
  type DataColumn,
} from "@/components/data-table/data-table-shell"
import { StockStatusBadge } from "@/components/inventory/stock-status-badge"
import { Button } from "@/components/ui/button"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

const filterItems: Record<string, string> = {
  todos: "Todos",
  en_stock: "En stock",
  bajo: "Bajo stock",
  agotado: "Agotados",
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
    cell: (r) => <StockStatusBadge status={r.status} />,
  },
  {
    key: "costo",
    label: "Costo unitario",
    headClass: "min-w-32 text-right",
    cellClass: "text-right tabular-nums",
    cell: (r) => formatCurrency(r.unitCost),
  },
]

export function InventoryPage() {
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
        metricsLabel="Hoy"
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
        rows={inventory}
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
    </>
  )
}
